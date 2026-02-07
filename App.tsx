
import React, { useState, useRef, useEffect } from 'react';
import { AcademicCategory, SubContext, Language, Message, ChatState } from './types'; 
import ContextSelector from './ContextSelector'; 
import ChatBubble from './ChatBubble'; 
import { geminiService } from './geminiService';

const STORAGE_KEY = 'academic_translator_state';

const App: React.FC = () => {
  const [state, setState] = useState<ChatState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          isLoading: false
        };
      } catch (e) {
        console.error("Failed to load state from localStorage", e);
      }
    }
    return {
      category: null,
      subContext: null,
      targetLanguage: null,
      messages: [],
      isLoading: false,
    };
  });

  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.category) {
      const stateToSave = {
        category: state.category,
        subContext: state.subContext,
        targetLanguage: state.targetLanguage,
        messages: state.messages
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [state.category, state.subContext, state.targetLanguage, state.messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, state.isLoading]);

  const handleSetupComplete = (category: AcademicCategory, subContext: SubContext, targetLanguage: Language) => {
    setState(prev => ({ 
      ...prev, 
      category, 
      subContext, 
      targetLanguage 
    }));
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      category: null,
      subContext: null,
      targetLanguage: null,
      messages: [],
      isLoading: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !state.category || !state.subContext || !state.targetLanguage || state.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));
    setInputText('');

    try {
      const result = await geminiService.translateAcademic(
        inputText, 
        state.category, 
        state.subContext, 
        state.targetLanguage
      );
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        translation: result.translation,
        definition: result.definition,
        keyTerms: result.keyTerms,
        timestamp: Date.now(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Translation failed", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <span className="font-bold text-xl">A</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-none">AcademicTranslator</h1>
            {state.category && state.subContext && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                  {state.category.label}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                  {state.subContext.label}
                </span>
                <span className="text-[11px]">
                  {state.targetLanguage?.flag}
                </span>
              </div>
            )}
          </div>
        </div>
        {state.category && (
          <button 
            onClick={handleReset}
            className="text-xs sm:text-sm font-medium text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full"
            title="Borrar historial y cambiar contexto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Nueva Sesión</span>
            <span className="sm:hidden">Reset</span>
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {!state.category ? (
          <ContextSelector onComplete={handleSetupComplete} />
        ) : (
          <>
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar space-y-2 max-w-4xl mx-auto w-full"
            >
              {state.messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-8 space-y-6">
                  <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-4xl shadow-sm animate-pulse">
                    {state.category.icon}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-slate-800">
                      Modo Académico: {state.subContext?.label}
                    </p>
                    <p className="max-w-md mx-auto text-slate-500">
                      Traduciendo al <b>{state.targetLanguage?.name}</b> {state.targetLanguage?.flag}. <br/>
                      Para textos largos, extraeré términos clave automáticamente.
                    </p>
                  </div>
                </div>
              )}
              {state.messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {state.isLoading && (
                <div className="flex justify-start mb-6 animate-pulse">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 w-48 shadow-sm">
                    <div className="flex space-x-2 items-center">
                      <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Pega tu texto para traducir al ${state.targetLanguage?.name}...`}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none min-h-[50px] max-h-[200px]"
                />
                <button
                  type="submit"
                  disabled={state.isLoading || !inputText.trim()}
                  className="bg-blue-600 text-white rounded-xl px-6 py-3 font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex items-center gap-2 self-end h-[50px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                  <span className="hidden sm:inline">Traducir</span>
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
