'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, AlertCircle, Wand2 } from 'lucide-react';

interface UploadZoneProps {
  onAnalyze: (text: string, fileName: string) => void;
  error: string | null;
}

const SAMPLE_TEXT = `Artificial Intelligence in Modern Healthcare: A Comprehensive Overview

Artificial intelligence is rapidly transforming the healthcare industry, bringing unprecedented improvements in diagnosis accuracy, treatment planning, and patient outcomes. Machine learning algorithms can now analyze medical images with accuracy that rivals or exceeds human specialists in many domains.

Key Benefits and Applications:

Diagnostic Excellence: AI systems have demonstrated remarkable success in detecting diseases such as cancer, diabetic retinopathy, and cardiovascular conditions from medical imaging data. Studies show that deep learning models can identify malignant tumors with 94% accuracy, compared to 88% for human radiologists working alone.

Drug Discovery Acceleration: The traditional drug discovery process takes 10-15 years and costs billions of dollars. AI platforms are compressing this timeline significantly by predicting molecular interactions, identifying promising drug candidates, and optimizing clinical trial designs.

Personalized Medicine: By analyzing genetic data, lifestyle factors, and medical history, AI enables truly personalized treatment plans. This approach improves treatment efficacy while reducing adverse effects and unnecessary procedures.

Operational Efficiency: Healthcare facilities using AI-powered scheduling and resource management report 30% reductions in patient wait times and significant cost savings in administrative processes.

Challenges and Considerations:

Despite these benefits, implementation faces several challenges including data privacy concerns, regulatory compliance requirements, integration with legacy systems, and the need for extensive validation before clinical deployment. Healthcare organizations must also address algorithmic bias to ensure equitable care across diverse patient populations.

Future Outlook:

The global AI in healthcare market is projected to reach $45 billion by 2026, reflecting strong confidence in the technology's transformative potential. As AI systems become more sophisticated and clinical evidence accumulates, we can expect broader adoption and continued improvement in patient outcomes worldwide.`;

export default function UploadZone({ onAnalyze, error }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      setActiveTab('paste');
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleSubmit = useCallback(() => {
    if (text.trim()) {
      onAnalyze(text, fileName || 'pasted-document');
    }
  }, [text, fileName, onAnalyze]);

  const handleSample = useCallback(() => {
    setText(SAMPLE_TEXT);
    setFileName('healthcare-ai-overview.txt');
    setActiveTab('paste');
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          Analyze Your{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Documents
          </span>
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Upload or paste any document to extract key insights, generate summaries, and uncover hidden patterns using AI.
        </p>
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {['Smart Summaries', 'Key Insights', 'Sentiment Analysis', 'Topic Extraction', 'Action Items'].map((feature) => (
          <span key={feature} className="bg-white border border-gray-200 text-gray-600 text-sm px-4 py-1.5 rounded-full shadow-sm">
            ✨ {feature}
          </span>
        ))}
      </div>

      {/* Main Card */}
      <div className="card p-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            Paste Text
          </button>
        </div>

        {activeTab === 'upload' && (
          <div
            className={`upload-zone rounded-2xl p-12 text-center cursor-pointer ${isDragging ? 'drag-over' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".txt,.md,.csv,.json,.xml,.html"
              onChange={handleFileInput}
            />
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Drop your file here</h3>
            <p className="text-gray-400 text-sm mb-4">or click to browse files</p>
            <p className="text-xs text-gray-400">Supports: TXT, MD, CSV, JSON, XML, HTML</p>
          </div>
        )}

        {activeTab === 'paste' && (
          <div className="space-y-3">
            {fileName && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                <FileText className="w-4 h-4" />
                <span className="font-medium">{fileName}</span>
              </div>
            )}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your document content here..."
              className="w-full h-64 p-4 border border-gray-200 rounded-xl text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent scrollbar-thin"
            />
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{text.trim().split(/\s+/).filter(Boolean).length} words</span>
              <span>{text.length} characters</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="btn-primary flex items-center gap-2 flex-1 justify-center"
          >
            <Wand2 className="w-4 h-4" />
            Analyze Document
          </button>
          <button onClick={handleSample} className="btn-secondary flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Try Sample
          </button>
        </div>
      </div>
    </div>
  );
}
