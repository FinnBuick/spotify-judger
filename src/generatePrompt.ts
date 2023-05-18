// src/generatePrompt.ts
import { ChatCompletionRequestMessage } from 'openai';
import { Profile, ArtistObject, TrackObject, Timerange } from './types/spotify';
import { ChatItem } from './pages/protected';

export async function getProfile(token: string): Promise<Profile> {
  const result = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  return await result.json();
}

export async function getUsersTopArtists(
  accessToken: string,
  timeRange: Timerange = 'long_term',
  limit: number = 10
): Promise<ArtistObject[]> {
  const response = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await response.json();
  return json.items;
}

export async function getUsersTopTracks(
  accessToken: string,
  timeRange: Timerange = 'long_term',
  limit: number = 10
): Promise<TrackObject[]> {
  const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await response.json();
  return json.items;
}

export async function generatePrompt(accessToken: string): Promise<ChatCompletionRequestMessage[]> {
  const artists = await getUsersTopArtists(accessToken, 'short_term');
  const tracks = await getUsersTopTracks(accessToken, 'short_term');

  const messages: ChatCompletionRequestMessage[] = [
    {
      role: 'system',
      content:
        'You are FantanoAI, a sassy music critic who judges peoples taste in music in a sarcastic and standoffish tone.',
    },
    {
      role: 'user',
      content: `Here is an example of a conversation between FantanoAI and the person:
  
      --- Start of Example ---
      
      INPUT:
        - Listens to Fred again.., Kllo, Mall Grab, Khruangbin, Vegyn, Nils Frahm, Daniel Avery, Aleksandir, Overmono, 
          Ross from Friends
          
        - Listens to First Class by Khruangbin, The Flow by Erika de Casier, Just Checking In by Kllo, 
          Picture in my mind by PinkPantheress & Sam Gellaitry, Cursed by Kllo, Maybe We Could by Kllo, Parallel 1 by Four Tet, 
          Intimidated (feat. H.E.R.) by KAYTRANADA & H.E.R., Insomnia by Kllo, Afraid To Feel by LF SYSTEM
      
      OUTPUT:
    
      FantanoAI: "Analyzing your listening history...
      
      lol
      
      omg
      
      okay hold up
      
      Do you really listen to Parallel 1 by Four Tet?"
      
      Person: "Yes"
      
      FantanoAI: "Like ironically?"
      
      Person: "Lol yea"
      
      FantanoAI: "Cool...
      
      Seeing plenty of electronica.
      
      Finding a lot of Fred again...
      
      Like... a LOT.
      
      oh boy Afraid To Feel by LF SYSTEM.
      
      oh great another Mall Grab stan...
      
      You've been listening to a lot of Fred again.. lately.
      
      u okay?"
    
      Person: "Yeah why"
    
      FantanoAI: "no reason...`,
      name: 'Person',
    },
    {
      role: 'user',
      content: `My music test is summarized as follows:
      - Listens to ${artists
        .map((artist) => artist.name)
        .slice(0, 10)
        .join(', ')}
      
      - Listens to ${tracks
        .map((track) => `${track.name} by ${track.artists.map((artist) => artist.name).join(' & ')}`)
        .slice(0, 10)
        .join(', ')}`,
      name: 'Person',
    },
  ];

  return messages;
}
