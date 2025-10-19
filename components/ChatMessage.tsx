
import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import { UserIcon, CoachIcon } from './Icons';
import { FormattedContent } from './FormattedContent';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const bubbleClasses = isUser
    ? 'bg-sky-600 text-white self-end'
    : 'bg-gray-700 text-gray-200 self-start';
  
  const layoutClasses = isUser ? 'flex-row-reverse' : 'flex-row';

  return (
    <div className={`flex ${layoutClasses} items-start gap-3 w-full`}>
      <div className={`flex-shrink-0 p-2 rounded-full ${isUser ? 'bg-sky-500' : 'bg-gray-600'} text-white`}>
        {isUser ? <UserIcon /> : <CoachIcon />}
      </div>
      <div className={`max-w-[80%] rounded-lg p-4 shadow-md ${bubbleClasses}`}>
        {isUser ? <p>{message.text}</p> : <FormattedContent content={message.text} />}
      </div>
    </div>
  );
};
