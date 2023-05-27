import { SpotifyResponse } from '@/pages/api/spotify';

export async function fetchSpotifyData() {
  try {
    const spotifyData = await fetch('/api/spotify');
    return (await spotifyData.json()) as SpotifyResponse;
  } catch (error) {
    throw new Error('Error fetching Spotify data');
  }
}
