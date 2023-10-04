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

    const currentDate = new Date();
    
    let previousMonth = currentDate.getMonth() - 1;
    let previousYear = currentDate.getFullYear();

    if (previousMonth === -1) {
      previousMonth = 11; // December is represented as 11 in JavaScript Date object
      previousYear--;
    }

    const playlistName = `SpotiLab Monthly Playlist - ${new Date(previousYear, previousMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
    const type = 'monthly_playlists';
    const userId = user.userId
    const description = 'SpotiLab monthly personalized playlist';
    const url = process.env.NEXTAUTH_URL ?? '';
    const createMonthly = user.createMonthly;

    await createPlaylist(
      providerAccountId,
      refreshToken,
      process.env.SPOTIFY_CLIENT_ID ?? '',
      process.env.SPOTIFY_CLIENT_SECRET ?? '',
      playlistName,
      [''],
      'monthly_playlists',
      userId,
      description,
      0,
      url,
      createMonthly
    );
  }
  res.status(200).json({ message: 'Monthly playlists created' });
}