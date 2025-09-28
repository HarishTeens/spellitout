import { ListenLiveClient } from "@deepgram/sdk";

export type SupportedLanguages = "en" | "es";
export interface InpOut {
  in: SupportedLanguages;
  out: SupportedLanguages;
}
export type LangMap = Map<string, InpOut>;
export type DeepgramSDKMap = {
  [key: string]: ListenLiveClient;
};
