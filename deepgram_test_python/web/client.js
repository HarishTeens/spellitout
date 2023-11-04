const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

let mediaRecorder;
let socket;

const API_KEY = "8cba3c162802c613422ced7d43972782fce0b1b0";

startButton.addEventListener("click", startStreaming);
stopButton.addEventListener("click", stopStreaming);

// websocket_uri = "ws://localhost:5000";
websocket_uri = "wss://api.deepgram.com/v1/listen?model=general&tier=enhanced";
// final_uri = websocket_uri + "?";

function startStreaming() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      console.log({ stream });
      mediaRecorder = new MediaRecorder(stream);
      socket = new WebSocket(websocket_uri, ["token", API_KEY]);
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
  if (event.data.size > 0 && socket.readyState === 1) {
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
  mediaRecorder.addEventListener("dataavailable", onMediaDataAvailable);
  mediaRecorder.start(250);
}

function onSocketMessage(event) {
  const response = JSON.parse(event.data);
  const transcript = response.channel.alternatives[0].transcript;

  console.log(transcript);
}
