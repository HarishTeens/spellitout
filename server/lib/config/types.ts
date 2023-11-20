import { LiveTranscription } from "@deepgram/sdk/dist/transcription/liveTranscription";

export type SupportedLanguages = 'en' | 'es';
export interface InpOut {
    in: SupportedLanguages;
    out: SupportedLanguages;
}
export type LangMap = Map<string, InpOut>
export type DeepgramSDKMap = {
    [key: string]: LiveTranscription;
};