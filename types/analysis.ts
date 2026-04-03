export interface Insight {
  id: string;
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  category: string;
}

export interface Entity {
  name: string;
  type: 'person' | 'organization' | 'location' | 'date' | 'concept';
  mentions: number;
}

export interface Analysis {
  summary: string;
  keyInsights: Insight[];
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  readabilityScore: number;
  wordCount: number;
  estimatedReadTime: number;
  keyEntities: Entity[];
  actionItems: string[];
}

export interface AnalysisData {
  success: boolean;
  fileName: string;
  analysis: Analysis;
  processedAt: string;
}
