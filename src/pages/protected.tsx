// src/pages/protected.tsx
import { generatePrompt as generateInitialPrompt } from '@/generatePrompt';
import { useInterval } from '@/hooks/useInterval';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

interface ChatItem {
  user: 'FantanoAI' | 'Person';
  message: string;
  time: string;
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

  useEffect(() => {
    const history = constructChatPrompt(chatHistory);
    console.log(history);
  }, [chatHistory]);

  const { mutate, isLoading } = useMutation(
    async () => {
      if (!session) throw new Error('Not signed in');
      if (!session.accessToken) throw new Error('No access token');

      let prompt = '';
      if (!hasInitiated) {
        prompt = await generateInitialPrompt(session.accessToken);

        setChatHistory([
          {
            user: 'FantanoAI',
            message: prompt,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      } else {
        prompt = constructChatPrompt(chatHistory);
        console.log('Prompt sent to openai', prompt);
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      return data;
    },
    {
      onSuccess: ({ result }) => {
        // console.log(result);
        setHasInitiated(true);
        setChatHistory((chatHistory) => [
          ...chatHistory,
          {
            user: 'FantanoAI',
            message: result,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      },
    }
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {!hasInitiated && (
        <button onClick={() => mutate()} className={`btn-primary btn-wide btn ${isLoading && 'loading'}`}>
          {isLoading ? loadingTextArray[currentLoadingTextIndex] : 'Get Judged'}
        </button>
      )}

      {hasInitiated && (
        <div className="max-w-prose">
          {chatHistory.slice(1).map(({ user, message, time }, index) => (
            <div key={index} className={`chat ${user === 'FantanoAI' ? 'chat-start' : 'chat-end'}`}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img src={user === 'FantanoAI' ? '/open-ai-logo.svg' : session?.user?.image} />
                </div>
              </div>
              <div className="chat-header">
                {user === 'FantanoAI' ? 'FantanoAI' : session?.user?.name}
                <time className="pl-2 text-xs opacity-50">{time}</time>
              </div>
              <div className="chat-bubble">{message}</div>
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
            />

            <button
              className="btn-primary btn-wide btn"
              onClick={() => {
                setChatHistory((chatHistory) => [
                  ...chatHistory,
                  {
                    user: 'Person',
                    message: inputText,
                    time: new Date().toLocaleTimeString(),
                  },
                ]);
                mutate();
                setInputText('');
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// helper functions
function constructChatPrompt(chatHistory: ChatItem[]) {
  let prompt = '';
  chatHistory.forEach(({ user, message }, i) => {
    if (i === 0) {
      prompt = message;
      return;
    }
    prompt += `${user}: ${message}\n`;
  });
  return prompt;
}
