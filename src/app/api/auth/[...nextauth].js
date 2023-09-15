// Import NextAuth and Providers
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

// Import the helper function to get playlists from Spotify
import { getPlaylists } from '../../lib/spotify';

// Export a default function that returns NextAuth with options
export default function (req, res) {
  return NextAuth(req, res, {
    // Configure the providers
    providers: [
      Providers.Spotify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        scope: 'user-read-email user-read-private user-read-currently-playing user-top-read playlist-read-private playlist-modify-public playlist-modify-private'
      })
    ],
    // Configure the database connection
    database: process.env.NEXT_PUBLIC_MONGODB_URI,
    // Configure the callbacks
    callbacks: {
      // This callback is called when a user signs in
      async signIn(user, account, profile) {
        // Check if the user has a valid email address
        if (user.email) {
          return true;
        } else {
          return false;
        }
      },
      // This callback is called when a JWT token is created or updated
      async jwt(token, user, account, profile, isNewUser) {
        // If the user signs in for the first time, add their access token and refresh token to the token object
        if (isNewUser) {
          token.accessToken = account.accessToken;
          token.refreshToken = account.refreshToken;
        }
        return token;
      },
      // This callback is called when a session object is created or updated
      async session(session, token) {
        // Add the user's playlists to the session object
        session.user.playlists = await getPlaylists(token.accessToken);
        return session;
      }
    }
  });
}
