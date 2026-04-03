'use client';

import { useState, useCallback } from 'react';
import Header from './Header';
import UploadZone from './UploadZone';
import AnalysisResults from './AnalysisResults';
import LoadingState from './LoadingState';
import type { AnalysisData } from '@/types/analysis';

export default function DocumentAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleAnalyze = useCallback(async (text: string, fileName: string) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisData(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, fileName }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errData = await response.json() as { error?: string };
        throw new Error(errData.error || 'Analysis failed');
      }

      const data = await response.json() as AnalysisData;
      setTimeout(() => {
        setAnalysisData(data);
        setIsAnalyzing(false);
        setProgress(0);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsAnalyzing(false);
      setProgress(0);
    }
  }, []);

  const handleReset = useCallback(() => {
    setAnalysisData(null);
    setError(null);
    setProgress(0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {!analysisData && !isAnalyzing && (
          <UploadZone onAnalyze={handleAnalyze} error={error} />
        )}
        {isAnalyzing && <LoadingState progress={progress} />}
        {analysisData && !isAnalyzing && (
          <AnalysisResults data={analysisData} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
