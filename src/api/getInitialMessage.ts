import { generatePrePrompt } from '@/generatePrompt';
import { fetchSpotifyData } from './fetchSpotifyData';
import createChatCompletion from './createChatCompletion';

/**
 * Fetches spotify top artists and tracks, constructs a pre-prompt,
 * and fetches the chat completion for the initial message
 * @async
 * @returns A chat completion with the initial prompt
 */
export default async function getInitialMessage() {
  const spotifyData = await fetchSpotifyData();

  if (!spotifyData?.result) {
    throw new Error('Failed to fetch spotify data');
  }

  const prePrompt = generatePrePrompt(spotifyData.result);
  return createChatCompletion(prePrompt);
}
