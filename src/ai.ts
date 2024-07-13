import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { z } from "zod";

const GROQ_API_KEY = "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"

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: GROQ_API_KEY,
});

const model = groq('llama3-70b-8192');

const responseSchema = z.object({
  result_text: z.string().nullable(),
  hasValidLanguageSyntax: z.boolean().nullable(),
})

export const streamAIResponse = async (prompt: string) => {
  const { partialObjectStream, object } = await streamObject({
    model,
    temperature: 0.2,
    prompt,
    system: "Response only with the result_text and hasValidLanguageSyntax properties, and nothing else. If the text is not valid, hasValidLanguageSyntax should be false. Don't translate the result_text.",
    schema: responseSchema,
  })
  return { partialObjectStream, object }
};

export type StreamAIResponseReturn = Awaited<ReturnType<typeof streamAIResponse>>;