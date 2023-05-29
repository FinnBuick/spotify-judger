import React from 'react';
import { CHAT_BOT_NAME } from '@/common/constants';

interface ChatBubbleProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  avatar?: string | null;
}

export default function ChatBubble({ role, content, avatar }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`chat last:pb-4 ${isUser ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={avatar} />
        </div>
      </div>
      <div className="chat-header">{role === 'assistant' ? CHAT_BOT_NAME : avatar}</div>
      <div className={`chat-bubble ${isUser && 'chat-bubble-primary'}`}>{content}</div>
    </div>
  );
}
