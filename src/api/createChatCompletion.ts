import { OpenAIResponse } from '@/pages/api/openai';
import { ChatItem } from '@/pages/protected';

export default async function createChatCompletion(messages: ChatItem[]) {
  try {
    const openaiData = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });
    return (await openaiData.json()) as OpenAIResponse;
  } catch (error) {
    throw new Error('Error fetching OpenAI data');
  }
}
