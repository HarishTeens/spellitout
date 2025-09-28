export const SUPPORTED_LANGUAGES = [
  {
    id: "en",
    name: "English",
    dConfig: {
      punctuate: true,
    },
  },
  {
    id: "hi",
    name: "Hindi (हिंदी)",
    dConfig: {
      language: "hi",
      punctuate: true,
    },
  },
  {
    id: "es",
    name: "Spanish (Español)",
    dConfig: {
      language: "es",
      model: "general",
      tier: "enhanced",
      punctuate: true,
    },
  },
  {
    id: "tr",
    name: "Turkish (Türkçe)",
    dConfig: {
      language: "tr",
      model: "general",
      tier: "base",
      punctuate: true,
    },
  },
];
