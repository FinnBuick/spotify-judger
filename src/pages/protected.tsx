// src/pages/protected.tsx
import createChatCompletion from '@/api/createChatCompletion';
import { fetchSpotifyData } from '@/api/fetchSpotifyData';
import Spinner from '@/components/spinner';
import { PROMPT_LENGTH, generatePrePrompt } from '@/generatePrompt';
import { useInterval } from '@/hooks/useInterval';
import { useSession } from 'next-auth/react';
import { ChatCompletionRequestMessage } from 'openai';
import { useState } from 'react';
import { useMutation } from 'react-query';

export interface ChatItem extends ChatCompletionRequestMessage {}

export default function Protected() {
  const { data: session } = useSession();

  const [hasInitiated, setHasInitiated] = useState(false);
  const [inputText, setInputText] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);

  const [currentLoadingTextIndex, setCurrentLoadingTextIndex] = useState(0);
  const loadingTextArray = ['Critiquing', 'Judging', 'Evaluating', 'Analyzing'];

  useInterval(() => {
    setCurrentLoadingTextIndex((currentLoadingTextIndex + 1) % loadingTextArray.length);
  }, 2000); // 2 seconds

  const { mutate, isLoading } = useMutation(
    async () => {
      let messages: ChatItem[] = [];

      // on first load, get spotify data and generate pre-prompt
      if (!hasInitiated) {
        const spotifyRes = await fetchSpotifyData();
        if (!spotifyRes?.result) return;
        const { topArtists, topTracks } = spotifyRes.result;

        const prePrompt = generatePrePrompt(topArtists, topTracks);
        messages = [...prePrompt];
      } else {
        messages = [...chatHistory, { role: 'user', content: inputText }];
      }
      setChatHistory(messages);

      // send messages to openai
      const openaiRes = await createChatCompletion(messages);
      if (!openaiRes?.result) return;

      return openaiRes;
    },
    {
      onSuccess: (res) => {
        if (!res || !res?.result) return;
        setHasInitiated(true);
        const chatItem: ChatItem = {
          role: 'assistant',
          content: res.result[0]?.message.content,
        };
        setChatHistory((prevState) => [...prevState, chatItem]);
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
        <div className="flex-grow flex justify-center items-center">
          <button onClick={() => mutate()} className={`btn-primary btn-wide btn ${isLoading && 'loading'}`}>
            {isLoading ? `${loadingTextArray[currentLoadingTextIndex]}...` : 'Get Judged'}
          </button>
        </div>
      )}

      {hasInitiated && (
        <div className="flex-grow flex flex-col rounded-lg shadow-xl backdrop-contrast-75 overflow-hidden md:w-2/3 xl:w-1/2">
          <div className="flex-grow px-1 overflow-y-scroll">
            {chatHistory.slice(PROMPT_LENGTH).map(({ role, content }, index) => (
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
          <div className="pb-0.5 px-0.5">
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
