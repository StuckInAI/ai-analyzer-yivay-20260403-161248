import { NextRequest, NextResponse } from 'next/server';

interface AnalysisResult {
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

interface Insight {
  id: string;
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  category: string;
}

interface Entity {
  name: string;
  type: 'person' | 'organization' | 'location' | 'date' | 'concept';
  mentions: number;
}

function generateAnalysis(text: string): AnalysisResult {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  // Sentiment analysis simulation
  const positiveWords = ['good', 'great', 'excellent', 'positive', 'success', 'improve', 'benefit', 'advantage', 'effective', 'efficient'];
  const negativeWords = ['bad', 'poor', 'negative', 'fail', 'problem', 'issue', 'risk', 'concern', 'challenge', 'difficult'];
  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter((w) => lowerText.includes(w)).length;
  const negativeCount = negativeWords.filter((w) => lowerText.includes(w)).length;
  const sentiment: 'positive' | 'neutral' | 'negative' =
    positiveCount > negativeCount ? 'positive' : negativeCount > positiveCount ? 'negative' : 'neutral';

  // Readability score (simplified Flesch-Kincaid)
  const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : wordCount;
  const readabilityScore = Math.min(100, Math.max(0, Math.round(100 - avgWordsPerSentence * 1.5)));

  // Extract topics
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'this', 'that', 'these', 'those', 'it', 'its', 'as', 'not', 'no']);
  const wordFreq: Record<string, number> = {};
  words.forEach((word) => {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    if (clean.length > 4 && !commonWords.has(clean)) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  });
  const topics = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

  // Generate summary
  const firstSentences = sentences.slice(0, 3).join('. ');
  const summary = firstSentences
    ? `${firstSentences.trim()}.\n\nThis document contains ${wordCount} words covering ${topics.slice(0, 3).join(', ')} and related topics. The overall tone is ${sentiment} with an estimated reading time of ${estimatedReadTime} minute${estimatedReadTime > 1 ? 's' : ''}.`
    : `Document analyzed: ${wordCount} words. Topics include ${topics.slice(0, 3).join(', ') || 'general content'}. Reading time: ~${estimatedReadTime} min.`;

  // Generate key insights
  const insights: Insight[] = [
    {
      id: '1',
      title: 'Document Structure',
      description: `The document contains ${sentences.length} sentences with an average of ${Math.round(avgWordsPerSentence)} words per sentence, indicating ${avgWordsPerSentence > 20 ? 'complex' : 'clear'} writing style.`,
      importance: 'high',
      category: 'Structure',
    },
    {
      id: '2',
      title: 'Content Density',
      description: `With ${wordCount} words, this is a ${wordCount > 1000 ? 'comprehensive' : wordCount > 300 ? 'moderate' : 'concise'} document. Key themes revolve around ${topics.slice(0, 2).join(' and ') || 'the main subject'}.`,
      importance: 'high',
      category: 'Content',
    },
    {
      id: '3',
      title: 'Readability Assessment',
      description: `Readability score: ${readabilityScore}/100. The text is ${readabilityScore > 70 ? 'easy to read and accessible' : readabilityScore > 40 ? 'moderately complex' : 'highly technical or complex'} for the target audience.`,
      importance: readabilityScore < 40 ? 'high' : 'medium',
      category: 'Readability',
    },
    {
      id: '4',
      title: 'Sentiment Analysis',
      description: `The document carries a ${sentiment} sentiment. ${sentiment === 'positive' ? 'The content uses constructive and optimistic language.' : sentiment === 'negative' ? 'The content highlights challenges and concerns.' : 'The content maintains an objective and balanced tone.'}`,
      importance: 'medium',
      category: 'Sentiment',
    },
    {
      id: '5',
      title: 'Topic Coverage',
      description: `${topics.length} distinct topics identified: ${topics.slice(0, 5).join(', ')}${topics.length > 5 ? ' and more' : ''}. The content ${topics.length > 5 ? 'covers multiple areas' : 'stays focused on core topics'}.`,
      importance: 'medium',
      category: 'Topics',
    },
  ];

  // Generate entities
  const entities: Entity[] = [
    ...topics.slice(0, 4).map((topic, i) => ({
      name: topic,
      type: 'concept' as const,
      mentions: Math.max(1, (wordFreq[topic.toLowerCase()] || 1)),
    })),
  ];

  // Generate action items
  const actionItems: string[] = [
    `Review the ${topics[0] || 'main'} section for completeness`,
    `Consider improving readability score from ${readabilityScore} to above ${Math.min(100, readabilityScore + 15)}`,
    `Expand on ${topics[1] || 'secondary'} topics for better coverage`,
    sentiment === 'negative' ? 'Reframe negative language to be more constructive' : 'Maintain the positive tone throughout',
    `Verify all key claims related to ${topics[2] || 'the main subject'}`,
  ];

  return {
    summary,
    keyInsights: insights,
    topics,
    sentiment,
    readabilityScore,
    wordCount,
    estimatedReadTime,
    keyEntities: entities,
    actionItems,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { text?: string; fileName?: string };
    const { text, fileName } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      );
    }

    if (text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Document content is too short for analysis' },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const analysis = generateAnalysis(text);

    return NextResponse.json({
      success: true,
      fileName: fileName || 'document',
      analysis,
      processedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to analyze document' },
      { status: 500 }
    );
  }
}
