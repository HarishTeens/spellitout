import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { translateAll } from "./gTranslate";
import { io } from "..";
const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);
import cache from "memory-cache";
import { SUPPORTED_LANGUAGES } from "../config/constants";

function getSpeaker(socket) {
  const attendeesLangMap = cache.get("attendeesLangMap");
  const attendee = attendeesLangMap[socket.id];
  return attendee.name || "Anonymous";
}
const setupDeepgram = (socket, src) => {
  let keepAlive;
  let deepgram;

  const langConfig = SUPPORTED_LANGUAGES.find((lang) => lang.id === src);
  if (!langConfig) {
    throw new Error("Language not supported");
  }
  const deepgramConnection = deepgramClient.listen.live({
    model: "nova-3",
    // live transcription options
  });

  //   if (keepAlive) clearInterval(keepAlive);
  //   keepAlive = setInterval(() => {
  //     console.log("deepgram: keepalive");
  //     deepgramConnection.keepAlive();
  //   }, 10 * 1000);

  deepgramConnection.on(LiveTranscriptionEvents.Error, (error) => {
    console.log(`deepgram: error: ${error.message}`);
    // console.error(error);
    // clearInterval(keepAlive);
  });

  deepgramConnection.on(LiveTranscriptionEvents.Open, () => {
    console.log("deepgram: connected for ", src);
    deepgramConnection.on(LiveTranscriptionEvents.Transcript, async (data) => {
      console.log("deepgram: packet received");
      const { type } = data;
      switch (type) {
        case "Results":
          console.log("deepgram: transcript received");
          const transcript = data.channel.alternatives[0].transcript ?? "";
          const speaker = getSpeaker(socket).slice(0, 12) + " : ";
          const response = {
            [src]: transcript,
            speaker,
          };
          await translateAll(transcript, src, response);
          io.emit("transcript", response);
          break;
        case "Metadata":
          console.log("deepgram: metadata received");
          break;
        default:
          console.log("deepgram: unknown packet received");
          break;
      }
    });

    deepgramConnection.on(LiveTranscriptionEvents.Close, async () => {
      console.log("deepgram: disconnected");
      clearInterval(keepAlive);
    });

    deepgramConnection.on(LiveTranscriptionEvents.Error, (error) => {
      console.log("deepgram: error");
      console.error(error);
      clearInterval(keepAlive);
    });
  });

  return deepgramConnection;
};

export default {
  setupDeepgram,
};
