import { SpotifyResponse } from '@/pages/api/spotify';
import { Timerange } from '@/types/spotify';

export async function fetchSpotifyData(timeRange: Timerange, limit: number): Promise<SpotifyResponse> {
  try {
    const spotifyData = await fetch('/api/spotify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeRange,
        limit,
      }),
    });
    return (await spotifyData.json()) as SpotifyResponse;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching Spotify data');
  }
}
