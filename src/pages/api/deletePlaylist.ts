import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId, playlistId, playlistType } = req.body;

        const client = await clientPromise;
        const db = client.db('users');
        const collection = db.collection('playlists');

        const user = await collection.findOne({ userId: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const playlist = user[playlistType].find((p: { playlistId: any; }) => p.playlistId === playlistId);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        user[playlistType] = user[playlistType].map((p: { playlistId: any; }) =>
            p.playlistId === playlistId ? { ...p, deleted: true } : p
        );

        await collection.updateOne({ userId: userId }, { $set: user });

        res.json({ message: 'Playlist marked as deleted successfully' });

        // client.close();        

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}