import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage as ChatMessageType } from './types';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { getCoachResponse } from './services/geminiService';

const initialMessage: ChatMessageType = {
  id: 'initial',
  sender: 'coach',
  text: "Welcome to your CELPIP Writing Practice session! To start, please indicate which task you would like to practice:\n\n• CELPIP Writing Task 1: Email\n• CELPIP Writing Task 2: Survey Response/Supporting an Opinion\n\nPlease type '1' or '2' to select your task."
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const newUserMessage: ChatMessageType = { id: Date.now(), sender: 'user', text };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const coachResponseText = await getCoachResponse(updatedMessages);
      const newCoachMessage: ChatMessageType = { id: Date.now() + 1, sender: 'coach', text: coachResponseText };
      setMessages(prev => [...prev, newCoachMessage]);
    } catch (error) {
      console.error("Error fetching coach response:", error);
      const errorMessage: ChatMessageType = { 
        id: Date.now() + 1, 
        sender: 'coach', 
        text: "Sorry, I encountered an error. This might be due to an invalid API key or network issues. Please check the console for more details and try again." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="p-4 bg-gray-800 border-b border-gray-700 shadow-md">
        <h1 className="text-xl font-bold text-center text-sky-400">CELPIP Writing Coach</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 w-full">
              <div className="flex-shrink-0 p-2 rounded-full bg-gray-600 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="max-w-[80%] rounded-lg p-4 shadow-md bg-gray-700 self-start flex items-center space-x-2">
                <span className="h-2 w-2 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-sky-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;