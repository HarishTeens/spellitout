const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

let mediaRecorder;
let socket;
let audioContext;
let processor;
let source;

startButton.addEventListener("click", startStreaming);
stopButton.addEventListener("click", stopStreaming);

websocket_uri = "ws://localhost:5000";
query_params = "&encoding=linear16&sample_rate=16000";
final_uri = websocket_uri + "?";

function startStreaming() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      audioContext = new AudioContext();
      source = audioContext.createMediaStreamSource(stream);
      processor = audioContext.createScriptProcessor(1024, 1, 1);
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = onMediaDataAvailable;
      mediaRecorder.start();

      socket = new WebSocket(websocket_uri);

      socket.onopen = onSocketOpen;
      socket.onmessage = onSocketMessage;

      startButton.disabled = true;
      stopButton.disabled = false;
    })
    .catch(function (error) {
      console.error("Error accessing microphone:", error);
    });
}

function onMediaDataAvailable(event) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(event.data);
  }
}

function stopStreaming() {
  // Send a JSON message to close the stream
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "CloseStream" }));
  }

  mediaRecorder.stop();
  startButton.disabled = false;
  stopButton.disabled = true;
}

function onSocketOpen() {
  console.log("WebSocket connection is open");
}

function onSocketMessage(event) {
  // Handle the real-time transcription response from Deepgram
  const response = JSON.parse(event.data);
  if (response.type === "Transcript") {
    console.log("Transcription: " + response.data.text);
  }
}
