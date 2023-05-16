import { Profile, SpotifyUserTopItems } from './types/spotify';

export async function getProfile(token: string): Promise<Profile> {
  const result = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  return await result.json();
}

export async function getUsersTopArtists(accessToken: string): Promise<SpotifyUserTopItems> {
  const response = await fetch(`https://api.spotify.com/v1/me/top/artists`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
}

export async function generatePrompt(accessToken: string): Promise<string> {
  const { items } = await getUsersTopArtists(accessToken);
  const prompt = `Write a sassy five sentence review of a persons taste in music with the following information:
- Listens to ${items
    .map((item) => item.name)
    .slice(0, 5)
    .join(', ')}
- Listens to ${items
    .map((item) => item.genres[0])
    .slice(0, 5)
    .join(', ')};`;

  return prompt;
}
