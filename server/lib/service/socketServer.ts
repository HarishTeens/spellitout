import cache from "memory-cache";
import DG from "./deepgram";
import { io } from "..";

function getClientDeepgram(socket, dgMap) {
  const socketId = socket.id;
  const attendeesLangMap = cache.get("attendeesLangMap");
  const attendee = attendeesLangMap[socketId];

  if (!attendee) return [null, null];

  const deepgram = dgMap[attendee.in];
  return [deepgram, attendee];
}

export default function (socket) {
  console.log("socket: client connected");

  const isMeetingRunning = cache.get("isMeetingRunning");
  const isSDKsLoaded = cache.get("isSDKsLoaded");

  if (!isMeetingRunning) {
    io.disconnectSockets();
  }

  let deepgramEN, deepgramES;
  if (isMeetingRunning && !isSDKsLoaded) {
    deepgramES = DG.setupDeepgram(socket, "es", "en");
    deepgramEN = DG.setupDeepgram(socket, "en", "es");
    cache.put("isSDKsLoaded", true);
  }

  socket.emit("client-id", socket.id);
  socket.on("packet-sent", (data) => {
    // console.log("socket: client data received");
    // console.log(socket.id);

    let [deepgram, attendee] = getClientDeepgram(socket, {
      en: deepgramEN,
      es: deepgramES,
    });

    if (!deepgram || !attendee) return;

    if (deepgram.getReadyState() === 1 /* OPEN */) {
      // console.log("socket: data sent to deepgram");
      deepgram.send(data);
    } else if (deepgram.getReadyState() >= 2 /* 2 = CLOSING, 3 = CLOSED */) {
      // console.log("socket: data couldn't be sent to deepgram");
      /* Attempt to reopen the Deepgram connection */
      deepgram.finish();
      deepgram.removeAllListeners();
      if (deepgramES.getReadyState()) {
        console.log("socket: retrying connection to deepgram ES");
        deepgramES = DG.setupDeepgram(socket, "es", "en");
        deepgramES.getReadyState()
      }
      if (deepgramEN.getReadyState()) {
        console.log("socket: retrying connection to deepgram EN");
        deepgramEN = DG.setupDeepgram(socket, "en", "es");
        deepgramEN.getReadyState();
      }
      // deepgram = DG.setupDeepgram(socket, attendee.in, attendee.out);
    } else {
      console.log("socket: data couldn't be sent to deepgram " + attendee.in);
    }
  });

  socket.on("disconnect", () => {
    if (isMeetingRunning === false)
      [deepgramEN, deepgramES].forEach((deepgram) => {
        if (!deepgram) return;
        deepgram.finish();
        deepgram.removeAllListeners();
        deepgram = null;
      });
  });
}
