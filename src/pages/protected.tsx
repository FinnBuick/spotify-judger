import getInitialMessage from '@/api/getInitialMessage';
import ChatBubble from '@/components/chatBubble';
import Spinner from '@/components/spinner';
import { useInterval } from '@/hooks/useInterval';
import { useSession } from 'next-auth/react';
import { ChatCompletionRequestMessage } from 'openai';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
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
      const { result } = await getInitialMessage();

      if (!result) {
        toast.error('There was an issue connecting to Spotify, please try logging in again.');
      }

      return result;
    },
    {
      onSuccess: (res) => {
        if (!res) return;
        setHasInitiated(true);
        setChatHistory([...chatHistory, { role: 'assistant', content: res[0].message.content }]);
      },
      onError: () => {
        toast.error('There was an issue connecting to Spotify, please try logging in again.');
      },
    }
  );

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    setChatHistory([...chatHistory, { role: 'user', content: inputText }]);
    mutate();
  };

  return (
    <div className="flex-grow flex flex-col items-center md:pb-4">
      {!hasInitiated && (
        <div className="flex-grow flex flex-col justify-center items-center">
          <div className="text-center w-3/4 p-6"></div>
          <button onClick={() => mutate()} className={`btn-primary btn-wide btn ${isLoading && 'loading'}`}>
            {isLoading ? `${loadingTextArray[currentLoadingTextIndex]}...` : 'Get Judged'}
          </button>
        </div>
      )}

      {hasInitiated && (
        <div className="flex-grow flex flex-col rounded-lg shadow-xl backdrop-contrast-75 overflow-hidden md:w-2/3 xl:w-1/2">
          <div className="flex-grow px-1 overflow-y-scroll">
            {chatHistory.map(({ role, content }, index) => (
              <ChatBubble
                key={index}
                role={role}
                content={content}
                avatar={role === 'user' ? session?.user?.name : '/open-ai-logo.svg'}
              />
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
