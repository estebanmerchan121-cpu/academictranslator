
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 ${
        isUser 
          ? 'bg-blue-600 text-white shadow-lg rounded-tr-none' 
          : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-none'
      }`}>
        <div className="text-sm font-medium mb-1 opacity-70">
          {isUser ? 'Consulta' : 'AcademicTranslator AI'}
        </div>
        
        <div className="text-base leading-relaxed">
          {isUser ? (
            message.content
          ) : (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <div className="text-[10px] uppercase tracking-wider font-bold text-blue-600 mb-1">Traducción</div>
                <div className="text-lg font-medium text-slate-900 leading-snug">{message.translation}</div>
              </div>

              {message.definition && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-blue-600 mb-1">Definición</div>
                  <div className="text-sm italic text-slate-600 leading-snug">
                    {message.definition}
                  </div>
                </div>
              )}

              {message.keyTerms && message.keyTerms.length > 0 && (
                <div className="pt-2 space-y-3">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-blue-600 mb-2">Términos Clave</div>
                  {message.keyTerms.map((kt, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <div className="text-sm font-bold text-slate-800 mb-1">{kt.term}</div>
                      <div className="text-xs text-slate-600 leading-tight italic">{kt.definition}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className={`text-[10px] mt-2 opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
