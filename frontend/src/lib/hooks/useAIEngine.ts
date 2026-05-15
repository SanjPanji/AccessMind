import { useState } from 'react';
import { streamCerebrasChat, fetchCerebrasJSON, ChatMessage } from '../cerebrasClient';

export type AIMode = 'chat' | 'document' | 'study' | 'exam';

export interface AIResponseData {
  summary?: string;
  simplified?: string;
  keyPoints?: string[];
  quiz?: Array<{ question: string, answer: string }>;
}

export function useAIEngine() {
  const [mode, setMode] = useState<AIMode>('chat');
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStream, setCurrentStream] = useState('');

  // Generate strict system prompt based on AccessMind Educational Tutor persona
  const getSystemPrompt = (language: string, currentMode: AIMode) => {
    let persona = `You are AccessMind Educational Tutor, an adaptive teaching assistant for students. You MUST respond in the following language: ${language}. Keep answers concise, clear, and encouraging. Never act like a generic AI or generic assistant. Your goal is to educate.`;
    
    if (currentMode === 'document' && documentText) {
      persona += `\nThe student is studying a document. Use this document context to answer questions:\n[DOCUMENT START]\n${documentText.substring(0, 5000)}\n[DOCUMENT END]`;
    } else if (currentMode === 'study') {
      persona += `\nYou are in Study Mode. Explain concepts thoroughly using simple analogies. Focus on deep understanding.`;
    } else if (currentMode === 'exam') {
      persona += `\nYou are in Exam Mode. Test the student's knowledge. Do not give direct answers immediately; guide them to find the answer themselves by asking leading questions.`;
    }
    
    return persona;
  };

  const processChat = async (input: string, language: string, signal?: AbortSignal) => {
    setIsProcessing(true);
    setCurrentStream('');
    
    // Optimistically add user message
    const newHistory = [...chatHistory, { role: 'user' as const, content: input }];
    setChatHistory(newHistory);
    
    const messages = [
      { role: 'system' as const, content: getSystemPrompt(language, mode) },
      ...newHistory
    ];

    try {
      let accumulated = '';
      await streamCerebrasChat(messages, (chunk) => {
        accumulated += chunk;
        setCurrentStream(accumulated);
      }, signal);
      
      // Save assistant reply to history
      setChatHistory(prev => [...prev, { role: 'assistant' as const, content: accumulated }]);
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error("AI Engine Chat Error:", e);
        setChatHistory(prev => [...prev, { role: 'assistant' as const, content: 'Произошла ошибка при обращении к ИИ.' }]);
      }
    } finally {
      setIsProcessing(false);
      setCurrentStream('');
    }
  };

  const processDocumentJSON = async (text: string, language: string, signal?: AbortSignal): Promise<AIResponseData | null> => {
    setIsProcessing(true);
    setDocumentText(text);
    setMode('document');
    
    const prompt = `Пожалуйста, проанализируй следующий учебный текст и верни результат строго в формате JSON.
Текст: ${text.substring(0, 15000)}

Формат JSON:
{
  "summary": "краткое содержание (2-3 предложения)",
  "simplified": "объяснение простыми словами (как для новичка)",
  "keyPoints": ["важный пункт 1", "важный пункт 2", "важный пункт 3"],
  "quiz": [{"question": "вопрос по тексту для проверки знаний", "answer": "ответ на вопрос"}]
}`;

    const messages = [
      { role: 'system' as const, content: getSystemPrompt(language, 'document') },
      { role: 'user' as const, content: prompt }
    ];

    try {
      const data = await fetchCerebrasJSON(messages, signal);
      setIsProcessing(false);
      return data;
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error("AI Engine Document Error:", e);
      }
      setIsProcessing(false);
      return null;
    }
  };

  const executeIntent = async (intentText: string, language: string, targetMode?: AIMode, signal?: AbortSignal) => {
    if (targetMode) setMode(targetMode);
    await processChat(intentText, language, signal);
  };

  const clearMemory = () => {
    setChatHistory([]);
    setDocumentText(null);
    setMode('chat');
  };

  return {
    mode, setMode,
    chatHistory, setChatHistory,
    documentText, setDocumentText,
    isProcessing, currentStream,
    processChat,
    processDocumentJSON,
    executeIntent,
    clearMemory
  };
}
