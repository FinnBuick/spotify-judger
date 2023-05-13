import { Profile, SpotifyUserTopItems } from './types/spotify';

export async function getProfile(token: string): Promise<Profile> {
  const result = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  return await result.json();
}

export async function getUsersTopItems(accessToken: string, type: 'artists' | 'tracks'): Promise<SpotifyUserTopItems> {
  const response = await fetch(`https://api.spotify.com/v1/me/top/${type}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
}

export async function generatePrompt(accessToken: string, type: 'artists' | 'tracks'): Promise<string> {
  const { items } = await getUsersTopItems(accessToken, type);
  const prompt = `Write a funny five sentence Spotify profile description with 2 emojis maximum, with the following information:
- Listens to ${items
    .map((item) => item.name)
    .slice(0, 5)
    .join(', ')}
- Listens to ${items
    .map((item) => item.genres[0])
    .slice(0, 5)
    .join(', ')}
- Has ${items[0].followers.total} followers`;

  return prompt;
}
