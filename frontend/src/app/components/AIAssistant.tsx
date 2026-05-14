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
  MessageSquare,
  Send
} from 'lucide-react';
import { motion } from 'motion/react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { supabase } from "../../lib/supabaseClient";

// Configure PDFJS worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function AIAssistant() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<{ role: string, content: string }[]>([
    { role: 'assistant', content: 'Hi! I can help you search materials, explain assignments, navigate the platform, or remind you about deadlines.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});

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
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map((item: any) => item.str).join(' ');
              fullText += pageText + '\\n';
            }
            resolve(fullText);
          } else if (file.name.endsWith('.docx')) {
            const arrayBuffer = result as ArrayBuffer;
            const docxResult = await mammoth.extractRawText({ arrayBuffer });
            resolve(docxResult.value);
          } else {
            // Assume text/plain
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
      setProcessing(true);
      setShowAnswers({});

      try {
        const text = await extractTextFromFile(file);
        const truncatedText = text.substring(0, 15000);

        const resp = await fetch('http://localhost:8000/api/ai-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'process_document', text: truncatedText })
        });

        if (!resp.ok) throw new Error('API Error');
        const data = await resp.json();

        if (data) {
          setAiResponse(data);
        }
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Ошибка при обработке файла.");
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleChatSubmit = async (e?: React.FormEvent, presetMessage?: string) => {
    e?.preventDefault();
    const msg = presetMessage || chatInput;
    if (!msg.trim() || chatLoading) return;

    const newMessages = [...chatMessages, { role: 'user', content: msg }];
    setChatMessages(newMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const systemPrompt = `You are AccessMind's AI Assistant. You help students search materials, explain assignments, navigate the platform, and remind them of deadlines. Answer in Russian. Keep responses concise and helpful.`;

      const resp = await fetch('http://localhost:8000/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', messages: newMessages })
      });

      if (!resp.ok) throw new Error('API Error');
      const data = await resp.json();

      if (data && data.reply) {
        setChatMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages([...newMessages, { role: 'assistant', content: 'Произошла ошибка. Пожалуйста, попробуйте еще раз.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Упрощение текста',
      description: 'Превращайте сложный академический текст в понятный',
      color: 'blue'
    },
    {
      icon: FileText,
      title: 'Краткие конспекты',
      description: 'Создавайте краткие выжимки из длинных документов и лекций',
      color: 'purple'
    },
    {
      icon: Lightbulb,
      title: 'Объяснение концепций',
      description: 'Получайте подробные объяснения сложных тем простыми словами',
      color: 'green'
    },
    {
      icon: CheckSquare,
      title: 'Генерация квизов',
      description: 'Создавайте практические вопросы для проверки знаний',
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-12">
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
                  <h1 className="text-lg font-bold text-slate-900">AI Учебный Ассистент</h1>
                  <p className="text-xs text-slate-600">На базе передовых нейросетей</p>
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
            <span className="text-sm font-medium text-slate-700">ИИ-обучение</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Преобразуйте ваши учебные материалы
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Загрузите любой документ (PDF, DOCX, TXT), и ИИ упростит его, сделает конспект и создаст проверочный тест
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Features */}
          <div className="space-y-6">
            {/* Upload Zone */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Загрузите материалы
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
                    Нажмите для загрузки или перетащите файл
                  </h4>
                  <p className="text-sm text-slate-600">
                    Поддерживаются PDF, DOCX и TXT
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
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Анализ документа...</h3>
                  <p className="text-slate-600">ИИ изучает текст и готовит учебные материалы</p>
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
                      Краткий конспект
                    </h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{aiResponse.summary}</p>
                </div>

                {/* Simplified Explanation */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                    Простыми словами
                  </h3>
                  <p className="text-slate-700 leading-relaxed">{aiResponse.simplified}</p>
                </div>

                {/* Key Points */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <CheckSquare className="w-5 h-5 text-purple-600" />
                    Главное
                  </h3>
                  <ul className="space-y-3">
                    {aiResponse.keyPoints?.map((point: string, index: number) => (
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
                    Mini-Quiz
                  </h3>
                  <div className="space-y-4">
                    {aiResponse.quiz?.map((item: any, index: number) => (
                      <div key={index} className="bg-white rounded-xl p-4 border border-orange-200">
                        <p className="font-semibold text-slate-900 mb-2">Вопрос {index + 1}: {item.question}</p>
                        {showAnswers[index] ? (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-700 bg-green-50 p-2 rounded-lg mt-2 border border-green-100">
                            <strong>Ответ:</strong> {item.answer}
                          </motion.p>
                        ) : (
                          <button
                            onClick={() => setShowAnswers({ ...showAnswers, [index]: true })}
                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                          >
                            Показать ответ
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all">
                    Сохранить в заметки
                  </button>
                  <button onClick={() => { setAiResponse(null); setSelectedFile(null); setShowAnswers({}); }} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-all">
                    Сбросить
                  </button>
                </div>
              </motion.div>
            )}

            {!processing && !aiResponse && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center h-full flex flex-col justify-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl mb-6 mx-auto">
                  <Brain className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Готов помочь</h3>
                <p className="text-slate-600">
                  Загрузите документ, чтобы начать ИИ-разбор материалов
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Chat Interface */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[500px]">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              AI Assistant (Платформа)
            </h3>
          </div>
          <div className="p-6 flex-1 overflow-y-auto space-y-4 bg-slate-50">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-none shadow-sm p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Печатает...
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleChatSubmit} className="flex gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Где найти мои задания? Напомни дедлайны..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                disabled={chatLoading}
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Спросить
              </button>
            </form>
            <div className="flex gap-2 mt-4 flex-wrap">
              <button onClick={() => handleChatSubmit(undefined, "Объясни мне, как работает платформа")} className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                Объясни как работать с платформой
              </button>
              <button onClick={() => handleChatSubmit(undefined, "Какие у меня ближайшие дедлайны по заданиям?")} className="px-4 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                Какие у меня ближайшие дедлайны?
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
