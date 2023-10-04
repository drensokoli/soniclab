import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { providerAccountId, createMonthly } = req.body;


    const client = await clientPromise;
    const db = client.db("users");
    const accountsCollection = db.collection("accounts");

    const user = await accountsCollection.findOne({ providerAccountId: providerAccountId });

    if (user) {

        const updatedUserAccount = await accountsCollection.updateOne(
            { providerAccountId: providerAccountId },
            { $set: { createMonthly: createMonthly } }
        );

        res.status(200).json(updatedUserAccount);

    } else {
        res.status(404).json({ message: 'User not found' });
    }
}