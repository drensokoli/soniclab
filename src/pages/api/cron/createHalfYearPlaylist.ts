import type { NextApiRequest, NextApiResponse } from 'next';
import { createHalfYearPlaylist, createMonthlyPlaylist } from '../../../lib/spotify';
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
    const createHalfYear = user.createHalfYear;

    try {await createHalfYearPlaylist(
        providerAccountId,
        refreshToken,
        process.env.SPOTIFY_CLIENT_ID ?? '',
        process.env.SPOTIFY_CLIENT_SECRET ?? '',
        userId,
        createHalfYear
      );

    } catch (error) {
      console.error(`Error creating half year playlist for user ${userId}: ${error}`);
      continue;
    }
    
  }
  res.status(200).json({ message: 'Half year playlists created' });
}