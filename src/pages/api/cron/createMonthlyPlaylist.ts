import type { NextApiRequest, NextApiResponse } from 'next';
import { createPlaylist } from '../../../lib/spotify';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const client = await clientPromise;
  const db = client.db("users");
  const usersCollection = db.collection("accounts");

  const users = await usersCollection.find({}).toArray();

  for (const user of users) {
    const providerAccountId = user.providerAccountId
    const refreshToken = user.refresh_token
    const playlistName = `SpotiLab Monthly Playlist - ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
    const type = 'monthly_playlists';
    const userId = user.userId
    const description = 'SpotiLab monthly personalized playlist';
    const url = process.env.NEXTAUTH_URL ?? '';

    const playlistId = await createPlaylist(
      providerAccountId,
      refreshToken,
      process.env.SPOTIFY_CLIENT_ID ?? '',
      process.env.SPOTIFY_CLIENT_SECRET ?? '',
      playlistName,
      [''], // no songs yet
      'monthly_playlists',
      userId,
      description,
      0,
      url
    );
  }
  res.status(200).json({ message: 'Monthly playlists created' });
}