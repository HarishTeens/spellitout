import { Deepgram } from "@deepgram/sdk";
import { translateText } from "./gTranslate";
import { io } from "..";
import { LiveTranscription } from "@deepgram/sdk/dist/transcription/liveTranscription";
const client = new Deepgram(process.env.DEEPGRAM_API_KEY);

function getSpeaker(words) {
    if (!words || words.length === 0) return 0;
  
    return Number(words[0]?.speaker) + 1;
  }
const setupDeepgram = (socket, src, target) => {
    let keepAlive;
    let deepgram: LiveTranscription;
    if (src === "es") {
        deepgram = client.transcription.live({
            language: "es",
            model: "general",
            tier: "enhanced",
            punctuate: true
        });
    } else {
        deepgram = client.transcription.live({
            punctuate: true
        });
    }


    if (keepAlive) clearInterval(keepAlive);
    keepAlive = setInterval(() => {
        console.log("deepgram: keepalive");
        deepgram.keepAlive();
    }, 10 * 1000);

    deepgram.addListener("open", async () => {
        console.log("deepgram: connected");

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
                    const speaker = "Speaker " + getSpeaker(data.channel.alternatives[0].words) +": ";
                    io.emit("transcript", {
                        [src]: transcript,
                        [target]: await translateText(transcript, src, target),
                        speaker
                    });
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