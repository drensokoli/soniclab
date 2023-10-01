import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const { userId } = req.body;

        const client = await clientPromise;
        const db = client.db('playlists');
        const collection = db.collection('user_playlists');

        const user = await collection.findOne({ userId: userId });
        
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}