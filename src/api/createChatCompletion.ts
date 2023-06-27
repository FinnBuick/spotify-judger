import { OpenAIResponse } from '@/pages/api/openai';
import { ChatItem } from '@/pages/protected';

export default async function createChatCompletion(messages: (ChatItem | null | undefined)[]) {
  if (!messages) {
    throw new Error('No messages provided');
  }

  try {
    const openaiData = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    const response = await openaiData.json();
    return response as OpenAIResponse;
  } catch (error) {
    throw new Error('Error fetching OpenAI data');
  }
}
