import io from "socket.io-client";
import api from "@/lib/api";

async function getMicrophone() {
  const userMedia = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });

  return new MediaRecorder(userMedia);
}

async function openMicrophone(microphone: any, socket: any) {
  await microphone.start(500);

  microphone.onstart = () => {
    console.log("client: microphone opened");
  };

  microphone.onstop = () => {
    console.log("client: microphone closed");
    socket.emit("packet-sent", "end");
    socket.emit("disconnect");
    socket.close();
  };

  microphone.ondataavailable = (e: any) => {
    if (microphone.state === "inactive") return;
    console.log("client: sent data to websocket");
    socket.emit("packet-sent", e.data);
  };
}

async function start(socket: any) {
  const listenButton = document.getElementById("record") as any;
  let microphone: any;

  console.log("client: waiting to open microphone");

  microphone = await getMicrophone();
  await openMicrophone(microphone, socket);

  return microphone;
}

function connectSocket(microphoneRef: any) {
  const url = process.env.NEXT_PUBLIC_SERVER_BASE_URL || "";
  const socket = io(url, { transports: ["websocket"] });

  socket.on("connect", async () => {
    console.log("client: connected to websocket");
  });

  socket.on("client-id", async (id: any) => {
    console.log("client: received client id ", id);
    const inputLang = localStorage.getItem("inputLang") || "en";
    const outputLang = localStorage.getItem("outputLang") || "en";
    await api.joinMeeting({ inp: inputLang, out: outputLang, socketId: id });
    microphoneRef.current = await start(socket);
  });

  return socket;
}

export default connectSocket;
