//================= CONFIG =================
// Global Variables
const websocket_uri = 'ws://127.0.0.1:5001';
const bufferSize = 1024;

let AudioContext, context, processor, input, globalStream, websocket;

// Initialize WebSocket
initWebSocket();
setTimeout(()=> {startRecording()}, 2000);  

function initWebSocket() {
    // Create WebSocket
    websocket = new WebSocket(websocket_uri);
    //console.log("Websocket created...");
  
    // WebSocket Definitions: executed when triggered webSocketStatus
    websocket.onopen = function() {
      console.log("connected to server");
      //websocket.send("CONNECTED TO YOU");
    }
    
    websocket.onclose = function(e) {
      console.log("connection closed (" + e.code + ")");
    }
    
    websocket.onmessage = function(e) {
      //console.log("message received: " + e.data);
      console.log(e.data);
  
    }
} // closes function initWebSocket()

//================= RECORDING =================
async function startRecording() {
    try {
        AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext({
            latencyHint: 'interactive',
        });
        processor = context.createScriptProcessor(bufferSize, 1, 1);
        processor.connect(context.destination);
        await context.resume();

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        globalStream = stream;
        input = context.createMediaStreamSource(stream);
        input.connect(processor);

        processor.onaudioprocess = (e) => {
            const left = e.inputBuffer.getChannelData(0);
            const left16 = downsampleBuffer(left, 44100,22021)
            console.log('sending ', left16)
            websocket.send(left16);
        };
    } catch (error) {
        console.error('Error starting recording:', error);
    }
}

function stopRecording() {

    if (globalStream) {
        const track = globalStream.getTracks()[0];
        track.stop();
    }

    if (input) {
        input.disconnect(processor);
    }

    if (processor) {
        processor.disconnect(context.destination);
    }

    if (context) {
        context.close().then(() => {
            input = null;
            processor = null;
            context = null;
            AudioContext = null;
        });
    }
}


function downsampleBuffer (buffer, sampleRate, outSampleRate) {
    if (outSampleRate === sampleRate) {
      return buffer;
    }
    if (outSampleRate > sampleRate) {
      throw new Error('downsampling rate show be smaller than original sample rate');
    }
    var sampleRateRatio = sampleRate / outSampleRate;
    var newLength = Math.round(buffer.length / sampleRateRatio);
    var result = new Int16Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
      var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      var accum = 0,
        count = 0;
      for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
  
      result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result.buffer;
} // closes function downsampleBuffer()