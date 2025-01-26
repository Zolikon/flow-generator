import { resolveResourcePath } from "./utils";
import fs from "fs";
const { OpenAI } = require("openai");

let openai = null;
let systemPrompt = "You are a helpful assistant.";
let testPrompt;

export const setupOpenAI = (apiKey) => {
  try {
    const systemPromptPath = resolveResourcePath("systemPrompt.md");
    systemPrompt = fs.readFileSync(systemPromptPath, "utf8");
    testPrompt = fs.readFileSync(resolveResourcePath("aiAvailable.md"), "utf8");
    openai = new OpenAI({ apiKey });
  } catch (error) {
    console.error("Error setting up OpenAI:", error);
  }
};

export async function testAiConnection(testKey) {
  try {
    const response = await new OpenAI({
      apiKey: testKey,
    }).chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: testPrompt }],
    });
    return response.choices[0]?.message?.content && true;
  } catch (error) {
    console.error("Error testing AI connection:", error);
    return false;
  }
}

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
