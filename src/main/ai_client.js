import { resolveResourcePath } from "./utils";
import fs from "fs";
const { OpenAI } = require("openai");

let openai = null;
let systemPrompt = "You are a helpful assistant.";

export const setupOpenAI = (apiKey) => {
  try {
    const systemPromptPath = resolveResourcePath("systemPrompt.md");
    systemPrompt = fs.readFileSync(systemPromptPath, "utf8");
    openai = new OpenAI({ apiKey });
  } catch (error) {
    console.error("Error setting up OpenAI:", error);
  }
};

export async function callChatGPT(userPrompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
  }
}
