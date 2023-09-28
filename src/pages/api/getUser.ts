import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userEmail } = req.body;

    const dbName = process.env.MONGODB_DB_NAME;
    const collectionName = process.env.MONGODB_COLLECTION_NAME;

    const client = await clientPromise;
    const db = client.db(dbName);
    const usersCollection = db.collection("users");
    const accountsCollection = db.collection("accounts");

    const user = await usersCollection.findOne({ email: userEmail });

    if (user) {
      const id = user._id;
      const userAccount = await accountsCollection.findOne({ userId: id });
      
      res.status(200).json(userAccount);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
