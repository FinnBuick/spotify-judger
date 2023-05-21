// src/pages/protected.tsx
import Spinner from '@/components/spinner';
import { generatePrompt as generateInitialPrompt } from '@/generatePrompt';
import { useInterval } from '@/hooks/useInterval';
import { useSession } from 'next-auth/react';
import { ChatCompletionRequestMessage } from 'openai';
import { useState } from 'react';
import { useMutation } from 'react-query';

import data from '../../sampleConversation.json';

export interface ChatItem extends ChatCompletionRequestMessage {}

export default function Protected() {
  const { data: session } = useSession();

  const [hasInitiated, setHasInitiated] = useState(true);
  const [inputText, setInputText] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatItem[]>(data);

  const [currentLoadingTextIndex, setCurrentLoadingTextIndex] = useState(0);
  const loadingTextArray = ['Critiquing', 'Judging', 'Evaluating', 'Analyzing'];

  useInterval(() => {
    setCurrentLoadingTextIndex((currentLoadingTextIndex + 1) % loadingTextArray.length);
  }, 2000);

  const { mutate, isLoading } = useMutation(
    async () => {
      if (!session) throw new Error('Not signed in');
      if (!session.accessToken) throw new Error('No access token');

      let messages: ChatItem[];
      if (!hasInitiated) {
        const initialPromptMessages = await generateInitialPrompt(session.accessToken);
        messages = [...initialPromptMessages];
        setChatHistory(messages);
      } else {
        messages = [
          ...chatHistory,
          {
            role: 'user',
            content: inputText,
          },
        ];
        setChatHistory(messages);
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });
      return await response.json();
    },
    {
      onSuccess: ({ result }) => {
        setHasInitiated(true);
        setChatHistory((prevState) => [...prevState, result[0].message]);
      },
    }
  );

  const handleSendMessage = () => {
    mutate();
    setInputText('');
  };

  return (
    <div className="flex-grow flex flex-col items-center md:pb-4">
      {!hasInitiated && (
        <button onClick={() => mutate()} className={`btn-primary btn-wide btn ${isLoading && 'loading'}`}>
          {isLoading ? `${loadingTextArray[currentLoadingTextIndex]}...` : 'Get Judged'}
        </button>
      )}

      {hasInitiated && (
        <div className="flex-grow flex flex-col rounded-lg shadow-xl backdrop-contrast-75 overflow-hidden md:w-2/3 xl:w-1/2">
          <div className="flex-grow px-1 overflow-y-scroll">
            {chatHistory.slice(3).map(({ role, content }, index) => (
              <div key={index} className={`chat last:pb-4 ${role === 'assistant' ? 'chat-start' : 'chat-end'}`}>
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img src={role === 'assistant' ? '/open-ai-logo.svg' : session?.user?.image} />
                  </div>
                </div>
                <div className="chat-header">{role === 'assistant' ? 'FantanoAI' : session?.user?.name}</div>
                <div className={`chat-bubble ${role === 'user' && 'chat-bubble-primary'}`}>{content}</div>
              </div>
            ))}

            {isLoading && (
              <div className="p-1 pb-3">
                <Spinner />
              </div>
            )}
            <div className="[overflow-anchor:auto] h-[1px]" />
          </div>

          {/* text input */}
          <div>
            <div className="input-group flex items-center justify-center">
              <input
                type="text"
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                className="input-md w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <button className="btn-primary btn-md sm:btn-wide" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
