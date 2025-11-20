import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RawComment, AnalyzedComment, SentimentType } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

// Analyze a specific batch of comments
const analyzeBatch = async (ai: GoogleGenAI, batch: RawComment[]): Promise<AnalyzedComment[]> => {
  const prompt = `
    你是一名AI助手，正在分析关于房价讨论的微信视频号评论。
    背景是以下两组人群之间的博弈与争论：
    1. 房东/卖家（业主）：希望房价维持高位或上涨。他们往往“抱团保价”，互相鼓励不要低价出售。
    2. 买家/批评者（唱空派）：认为房价过高、即将下跌，或者对房东进行讽刺和批评。
    
    任务：分析以下评论列表，并将每条评论归类为以下三个类别之一：

    - ${SentimentType.SUPPORT}：用户支持房东/卖方立场。鼓励“挺价”、拒绝贱卖，或坚信房价会上涨。
    - ${SentimentType.OPPOSE}：用户反对房东立场。代表买家或唱空者，认为房价会跌，或嘲讽房东。
    - ${SentimentType.NEUTRAL}：用户态度中立。包括提问、无关调侃、或陈述客观事实。

    输入数据 (JSON):
    ${JSON.stringify(batch.map(c => ({ id: c.id, author: c.author, text: c.content })))}`;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        sentiment: { 
          type: Type.STRING, 
          enum: [SentimentType.SUPPORT, SentimentType.OPPOSE, SentimentType.NEUTRAL] 
        },
        reasoning: { type: Type.STRING }
      },
      required: ["id", "sentiment", "reasoning"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });

    const text = response.text;
    if (!text) return [];

    const results = JSON.parse(text) as { id: string, sentiment: SentimentType, reasoning: string }[];
    
    return results.map(res => {
      const original = batch.find(c => c.id === res.id);
      if (!original) return null;
      return {
        ...original,
        sentiment: res.sentiment,
        reasoning: res.reasoning
      } as AnalyzedComment;
    }).filter((item): item is AnalyzedComment => item !== null);

  } catch (error) {
    console.error("Batch analysis failed:", error);
    return []; // Return empty for this batch on error to allow others to proceed
  }
};

export const analyzeSentiment = async (comments: RawComment[]): Promise<AnalyzedComment[]> => {
  if (comments.length === 0) return [];

  // Reduced BATCH_SIZE from 30 to 15.
  // Gemini output limit is ~8k tokens. 
  // 15 items * ~200 tokens/item (including Chinese reasoning) = ~3000 tokens.
  // This leaves plenty of buffer and prevents "Unterminated string in JSON" errors.
  const BATCH_SIZE = 15; 
  const CONCURRENCY = 3; // Number of parallel requests to speed up processing
  
  // Cap total comments to ensure browser stability, though 3000 is quite safe with this architecture.
  const commentsToAnalyze = comments.slice(0, 3000);
  const ai = getAiClient();
  
  const results: AnalyzedComment[] = [];
  
  // Create batches
  const batches: RawComment[][] = [];
  for (let i = 0; i < commentsToAnalyze.length; i += BATCH_SIZE) {
    batches.push(commentsToAnalyze.slice(i, i + BATCH_SIZE));
  }

  // Process batches with concurrency limit
  for (let i = 0; i < batches.length; i += CONCURRENCY) {
    const currentBatches = batches.slice(i, i + CONCURRENCY);
    const promises = currentBatches.map(batch => analyzeBatch(ai, batch));
    
    // Wait for current chunk of concurrent requests to finish
    const batchResults = await Promise.all(promises);
    batchResults.forEach(res => results.push(...res));
  }

  return results;
};