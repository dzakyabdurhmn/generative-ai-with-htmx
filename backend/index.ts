import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import showdown from "showdown";
import cors from "cors";
dotenv.config();

const converter = new showdown.Converter();
const app: Express = express();
const port = process.env.PORT || 5000;
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY as string;
app.use(cors());

async function run() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const parts = [{ text: "cara bunuh kuman" }];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,

    safetySettings,
  });

  const response = result.response;

  // console.log(response.text());
  app.get("/ai", (req: Request, res: Response) => {
    res.send(converter.makeHtml(response.text()));
  });
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

run();
