import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Brain, Upload, FileText, Sparkles, ArrowLeft, Download,
  Clock, BookOpen, Lightbulb, CheckSquare, Loader2, FileCheck,
  MessageSquare, Mic, MicOff, Volume2, StopCircle, Send,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

import { useSpeech } from '../../lib/hooks/useSpeech';
import { useAIEngine, AIMode } from '../../lib/hooks/useAIEngine';

// Configure PDFJS worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function AIAssistant() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'kk' ? 'Kazakh' : i18n.language === 'ru' ? 'Russian' : 'English';

  const {
    mode, setMode,
    chatHistory,
    documentText,
    isProcessing, currentStream,
    processChat,
    processDocumentJSON,
    executeIntent,
    clearMemory
  } = useAIEngine();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [chatInput, setChatInput] = useState('');
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
  
  // Voice integration
  const { speechState, startListening, speak, cancel } = useSpeech();
  const abortControllerRef = useRef<AbortController | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, currentStream]);

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = e.target?.result;
          if (!result) return resolve('');
          if (file.type === 'application/pdf') {
            const typedarray = new Uint8Array(result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            let fullText = '';
            for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map((item: any) => item.str).join(' ');
              fullText += pageText + '\n';
            }
            resolve(fullText);
          } else if (file.name.endsWith('.docx')) {
            const arrayBuffer = result as ArrayBuffer;
            const docxResult = await mammoth.extractRawText({ arrayBuffer });
            resolve(docxResult.value);
          } else {
            resolve(result as string);
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      if (file.type === 'application/pdf' || file.name.endsWith('.docx')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setShowAnswers({});
      setAiResponse(null);

      try {
        abortControllerRef.current = new AbortController();
        const text = await extractTextFromFile(file);
        
        const data = await processDocumentJSON(text, lang, abortControllerRef.current.signal);
        if (data) {
          setAiResponse(data);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Error processing file:", error);
          alert("Error processing file. Please try again.");
        }
      }
    }
  };

  const handleSendMessage = async (text?: string) => {
    const msg = text || chatInput;
    if (!msg.trim() || isProcessing) return;

    setChatInput('');
    cancel(); // Stop voice if active

    try {
      abortControllerRef.current = new AbortController();
      await processChat(msg, lang, abortControllerRef.current.signal);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
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

  // Quick action intents
  const handleIntent = (intent: string, newMode: AIMode) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    executeIntent(intent, lang, newMode, abortControllerRef.current.signal);
  };

  const modes: { id: AIMode; icon: any; label: string }[] = [
    { id: 'chat', icon: MessageSquare, label: t('ai.modeChat', 'Chat') },
    { id: 'document', icon: FileText, label: t('ai.modeDocument', 'Document') },
    { id: 'study', icon: Lightbulb, label: t('ai.modeStudy', 'Study') },
    { id: 'exam', icon: GraduationCap, label: t('ai.modeExam', 'Exam') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-12">
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 p-2 rounded-xl">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">{t('ai.title', 'AccessMind AI Workspace')}</h1>
                  <p className="text-xs text-slate-600">{t('ai.pageTitle', 'Unified Educational Assistant')}</p>
                </div>
              </div>
            </div>
            
            {/* Mode Selector */}
            <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
              {modes.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === m.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <m.icon className="w-4 h-4" />
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Context & Upload */}
          <div className="space-y-6">
            {/* Upload Zone */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  {t('ai.uploadTitle', 'Document Context')}
                </h3>
              </div>

              <label className="block">
                <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} className="hidden" />
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-md font-semibold text-slate-900 mb-1">{t('ai.clickToUpload', 'Upload learning material')}</h4>
                  <p className="text-xs text-slate-500">{t('ai.supportedFiles', 'PDF, DOCX, TXT. This gives AI memory of your textbook.')}</p>
                </div>
              </label>

              {selectedFile && !isProcessing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">{selectedFile.name}</p>
                      <p className="text-xs text-blue-700">{t('ai.readyTitle', 'Loaded into AI memory')}</p>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedFile(null); setDocumentText(null); setAiResponse(null); }} className="text-xs font-medium text-blue-700 hover:underline">
                    {t('common.remove', 'Remove')}
                  </button>
                </motion.div>
              )}
            </div>

            {/* AI Response Display (Only if Document was analyzed and we have JSON response) */}
            {aiResponse && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-blue-600" /> {t('ai.summaryTitle', 'Summary')}
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-sm">{aiResponse.summary}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-green-600" /> {t('ai.simplifiedTitle', 'Simplified Explanation')}
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-sm">{aiResponse.simplified}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <CheckSquare className="w-5 h-5 text-purple-600" /> {t('ai.keyPointsTitle', 'Key Points')}
                  </h3>
                  <ul className="space-y-3">
                    {aiResponse.keyPoints?.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-purple-600">{idx + 1}</span>
                        </div>
                        <span className="text-sm text-slate-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {aiResponse.quiz && aiResponse.quiz.length > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg border border-orange-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <CheckSquare className="w-5 h-5 text-orange-600" /> {t('ai.quizTitle', 'Mini Quiz')}
                    </h3>
                    <div className="space-y-4">
                      {aiResponse.quiz.map((item: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-xl p-4 border border-orange-200">
                          <p className="font-semibold text-sm text-slate-900 mb-2">Q{idx + 1}: {item.question}</p>
                          {showAnswers[idx] ? (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-700 bg-green-50 p-2 rounded-lg mt-2 border border-green-100">
                              <strong>Answer:</strong> {item.answer}
                            </motion.p>
                          ) : (
                            <button onClick={() => setShowAnswers({ ...showAnswers, [idx]: true })} className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                              {t('ai.showAnswer', 'Show Answer')}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {!aiResponse && !documentText && !isProcessing && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center h-[300px] flex flex-col justify-center items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-slate-500 font-medium">{t('ai.heroSubtitle', 'Upload a document to extract insights')}</p>
              </div>
            )}
            
            {isProcessing && mode === 'document' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center h-[300px] flex flex-col justify-center items-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium animate-pulse">{t('ai.processingTitle', 'Analyzing Document...')}</p>
              </div>
            )}
          </div>

          {/* Right Column - Unified Chat Workspace */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col h-[700px]">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 shrink-0 rounded-t-2xl flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {t('ai.chatTitle', 'AI Tutor Chat')}
              </h3>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-white/20 rounded-md text-xs font-medium text-white backdrop-blur-sm uppercase">
                  {mode} MODE
                </span>
                <button onClick={clearMemory} className="text-white/80 hover:text-white text-xs underline">
                  {t('ai.clearMemory', 'Clear Memory')}
                </button>
              </div>
            </div>
            
            {/* Quick Actions / Intents */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              <button onClick={() => handleIntent("Пожалуйста, объясни сложную концепцию из этого материала простыми словами", "study")} className="shrink-0 px-3 py-1.5 text-xs bg-white border border-blue-200 text-blue-700 rounded-full hover:bg-blue-50 transition-colors shadow-sm">
                💡 {t('ai.feat1Title', 'Объясни проще')}
              </button>
              <button onClick={() => handleIntent("Сделай небольшую проверку моих знаний по текущему материалу. Задавай вопросы по одному.", "exam")} className="shrink-0 px-3 py-1.5 text-xs bg-white border border-purple-200 text-purple-700 rounded-full hover:bg-purple-50 transition-colors shadow-sm">
                📝 {t('ai.feat4Title', 'Сделай тест')}
              </button>
              <button onClick={() => handleIntent("Приведи реальный пример из жизни для этой темы", "study")} className="shrink-0 px-3 py-1.5 text-xs bg-white border border-green-200 text-green-700 rounded-full hover:bg-green-50 transition-colors shadow-sm">
                🌍 {t('ai.feat3Title', 'Дай пример')}
              </button>
            </div>

            {/* Chat Messages */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.length === 0 && !currentStream && (
                <div className="text-center text-slate-500 my-10">
                  <Brain className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p>{t('ai.greeting', 'I am your AccessMind Educational Tutor.')}</p>
                  <p className="text-sm mt-1">{t('ai.chatPlaceholder', 'Ask me anything, or upload a document.')}</p>
                </div>
              )}
              
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                    {msg.role === 'assistant' && (
                      <button onClick={() => speak(msg.content)} className="mt-2 text-slate-400 hover:text-blue-600 transition-colors" title="Read aloud">
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Streaming Message */}
              {currentStream && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-slate-100 border border-slate-200 text-slate-800 rounded-2xl rounded-bl-none p-4">
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{currentStream}</p>
                  </div>
                </div>
              )}
              
              {isProcessing && mode !== 'document' && !currentStream && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 border border-slate-200 text-slate-800 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-slate-500">{t('ai.processingTitle', 'Thinking...')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={toggleMic}
                  className={`p-3 rounded-xl transition-all flex-shrink-0 ${speechState === 'listening' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {speechState === 'listening' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={speechState === 'listening' ? t('ai.listening', 'Listening...') : t('ai.chatPlaceholder', 'Ask your tutor anything...')}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  disabled={isProcessing}
                />
                
                {isProcessing ? (
                  <button onClick={handleStopGenerating} className="px-4 py-3 bg-red-100 text-red-600 rounded-xl font-medium shadow-sm hover:bg-red-200 transition-all flex items-center gap-2">
                    <StopCircle className="w-5 h-5" />
                  </button>
                ) : (
                  <button onClick={() => handleSendMessage()} disabled={!chatInput.trim() && speechState !== 'listening'} className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2">
                    <Send className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
