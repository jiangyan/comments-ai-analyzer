export interface RawComment {
  id: string;
  author: string;
  content: string;
  isReply: boolean;
  replyTo?: string;
}

export enum SentimentType {
  SUPPORT = 'SUPPORT', // Landlords/Sellers supporting price hikes
  OPPOSE = 'OPPOSE',   // Buyers/Critics opposing price hikes or waiting for drop
  NEUTRAL = 'NEUTRAL'  // Irrelevant, jokes, or objective observations
}

export interface AnalyzedComment extends RawComment {
  sentiment: SentimentType;
  reasoning: string;
}

export interface AppContextType {
  comments: RawComment[];
  setComments: (comments: RawComment[]) => void;
  analyzedData: AnalyzedComment[];
  setAnalyzedData: (data: AnalyzedComment[]) => void;
}
