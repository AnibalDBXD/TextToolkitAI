const GROQ_API_KEY_KEY = "groq-api-key";

export const getGroqApiKey = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(GROQ_API_KEY_KEY, (result) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      }
      resolve(result[GROQ_API_KEY_KEY]);
    });
  })
};

export const setGroqApiKey = (apiKey: string) => {
  chrome.storage.sync.set({ [GROQ_API_KEY_KEY]: apiKey });
  console.log("Saved groqApiKey to storage", apiKey);
};