import { Deepgram } from "@deepgram/sdk";
import { translateText } from "./gTranslate";
const client = new Deepgram(process.env.DEEPGRAM_API_KEY);


const setupDeepgram = (socket, src, target) => {
    let keepAlive;
    let deepgram;
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
            console.log(packet, null, 4);
            const data = JSON.parse(packet);
            const { type } = data;
            switch (type) {
                case "Results":
                    console.log("deepgram: transcript received");
                    const transcript = data.channel.alternatives[0].transcript ?? "";
                    console.log("socket: transcript sent to client");
                    socket.emit("transcript", {
                        [src]: transcript,
                        [target]: await translateText(transcript, src, target)
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