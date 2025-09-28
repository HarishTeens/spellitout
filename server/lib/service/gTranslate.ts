// Instantiates a client
import { TranslationServiceClient } from "@google-cloud/translate";
import { SUPPORTED_LANGUAGES } from "../config/constants";
const translationClient = new TranslationServiceClient({
  keyFilename: process.env.GOOGLE_KEY_FILE,
});
const projectId = "spellitout";
const location = "global";

export async function translateAll(text, src, response) {
  const targets = SUPPORTED_LANGUAGES.filter((lang) => lang.id !== src);
  try {
    await Promise.all(
      targets.map(async (target) => {
        response[target.id] = await translateText(text, src, target.id);
      })
    );
  } catch (error) {
    console.error("Translation error:", error);
  }
}

export async function translateText(text, src, target) {
  if (!text || !text.trim()) return;
  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: "text/plain", // mime types: text/plain, text/html
    sourceLanguageCode: src,
    targetLanguageCode: target,
  };

  // Run request
  const [response] = await translationClient.translateText(request);

  for (const translation of response.translations) {
    console.log(`Translation: ${translation.translatedText}`);
    return translation.translatedText;
  }
}
