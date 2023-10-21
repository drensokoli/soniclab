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

        // Filter out the playlists where deleted is false
        const ai_gen_playlists = user?.ai_gen_playlists.filter((playlist: any) => !playlist.deleted);
        const monthly_playlists = user?.monthly_playlists.filter((playlist: any) => !playlist.deleted);
        const top_playlists = user?.top_playlists.filter((playlist: any) => !playlist.deleted);
        const session_playlists = user?.session_playlists.filter((playlist: any) => !playlist.deleted);

        // Send the response with the filtered playlists
        res.status(200).json({
            ...user,
            ai_gen_playlists,
            monthly_playlists,
            top_playlists,
            session_playlists
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'internal server error' });
    }
}
