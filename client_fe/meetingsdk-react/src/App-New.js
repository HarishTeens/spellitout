import React from "react";
import { useRef, useState } from "react";
import "./App.css";
import ZoomMtgEmbedded from "@zoomus/websdk/embedded";
import RecordRTC from "recordrtc";

function App() {
  const client = ZoomMtgEmbedded.createClient();

  const audioRecorder = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  var authEndpoint = "http://localhost:4000";
  var sdkKey = "bayN4Pi2RIGICReh7Cijrw";
  var meetingNumber = "71653091368";
  var passWord = "8rgsV3";
  var role = 0;
  var userName = "React";
  var userEmail = "";
  var registrantToken = "";
  var zakToken = "";
  function getSignature(e) {
    e.preventDefault();

    fetch(authEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        startMeeting(response.signature);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function startMeeting(signature) {
    let meetingSDKElement = document.getElementById("meetingSDKElement");

    client.init({
      debug: true,
      zoomAppRoot: meetingSDKElement,
      language: "en-US",
      customize: {
        meetingInfo: [
          "topic",
          "host",
          "mn",
          "pwd",
          "telPwd",
          "invite",
          "participant",
          "dc",
          "enctype",
        ],
        toolbar: {
          buttons: [
            {
              text: "Custom Button",
              className: "CustomButton",
              onClick: () => {
                console.log("custom button");
              },
            },
          ],
        },
      },
    });

    client.join({
      signature: signature,
      sdkKey: sdkKey,
      meetingNumber: meetingNumber,
      password: passWord,
      userName: userName,
      userEmail: userEmail,
      tk: registrantToken,
      zak: zakToken,
    });
  }

  const startRecording = () => {
    console.log("Recording started");
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioRecorder.current = RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/wav",
        });
        audioRecorder.current.startRecording();
        setIsRecording(true);
      })
      .catch(function (error) {
        console.error("Error accessing the microphone:", error);
      });
  };

  const stopRecording = () => {
    console.log("Recording stopped");

    if (audioRecorder.current) {
      audioRecorder.current.stopRecording(function () {
        const audioBlob = audioRecorder.current.getBlob();
        // You can send the audioBlob to your server or perform other actions.
        setIsRecording(false);
      });
    }
  };

  return (
    <div className="App">
      <main>
        <h1>Zoom Meeting SDK Sample React</h1>

        {/* For Component View */}
        <div id="meetingSDKElement">
          {/* Zoom Meeting SDK Component View Rendered Here */}
        </div>

        <button onClick={getSignature}>Join Meeting</button>
        <button onClick={startRecording} disabled={isRecording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          Stop Recording
        </button>
      </main>
    </div>
  );
}

export default App;
