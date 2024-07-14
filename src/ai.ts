import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { z } from "zod";
import { getGroqApiKey } from "./apikey-state";

const getModel = async () => {
  const GROQ_API_KEY = await getGroqApiKey() || ""
  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: GROQ_API_KEY,
  });

  const model = groq('llama3-70b-8192');
  return model
}

const responseSchema = z.object({
  result_text: z.string().nullable(),
  hasValidLanguageSyntax: z.boolean().nullable(),
})

export const streamAIResponse = async (prompt: string) => {
  const model = await getModel()
  try {
    const { partialObjectStream, object } = await streamObject({
      model,
      temperature: 0.2,
      prompt,
      system: "Response only with the result_text and hasValidLanguageSyntax properties, and nothing else. If the text is not valid, hasValidLanguageSyntax should be false. Don't translate the result_text.",
      schema: responseSchema,
    })
    return { partialObjectStream, object }
  } catch (error) {
    console.error("streamAIResponse error", error);
    return {
      error
    }
  }
};

export type StreamAIResponseReturn = Awaited<ReturnType<typeof streamAIResponse>>;