import OpenAI from "openai";

const OPENROUTER_API_KEY = "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";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://replit.com",
    "X-Title": "Designfolio",
  }
});

export async function getAiCompletion(prompt: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemma-3-27b-it:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw error;
  }
}
