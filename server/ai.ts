import OpenAI from "openai";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY || "fallback_if_needed",
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

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error("No completion choices returned from OpenRouter");
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw error;
  }
}
