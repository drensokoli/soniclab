import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    try {
        const {
            userId,
            playlistId,
            playlistName,
            description,
            type
        } = req.body;

        const client = await clientPromise;
        const db = client.db('users');
        const collection = db.collection('playlists');

        const user = await collection.findOne({ userId: userId });

        if (!user) {
            await collection.insertOne({
                userId: userId,
                monthly_playlists: [],
                half_year_playlists: [],
                // ai_gen_playlists: [],
                top_playlists: [],
                session_playlists: []
            });
        }

        const deleted = false;
        const update = {
            $push: {
                [`${type}`]: {
                    playlistId,
                    playlistName,
                    description,
                    deleted,
                    created_at: new Date()
                }
            }
        };

        await collection.updateOne({ userId: userId }, update);

        res.status(200).json({ message: 'Playlist saved successfully' });

        // client.close();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}