import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function test() {

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Say hello"
  });

  console.log(response.text);
}

test();