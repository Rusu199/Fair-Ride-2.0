import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage, User } from '../../types';
import { getChatSuggestions } from '../../services/geminiService';

interface ChatScreenProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
  currentUserId: string;
  otherUser: User;
  presets?: string[];
}

const ChatScreen: React.FC<ChatScreenProps> = ({ messages, onSendMessage, onBack, currentUserId, otherUser, presets = [] }) => {
  const [inputText, setInputText] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
      setAiSuggestions([]);
    }
  };

  const handlePresetSend = (text: string) => {
    onSendMessage(text);
    setAiSuggestions([]);
  };

  const handleGetAiSuggestions = async () => {
    setIsGenerating(true);
    setAiSuggestions([]);
    const userRole = 'vehicle' in otherUser ? 'customer' : 'driver';
    const suggestions = await getChatSuggestions(messages, userRole);
    setAiSuggestions(suggestions);
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-neutral-white h-14 flex items-center justify-center relative shadow-sm flex-shrink-0">
        <button onClick={onBack} className="absolute left-4 p-2 text-primary-blue">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <img src={otherUser.photoUrl} alt={otherUser.name} className="w-8 h-8 rounded-full mr-2" />
          <h1 className="text-lg font-bold text-neutral-dark-gray">{otherUser.name}</h1>
        </div>
      </header>

      <main className="flex-grow p-4 overflow-y-auto bg-neutral-light-gray">
        <div className="space-y-4">
          {messages.map((msg) => {
            if (msg.senderId === 'system') {
              return (
                <div key={msg.id} className="text-center text-xs text-neutral-medium-gray my-2">
                  <span className="bg-gray-200 rounded-full px-2 py-1">{msg.text}</span>
                </div>
              );
            }
            const isSentByMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`flex items-end space-x-2 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  isSentByMe 
                  ? 'bg-primary-blue text-white rounded-br-none' 
                  : 'bg-neutral-white text-neutral-dark-gray rounded-bl-none'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} />
      </main>
      
      {(aiSuggestions.length > 0 || presets.length > 0) && (
        <div className="bg-neutral-white border-t border-gray-200 p-2 space-y-3">
            {aiSuggestions.length > 0 && (
                 <div>
                    <p className="text-xs font-semibold text-neutral-medium-gray mb-1.5 px-1 flex items-center">✨ AI Suggestions</p>
                    <div className="flex flex-wrap gap-2">
                        {aiSuggestions.map((suggestion, index) => (
                            <button 
                                key={index} 
                                onClick={() => handlePresetSend(suggestion)}
                                className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-sm rounded-full hover:bg-indigo-200 transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {presets.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {presets.map((preset, index) => (
                        <button 
                            key={index} 
                            onClick={() => handlePresetSend(preset)}
                            className="px-3 py-1.5 bg-blue-100 text-primary-blue text-sm rounded-full hover:bg-blue-200 transition-colors"
                        >
                            {preset}
                        </button>
                    ))}
                </div>
            )}
        </div>
      )}

      <footer className="bg-neutral-white p-2 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="w-full h-10 px-4 pr-12 bg-neutral-light-gray border border-transparent rounded-full focus:ring-2 focus:ring-primary-blue outline-none text-neutral-dark-gray"
            />
            <button
                onClick={handleGetAiSuggestions}
                disabled={isGenerating}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full text-indigo-500 hover:bg-indigo-100 flex items-center justify-center"
                aria-label="Get AI Suggestions"
            >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            </button>
          </div>
          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-full bg-primary-blue text-white flex items-center justify-center flex-shrink-0 transition-opacity disabled:opacity-50"
            disabled={!inputText.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatScreen;