import NextAuth from 'next-auth/next';
import SpotifyProvider from 'next-auth/providers/spotify';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

const db = process.env.NEXT_PUBLIC_MONGODB_DB_NAME;

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
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/auth/signin',
  }
};

export default (req, res) => NextAuth(req, res, authOptions);