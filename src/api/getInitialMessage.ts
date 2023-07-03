import { generatePrePrompt } from '@/generatePrompt';
import { fetchSpotifyData } from './fetchSpotifyData';
import createChatCompletion from './createChatCompletion';
import { Timerange } from '@/types/spotify';

/**
 * Fetches spotify top artists and tracks, constructs a pre-prompt,
 * and fetches the chat completion for the initial message
 * @async
 * @returns A chat completion with the initial prompt
 */
export default async function getInitialMessage(timeRange: Timerange, limit: number) {
  const spotifyData = await fetchSpotifyData(timeRange, limit);

  if (!spotifyData?.result) {
    throw new Error('Failed to fetch spotify data');
  }

  const prePrompt = generatePrePrompt(spotifyData.result);
  return createChatCompletion(prePrompt);
}
