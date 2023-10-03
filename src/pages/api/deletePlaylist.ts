import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId, playlistId, playlistType } = req.body;

        const client = await clientPromise;
        const db = client.db('playlists');
        const collection = db.collection('user_playlists');

        // Find the user by ID
        const user = await collection.findOne({ userId: userId });

        if (!user) {
            // If the user doesn't exist, return a 404 error
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the playlist by ID and type
        let playlist;
        if (playlistType === 'monthly_playlists') {
            playlist = user.monthly_playlists.find((p: { playlistId: any; }) => p.playlistId === playlistId);
        } else if (playlistType === 'ai_gen_playlists') {
            playlist = user.ai_gen_playlists.find((p: { playlistId: any; }) => p.playlistId === playlistId);
        }

        if (!playlist) {
            // If the playlist doesn't exist, return a 404 error
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Set the deleted value to true for the playlist
        if (playlistType === 'monthly_playlists') {
            user.monthly_playlists = user.monthly_playlists.map((p: { playlistId: any; }) =>
                p.playlistId === playlistId ? { ...p, deleted: true } : p
            );
        } else if (playlistType === 'ai_gen_playlists') {
            user.ai_gen_playlists = user.ai_gen_playlists.map((p: { playlistId: any; }) =>
                p.playlistId === playlistId ? { ...p, deleted: true } : p
            );
        }

        // Update the user in the database
        await collection.updateOne({ userId: userId }, { $set: user });

        // Return a success message
        res.json({ message: 'Playlist marked as deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}