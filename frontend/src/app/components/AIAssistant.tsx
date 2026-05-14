import { useState, useRef, useEffect } from 'react';
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
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  StopCircle,
  Send
} from 'lucide-react';
import { motion } from 'motion/react';
import { useSpeech } from '../../lib/hooks/useSpeech';
import { streamCerebrasChat, ChatMessage } from '../../lib/cerebrasClient';

export default function AIAssistant() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Voice integration
  const { speechState, startListening, speak, cancel } = useSpeech();
  const abortControllerRef = useRef<AbortController | null>(null);

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

  const handleSendMessage = async (text?: string) => {
    const messageContent = text || currentInput.trim();
    if (!messageContent) return;

    setCurrentInput('');
    cancel(); // Stop any active speech

    const newUserMessage: ChatMessage = { role: 'user', content: messageContent };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      abortControllerRef.current = new AbortController();
      
      // Add empty assistant message that we will stream into
      setMessages([...newMessages, { role: 'assistant', content: '' }]);

      await streamCerebrasChat(
        [
          { role: 'system', content: 'You are a helpful and intelligent AI tutor for a student. Keep answers concise, clear, and encouraging.' },
          ...newMessages
        ],
        (chunk) => {
          setMessages(prev => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === 'assistant') {
              last.content += chunk;
            }
            return updated;
          });
        },
        abortControllerRef.current.signal
      );
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please check your API key or connection.' }]);
      }
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsTyping(false);
    }
  };

  const toggleMic = () => {
    if (speechState === 'listening') {
      cancel();
    } else {
      startListening((text, _match) => {
        handleSendMessage(text);
      });
    }
  };

  useEffect(() => {
    return () => cancel(); // Cleanup on unmount
  }, [cancel]);

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
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[500px]">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 shrink-0">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Ask AI Anything
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 my-10">
                <Brain className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p>Hello! I am your AI tutor. Ask me anything.</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                    {msg.role === 'assistant' && msg.content && !isTyping && (
                      <button 
                        onClick={() => speak(msg.content)}
                        className="mt-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Read aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm shadow-sm p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-slate-500">AI is typing...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <div className="flex gap-2">
              <button
                onClick={toggleMic}
                className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                  speechState === 'listening' 
                    ? 'bg-red-100 text-red-600 animate-pulse' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={speechState === 'listening' ? "Stop listening" : "Start speaking"}
              >
                {speechState === 'listening' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={speechState === 'listening' ? "Listening..." : "Ask me to explain a concept..."}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none bg-slate-50"
              />
              
              {isTyping ? (
                <button 
                  onClick={handleStopGenerating}
                  className="px-4 py-3 bg-red-100 text-red-600 rounded-xl font-medium shadow-sm hover:bg-red-200 transition-all flex items-center gap-2"
                >
                  <StopCircle className="w-5 h-5" />
                  Stop
                </button>
              ) : (
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={!currentInput.trim() && speechState !== 'listening'}
                  className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send
                </button>
              )}
            </div>
            {messages.length === 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                <button 
                  onClick={() => handleSendMessage("Explain derivatives in simple terms")}
                  className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Explain derivatives
                </button>
                <button 
                  onClick={() => handleSendMessage("Create a short practice quiz for calculus")}
                  className="px-3 py-1.5 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  Create practice quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
