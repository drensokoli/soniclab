import axios from 'axios';

// A helper function to get playlists from Spotify
export async function getPlaylists(accessToken: any) {
  try {
    // Set the authorization header with the access token
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    // Make a GET request to the Spotify API endpoint for playlists
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', { headers });
    // Return an array of playlists
    return response.data.items;
  } catch (error) {
    // Handle any errors
    console.error(error);
    return [];
  }
}
