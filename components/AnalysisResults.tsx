'use client';

import { useState } from 'react';
import {
  FileText,
  Lightbulb,
  Tag,
  CheckSquare,
  Users,
  RotateCcw,
  Copy,
  Check,
  TrendingUp,
  Clock,
  BookOpen,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';
import type { AnalysisData } from '@/types/analysis';

interface AnalysisResultsProps {
  data: AnalysisData;
  onReset: () => void;
}

export default function AnalysisResults({ data, onReset }: AnalysisResultsProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'insights' | 'entities' | 'actions'>('summary');

  const { analysis } = data;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(analysis.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const SentimentIcon = analysis.sentiment === 'positive' ? Smile : analysis.sentiment === 'negative' ? Frown : Meh;
  const sentimentColor =
    analysis.sentiment === 'positive'
      ? 'text-green-500'
      : analysis.sentiment === 'negative'
      ? 'text-red-500'
      : 'text-yellow-500';

  const importanceColors: Record<string, string> = {
    high: 'border-red-400 bg-red-50',
    medium: 'border-yellow-400 bg-yellow-50',
    low: 'border-green-400 bg-green-50',
  };

  const importanceBadge: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };

  const entityTypeColors: Record<string, string> = {
    person: 'bg-purple-100 text-purple-700',
    organization: 'bg-blue-100 text-blue-700',
    location: 'bg-green-100 text-green-700',
    date: 'bg-orange-100 text-orange-700',
    concept: 'bg-indigo-100 text-indigo-700',
  };

  const tabs = [
    { id: 'summary' as const, label: 'Summary', icon: FileText },
    { id: 'insights' as const, label: 'Key Insights', icon: Lightbulb },
    { id: 'entities' as const, label: 'Entities', icon: Users },
    { id: 'actions' as const, label: 'Action Items', icon: CheckSquare },
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analysis Complete</h2>
          <p className="text-sm text-gray-500 mt-1">
            {data.fileName} &bull; {new Date(data.processedAt).toLocaleString()}
          </p>
        </div>
        <button onClick={onReset} className="btn-secondary flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          New Analysis
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="w-5 h-5 text-blue-500" />}
          label="Word Count"
          value={analysis.wordCount.toLocaleString()}
          bg="bg-blue-50"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-indigo-500" />}
          label="Read Time"
          value={`~${analysis.estimatedReadTime} min`}
          bg="bg-indigo-50"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          label="Readability"
          value={`${analysis.readabilityScore}/100`}
          bg="bg-emerald-50"
        />
        <StatCard
          icon={<SentimentIcon className={`w-5 h-5 ${sentimentColor}`} />}
          label="Sentiment"
          value={analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
          bg="bg-gray-50"
        />
      </div>

      {/* Topics */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-gray-500" />
          <h3 className="font-semibold text-gray-700">Identified Topics</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.topics.map((topic, i) => (
            <span
              key={topic}
              className={`tag ${
                i < 3 ? 'bg-blue-100 text-blue-700' : i < 6 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="card overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Document Summary</h3>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{analysis.summary}</p>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Key Insights</h3>
              {analysis.keyInsights.map((insight) => (
                <div
                  key={insight.id}
                  className={`insight-card p-4 rounded-xl ${importanceColors[insight.importance] || 'border-gray-300 bg-gray-50'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${importanceBadge[insight.importance] || 'bg-gray-100 text-gray-600'}`}>
                          {insight.importance}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-lg border whitespace-nowrap">
                      {insight.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'entities' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Key Entities</h3>
              {analysis.keyEntities.length === 0 ? (
                <p className="text-gray-400 text-sm">No specific entities detected.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.keyEntities.map((entity, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className={`tag ${entityTypeColors[entity.type] || 'bg-gray-100 text-gray-600'}`}>
                          {entity.type}
                        </span>
                        <span className="font-medium text-gray-800">{entity.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{entity.mentions}x</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Recommended Action Items</h3>
              <div className="space-y-3">
                {analysis.actionItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}) {
  return (
    <div className={`card p-4 ${bg}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
