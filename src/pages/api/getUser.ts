import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../lib/mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userEmail } = req.body;

    const client = await clientPromise;
    const db = client.db("users");
    const usersCollection = db.collection("users");
    const accountsCollection = db.collection("accounts");

    const user = await usersCollection.findOne({ email: userEmail });

    if (user) {
      const id = user._id;
      const userAccount = await accountsCollection.findOne({ userId: id });
      
      if (userAccount && !userAccount.hasOwnProperty('createMonthly')) {
        await accountsCollection.updateOne({ userId: id }, { $set: { createMonthly: true } });
      }

      if (userAccount && !userAccount.hasOwnProperty('createHalfYear')) {
        await accountsCollection.updateOne({ userId: id }, { $set: { createHalfYear: true } });
      }

      res.status(200).json(userAccount);
    } else {
      res.status(404).json({ message: 'User not found' });
    }

    // client.close();

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}