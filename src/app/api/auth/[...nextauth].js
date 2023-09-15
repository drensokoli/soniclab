import NextAuth from 'next-auth/next';
import SpotifyProvider from "next-auth/providers/spotify";
// import clientPromise from "../../../lib/mongodb"

const db = process.env.NEXT_PUBLIC_MONGODB_DB_NAME;

export const authOptions = {
    // adapter: MongoDBAdapter(clientPromise, {
    //     databaseName: db,
    //     collections: {
    //         sessions: "sessions",
    //         users: "users",
    //         verificationRequests: "verificationRequests",
    //     },
    // }),
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: profile.id,
                    name: profile.display_name,
                    email: profile.email,
                    image: profile.images?.[0]?.url,
                };
            },
        })
    ],
    secret: process.env.JWT_SECRET,
    database: process.env.NEXT_PUBLIC_MONGODB_URI,
};

export default (req, res) => NextAuth(req, res, authOptions);