import io from "socket.io-client";
import api from "@/lib/api";

let isStopped = false;
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
    socket.disconnect();
    socket.emit("end");
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
  let microphone;

  socket.on("connect", async () => {
    console.log("client: connected to websocket");
  });

  socket.on("client-id", async (id: any) => {
    console.log("client: received client id ", id);
    const prefLang = localStorage.getItem("prefLang") || "en";
    const name = localStorage.getItem("name") || "Anonymous";
    await api.joinMeeting({ prefLang, name, socketId: id });
    microphone = await start(socket);
    microphoneRef.current = microphone;
  });

  socket.on("disconnect", () => {
    console.log("client: disconnected from websocket");
    microphoneRef.current?.stop();
    window.location.href = "/";
  });

  return socket;
}

export default connectSocket;
