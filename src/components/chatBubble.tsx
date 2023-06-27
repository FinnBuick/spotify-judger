import { CHAT_BOT_NAME } from '@/common/constants';
import { getInitials } from '@/utils/getInitials';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface ChatBubbleProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  avatar?: string | null;
}

export default function ChatBubble({ role, content, avatar }: ChatBubbleProps) {
  const { data: session } = useSession();
  const user = session?.user;

  const isUser = role === 'user';

  const renderUserAvatar = () => {
    if (avatar) {
      return (
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            {/*eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatar} alt="avatar" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="chat-image avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
            <span>{getInitials(user?.name ?? '')}</span>
          </div>
        </div>
      );
    }
  };

  const renderAssistantAvatar = () => {
    return (
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Image src="/dalle_robot.png" alt="avatar" />
        </div>
      </div>
    );
  };

  const renderAvatar = () => {
    if (isUser) {
      return renderUserAvatar();
    } else {
      return renderAssistantAvatar();
    }
  };

  return (
    <div className={`chat last:pb-4 ${isUser ? 'chat-end' : 'chat-start'}`}>
      {renderAvatar()}
      <div className="chat-header">{role === 'assistant' ? CHAT_BOT_NAME : avatar}</div>
      <div className={`chat-bubble ${isUser ? 'chat-bubble-primary' : ''}`}>{content}</div>
    </div>
  );
}
