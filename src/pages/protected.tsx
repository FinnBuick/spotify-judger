import createChatCompletion from '@/api/createChatCompletion';
import getInitialMessage from '@/api/getInitialMessage';
import ChatBubble from '@/components/chatBubble';
import { LoadingButtonWithChangingText } from '@/components/loadingButton';
import Spinner from '@/components/spinner';
import { ChatCompletionRequestMessage } from 'openai';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation } from 'react-query';

export interface ChatItem extends ChatCompletionRequestMessage {}

export default function Protected() {
  const [hasInitiated, setHasInitiated] = useState(false);
  const [inputText, setInputText] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);

  const { mutate, isLoading } = useMutation(
    async () => {
      let res;
      if (chatHistory.length === 0) {
        res = await getInitialMessage();
      } else {
        res = await createChatCompletion([chatHistory?.at(-1)]);
      }
      if (!res) {
        toast.error('There was an issue connecting to Spotify, please try logging in again.');
      }
      return res.result;
    },
    {
      onSuccess: (res) => {
        if (!res) return;
        setHasInitiated(true);
        setChatHistory((prev) => [...prev, { role: 'assistant', content: res.message }]);
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
    setInputText('');
  };

  return (
    <div className="flex-grow flex flex-col items-center md:pb-4">
      {!hasInitiated && (
        <div className="flex-grow flex flex-col justify-center items-center">
          <LoadingButtonWithChangingText
            action={mutate}
            isLoading={isLoading}
            loadingTextArray={['Critiquing', 'Judging', 'Evaluating', 'Analyzing']}
          />
        </div>
      )}

      {hasInitiated && (
        <div className="flex-grow flex flex-col rounded-lg shadow-xl backdrop-contrast-75 overflow-hidden md:w-2/3 xl:w-1/2">
          <div className="flex-grow px-1 overflow-y-scroll">
            {chatHistory.map(({ role, content }, index) => (
              <ChatBubble key={index} role={role} content={content} />
            ))}

            {isLoading && (
              <div className="p-1 pb-3">
                <Spinner />
              </div>
            )}
            <div className="[overflow-anchor:auto] h-[1px]" />
          </div>

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
