import cache from "memory-cache";
import DG from "./deepgram";
import { SUPPORTED_LANGUAGES } from "../config/constants";
import { DeepgramSDKMap } from "../config/types";
import { delayMS } from "../utils";

function getClientDeepgram(socket, dgMap) {
  const socketId = socket.id;
  const attendeesLangMap = cache.get("attendeesLangMap");
  const attendee = attendeesLangMap[socketId];

  if (!attendee) return [null, null];

  const deepgram = dgMap[attendee.prefLang];
  return [deepgram, attendee];
}

export default async function (socket) {
  console.log("socket: client connected");
  const isMeetingRunning = cache.get("isMeetingRunning"),
    isSDKReady = cache.get("isSDKReady");
  if (!isMeetingRunning) {
    socket.emit("error", "Meeting is not running");
    socket.disconnect();
    return;
  }
  const deepgramSDKs: DeepgramSDKMap = {};
  for (const lang of SUPPORTED_LANGUAGES) {
    deepgramSDKs[lang.id] = DG.setupDeepgram(socket, lang.id);
    await delayMS(1000);
  }

  socket.emit("client-id", socket.id);
  socket.on("packet-sent", (data) => {
    console.log("socket: client data received");
    console.log(socket.id);

    let [deepgram, attendee] = getClientDeepgram(socket, deepgramSDKs);
    if (!deepgram || !attendee) return;

    if (deepgram.getReadyState() === 1 /* OPEN */) {
      console.log("socket: data sent to deepgram");
      deepgram.send(data);
    } else if (deepgram.getReadyState() >= 2 /* 2 = CLOSING, 3 = CLOSED */) {
      console.log("socket: data couldn't be sent to deepgram");
      console.log("socket: retrying connection to deepgram");
      /* Attempt to reopen the Deepgram connection */
      // deepgram.finish();
      // deepgram.removeAllListeners();
      // deepgram = DG.setupDeepgram(socket, attendee.in);
    } else {
      console.log("socket: data couldn't be sent to deepgram");
    }
  });
  socket.on("disconnect", () => {
    if (isMeetingRunning === false)
      Object.values(deepgramSDKs).forEach((deepgram) => {
        if (!deepgram) return;
        deepgram.finish();
        deepgram.removeAllListeners();
        deepgram = null;
      });
  });
}
