import { Deepgram } from "@deepgram/sdk";
import { translateAll } from "./gTranslate";
import { io } from "..";
import { LiveTranscription } from "@deepgram/sdk/dist/transcription/liveTranscription";
const client = new Deepgram(process.env.DEEPGRAM_API_KEY);
import cache from "memory-cache";
import { SUPPORTED_LANGUAGES } from "../config/constants";

function getSpeaker(socket) {
    const attendeesLangMap = cache.get("attendeesLangMap");
    const attendee = attendeesLangMap[socket.id];
    return attendee.name || "Anonymous";
}
const setupDeepgram = (socket, src) => {
    let keepAlive;
    let deepgram: LiveTranscription;

    const langConfig = SUPPORTED_LANGUAGES.find((lang) => lang.id === src);
    if (!langConfig) {
        throw new Error("Language not supported")
    }
    deepgram = client.transcription.live(langConfig.dConfig);

    if (keepAlive) clearInterval(keepAlive);
    keepAlive = setInterval(() => {
        console.log("deepgram: keepalive");
        deepgram.keepAlive();
    }, 10 * 1000);

    deepgram.addListener("open", async () => {
        console.log("deepgram: connected for ", src);

        deepgram.addListener("close", async () => {
            console.log("deepgram: disconnected");
            clearInterval(keepAlive);
            deepgram.finish();
        });

        deepgram.addListener("error", async (error) => {
            console.log("deepgram: error recieved");
            console.error(error);
        });

        deepgram.addListener("transcriptReceived", async (packet) => {
            console.log("deepgram: packet received");
            const data = JSON.parse(packet);
            const { type } = data;
            switch (type) {
                case "Results":
                    console.log("deepgram: transcript received");
                    const transcript = data.channel.alternatives[0].transcript ?? "";
                    const speaker = getSpeaker(socket).slice(0,12) + " : ";
                    const response = {
                        [src]: transcript,
                        speaker
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
    });

    return deepgram;
};

export default {
    setupDeepgram
}