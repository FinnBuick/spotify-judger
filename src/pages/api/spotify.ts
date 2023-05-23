// src/generatePrompt.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { ArtistObject, Timerange, TrackObject } from '../../types/spotify';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function generate(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const accessToken = session?.accessToken;

  if (!session || !accessToken) {
    res.status(401).json({
      error: {
        message: 'Unauthorized',
      },
    });
    return;
  }

  try {
    // call getUsersTopArtists and getUsersTopTracks in parallel
    const [topArtists, topTracks] = await Promise.all([
      getUsersTopArtists(accessToken, req.body.timeRange, req.body.limit),
      getUsersTopTracks(accessToken, req.body.timeRange, req.body.limit),
    ]);

    // return both top artists and top tracks
    res.status(200).json({
      result: {
        topArtists,
        topTracks,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'An error occurred during your request.',
      },
    });
  }
}

async function getUsersTopArtists(
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

async function getUsersTopTracks(
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
