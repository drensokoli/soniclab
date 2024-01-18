import NextAuth from 'next-auth/next';
import SpotifyProvider from 'next-auth/providers/spotify';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

const db = process.env.MONGODB_DB_NAME;

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: db,
    collections: {
      sessions: "sessions",
      users: "users",
      verificationRequests: "verificationRequests",
    },
  }),
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: "https://accounts.spotify.com/authorize?scope=ugc-image-upload,user-read-currently-playing,playlist-read-private,playlist-read-collaborative,playlist-modify-private,playlist-modify-public,user-follow-read,user-top-read,user-read-recently-played,user-library-read,user-read-email,user-read-private"
    }),
  ],
  secret: process.env.JWT_SECRET,
};

export default (req, res) => NextAuth(req, res, authOptions);
