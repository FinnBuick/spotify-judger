// src/pages/protected.tsx
import { generatePrompt as generateInitialPrompt } from '@/generatePrompt';
import { useInterval } from '@/hooks/useInterval';
import { useSession } from 'next-auth/react';
import { ChatCompletionRequestMessage, CreateChatCompletionResponseChoicesInner } from 'openai';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

export interface ChatItem extends ChatCompletionRequestMessage {
  // time?: string;
}

export default function Protected() {
  const { data: session } = useSession();

  const [hasInitiated, setHasInitiated] = useState(false);
  const [inputText, setInputText] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);

  const [currentLoadingTextIndex, setCurrentLoadingTextIndex] = useState(0);
  const loadingTextArray = ['Critiquing...', 'Judging...', 'Evaluating...', 'Analyzing...'];

  useInterval(() => {
    setCurrentLoadingTextIndex((currentLoadingTextIndex + 1) % loadingTextArray.length);
  }, 2000);

  const { mutate, isLoading } = useMutation(
    async () => {
      if (!session) throw new Error('Not signed in');
      if (!session.accessToken) throw new Error('No access token');

      let messages: ChatItem[] = [];
      if (!hasInitiated) {
        const temp = await generateInitialPrompt(session.accessToken);
        messages = [...temp];
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

      console.log('messages', messages);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });
      const data = await response.json();
      return data;
    },
    {
      onSuccess: ({ result }) => {
        setHasInitiated(true);
        console.log({ result });
        setChatHistory((prevState) => [...prevState, result[0].message]);
      },
    }
  );

  const handleSendMessage = () => {
    mutate();
    setInputText('');
  };

  console.log({ chatHistory });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {!hasInitiated && (
        <button onClick={() => mutate()} className={`btn-primary btn-wide btn ${isLoading && 'loading'}`}>
          {isLoading ? loadingTextArray[currentLoadingTextIndex] : 'Get Judged'}
        </button>
      )}

      {hasInitiated && (
        <div className="max-w-prose">
          {chatHistory.slice(1).map(({ role, content, time }, index) => (
            <div key={index} className={`chat ${role === 'assistant' ? 'chat-start' : 'chat-end'}`}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img src={role === 'assistant' ? '/open-ai-logo.svg' : session?.user?.image} />
                </div>
              </div>
              <div className="chat-header">
                {role === 'assistant' ? 'FantanoAI' : session?.user?.name}
                <time className="pl-2 text-xs opacity-50">{time}</time>
              </div>
              <div className="chat-bubble">{content}</div>
              <div className="chat-footer opacity-50">Delivered</div>
            </div>
          ))}

          {/* text input */}
          <div className="flex items-center justify-center">
            <input
              type="text"
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />

            <button className="btn-primary btn-wide btn" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
