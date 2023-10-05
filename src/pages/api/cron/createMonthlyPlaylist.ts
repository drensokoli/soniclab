import type { NextApiRequest, NextApiResponse } from 'next';
import { createMonthlyPlaylist } from '../../../lib/spotify';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const client = await clientPromise;
  const db = client.db("users");
  const usersCollection = db.collection("accounts");

  const users = await usersCollection.find({}).toArray();

  for (const user of users) {

    const providerAccountId = user.providerAccountId
    const refreshToken = user.refresh_token
    const userId = user.userId
    const createMonthly = user.createMonthly;

    await createMonthlyPlaylist(
      providerAccountId,
      refreshToken,
      process.env.SPOTIFY_CLIENT_ID ?? '',
      process.env.SPOTIFY_CLIENT_SECRET ?? '',
      userId,
      createMonthly
    );
  }
  res.status(200).json({ message: 'Monthly playlists created' });
}