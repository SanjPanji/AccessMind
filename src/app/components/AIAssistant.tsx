import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Brain,
  Upload,
  FileText,
  Sparkles,
  ArrowLeft,
  Download,
  Clock,
  BookOpen,
  Lightbulb,
  CheckSquare,
  Loader2,
  FileCheck,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AIAssistant() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      simulateAIProcessing();
    }
  };

  const simulateAIProcessing = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setAiResponse({
        summary: 'This document covers advanced calculus concepts including derivatives, integrals, and their applications in real-world scenarios.',
        simplified: 'Calculus helps us understand how things change. Derivatives show the rate of change, while integrals help us find total amounts.',
        keyPoints: [
          'Derivatives measure instantaneous rate of change',
          'The fundamental theorem connects derivatives and integrals',
          'Real-world applications include physics, economics, and engineering',
          'Practice problems focus on chain rule and integration by parts'
        ],
        quiz: [
          { question: 'What does a derivative measure?', answer: 'Rate of change' },
          { question: 'What is the relationship between derivatives and integrals?', answer: 'Fundamental theorem of calculus' }
        ]
      });
    }, 2500);
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Simplify Text',
      description: 'Convert complex academic content into easy-to-understand language',
      color: 'blue'
    },
    {
      icon: FileText,
      title: 'Create Summaries',
      description: 'Generate concise summaries of lengthy documents and lectures',
      color: 'purple'
    },
    {
      icon: Lightbulb,
      title: 'Explain Concepts',
      description: 'Get detailed explanations of difficult topics in simple words',
      color: 'green'
    },
    {
      icon: CheckSquare,
      title: 'Generate Quizzes',
      description: 'Create practice questions to test your understanding',
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 p-2 rounded-xl">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">AI Learning Assistant</h1>
                  <p className="text-xs text-slate-600">Powered by advanced AI technology</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 mb-4">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-slate-700">AI-Powered Learning</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Transform Your Learning Materials
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload any document and let AI simplify, summarize, and create study materials just for you
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Features */}
          <div className="space-y-6">
            {/* Upload Zone */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Upload Your Materials
              </h3>

              <label className="block">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">
                    Click to upload or drag and drop
                  </h4>
                  <p className="text-sm text-slate-600">
                    PDF, DOCX, or TXT files supported
                  </p>
                </div>
              </label>

              {selectedFile && !processing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-3"
                >
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">{selectedFile.name}</p>
                    <p className="text-xs text-blue-700">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* AI Features */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md border border-slate-200 p-5 hover:shadow-lg transition-all"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-${feature.color}-50 mb-3`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - AI Response */}
          <div className="space-y-6">
            {processing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 animate-pulse">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Your Document...</h3>
                  <p className="text-slate-600">AI is analyzing and generating insights</p>
                  <div className="mt-6 space-y-2">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-3/4 mx-auto animate-pulse"></div>
                    <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full w-1/2 mx-auto animate-pulse"></div>
                  </div>
                </div>
              </motion.div>
            )}

            {aiResponse && !processing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Summary */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Summary
                    </h3>
                    <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                      <Download className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{aiResponse.summary}</p>
                </div>

                {/* Simplified Explanation */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                    Simplified Explanation
                  </h3>
                  <p className="text-slate-700 leading-relaxed">{aiResponse.simplified}</p>
                </div>

                {/* Key Points */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <CheckSquare className="w-5 h-5 text-purple-600" />
                    Key Points
                  </h3>
                  <ul className="space-y-3">
                    {aiResponse.keyPoints.map((point: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-purple-600">{index + 1}</span>
                        </div>
                        <span className="text-slate-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mini Quiz */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg border border-orange-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <CheckSquare className="w-5 h-5 text-orange-600" />
                    Practice Quiz
                  </h3>
                  <div className="space-y-4">
                    {aiResponse.quiz.map((item: any, index: number) => (
                      <div key={index} className="bg-white rounded-xl p-4 border border-orange-200">
                        <p className="font-semibold text-slate-900 mb-2">Q{index + 1}: {item.question}</p>
                        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                          Show Answer
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all">
                    Save to My Notes
                  </button>
                  <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-all">
                    Upload Another
                  </button>
                </div>
              </motion.div>
            )}

            {!processing && !aiResponse && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl mb-6">
                  <Brain className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Assist</h3>
                <p className="text-slate-600">
                  Upload a document to get started with AI-powered learning
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Chat Interface */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Ask AI Anything
            </h3>
          </div>
          <div className="p-6">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ask me to explain a concept, summarize a topic, or help with your assignment..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all">
                Ask
              </button>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <button className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                Explain derivatives
              </button>
              <button className="px-4 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                Summarize Chapter 5
              </button>
              <button className="px-4 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                Create practice problems
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
