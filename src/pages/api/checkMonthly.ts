import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userEmail, createMonthly } = req.body;


    const client = await clientPromise;
    const db = client.db("users");
    const usersCollection = db.collection("users");
    const accountsCollection = db.collection("accounts");

    const user = await usersCollection.findOne({ email: userEmail });

    if (user) {
        const id = user._id;

        await accountsCollection.updateOne(
            { userId: id },
            { $set: { createMonthly: createMonthly } }
        );

        const updatedUserAccount = await accountsCollection.findOne({ userId: id });

        res.status(200).json(updatedUserAccount);

    } else {
        res.status(404).json({ message: 'User not found' });
    }
}