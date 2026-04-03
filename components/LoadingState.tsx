'use client';

import { Brain, Cpu, FileSearch, Lightbulb } from 'lucide-react';

interface LoadingStateProps {
  progress: number;
}

const steps = [
  { icon: FileSearch, label: 'Reading document', threshold: 20 },
  { icon: Cpu, label: 'Processing content', threshold: 45 },
  { icon: Brain, label: 'Analyzing insights', threshold: 70 },
  { icon: Lightbulb, label: 'Generating summary', threshold: 90 },
];

export default function LoadingState({ progress }: LoadingStateProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="card p-10 max-w-md w-full text-center">
        {/* Animated Brain */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-20 animate-ping" />
          <div className="absolute inset-2 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-30 animate-ping" style={{ animationDelay: '0.3s' }} />
          <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
            <Brain className="w-12 h-12 text-white animate-pulse" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Your Document</h3>
        <p className="text-gray-500 text-sm mb-8">Our AI is extracting insights and generating your report...</p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Processing</span>
            <span>{Math.round(clampedProgress)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full progress-bar rounded-full transition-all duration-300"
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3 text-left">
          {steps.map(({ icon: Icon, label, threshold }) => {
            const isActive = clampedProgress >= threshold;
            return (
              <div
                key={label}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-blue-50' : 'opacity-40'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>
                  {label}
                </span>
                {isActive && (
                  <div className="ml-auto w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
