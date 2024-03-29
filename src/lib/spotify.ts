
interface Song {
    id: string;
    name: string;
    artist: string;
    image: string;
    link: string;
}

const getAccessToken = async (
    refresh_token: any,
    spotifyClientId: string,
    spotifyClientSecret: string
) => {

    const basic = Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString('base64');
    const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token,
        }),
    });

    return response.json();
};

export async function searchSongs(
    songNames: string[],
    refreshToken: string,
    spotifyClientId: string,
    spotifyClientSecret: string
): Promise<string[]> {

    const { access_token: accessToken } = await getAccessToken(refreshToken, spotifyClientId, spotifyClientSecret);
    const songIds: string[] = [];

    for (const songName of songNames) {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${songName}&type=track&limit=1`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const track = data.tracks.items[0];
        if (track) {
            songIds.push(track.id);
        }
    }

    return songIds;
}

export async function createSpotifyPlaylist(
    providerAccountId: string,
    refreshToken: string,
    spotifyClientId: string,
    spotifyClientSecret: string,
    playlistName: string,
    songIds: string[],
    userId: string,
    description: string,
    type: string
): Promise<string> {

    const { access_token: accessToken } = await getAccessToken(refreshToken, spotifyClientId, spotifyClientSecret);
    const response = await fetch(`https://api.spotify.com/v1/users/${providerAccountId}/playlists`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: playlistName,
            description: description,
            public: false
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const playlistId = data.id;
    await addTracksToSpotifyPlaylist(playlistId, accessToken, songIds);

    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: description
        })
    });

    const endpoint = '/api/savePlaylist';

    const savePlaylist = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId,
            playlistId,
            playlistName,
            description,
            type
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const savePlaylistData = await savePlaylist.json();
    console.log(savePlaylistData.message);

    return playlistId;

}

const addTracksToSpotifyPlaylist = async (
    playlistId: string,
    accessToken: string,
    songIds: string[]
) => {

    const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uris: songIds.map(id => `spotify:track:${id}`)
        })
    });

    if (!addTracksResponse.ok) {
        throw new Error(`HTTP error! status: ${addTracksResponse.status}`);
    }

    return addTracksResponse;
}

export async function deletePlaylist(
    refreshToken: string,
    spotifyClientId: string,
    spotifyClientSecret: string,
    playlistId: string
): Promise<void> {
    try {
        const { access_token: accessToken } = await getAccessToken(refreshToken, spotifyClientId, spotifyClientSecret);

        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const deletePlaylistData = await response.json();
        console.log(deletePlaylistData.message);

        return deletePlaylistData.message;

    } catch (error) {
        console.error(error);
        return Promise.reject("Error deleting playlist" + error);
    }
}

export async function createMonthlyPlaylist(
    providerAccountId: string,
    refreshToken: string,
    spotifyClientId: string,
    spotifyClientSecret: string,
    userId: string,
    createMonthly: boolean
): Promise<string> {
    const { access_token: accessToken } = await getAccessToken(refreshToken, spotifyClientId, spotifyClientSecret);

    const currentDate = new Date();

    let previousMonth = currentDate.getMonth() - 1;
    let previousYear = currentDate.getFullYear();

    if (previousMonth === -1) {
        previousMonth = 11;
        previousYear--;
    }

    const date = new Date(previousYear, previousMonth).toLocaleString('en-US', { month: 'short', year: 'numeric' });

    const playlistName = `SonicLab Monthly Mix - ${date}`;
    const type = 'monthly_playlists';
    const description = `Elevate your listening experience with the SonicLab Monthly Mix. Your top 50 tracks from ${date}, delivered to you by SonicLab.`
    const url = process.env.NEXTAUTH_URL ?? '';

    if (createMonthly) {
        const response = await fetch(`https://api.spotify.com/v1/users/${providerAccountId}/playlists`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playlistName,
                description: description,
                public: false
            })
        });


        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const playlistId = data.id;
        // const songIds = await getMonthlyTracks(accessToken);
        const songIds = await getTopSongs(refreshToken, spotifyClientId, spotifyClientSecret, 'short_term', 50);

        const songIdsArray = songIds.map(song => song.id);

        await addTracksToSpotifyPlaylist(playlistId, accessToken, songIdsArray);

        await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: description
            })
        });

        const endpoint = `${url}/api/savePlaylist`;

        const savePlaylist = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                playlistId,
                playlistName,
                description,
                type
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const savePlaylistData = await savePlaylist.json();
        console.log("savePlaylistData.message - ", savePlaylistData.message);
        return playlistId;
    }

    return "Create monthly playlist is false for " + userId;
}

export async function createHalfYearPlaylist(
    providerAccountId: string,
    refreshToken: string,
    spotifyClientId: string,
    spotifyClientSecret: string,
    userId: string,
    createHalfYear: boolean
): Promise<string> {
    const { access_token: accessToken } = await getAccessToken(refreshToken, spotifyClientId, spotifyClientSecret);

    const currentDate = new Date();
    const thisYear = currentDate.getFullYear().toString();

    const playlistName = `SonicLab Half Year Mix - Jan/Jun ${thisYear}`;
    const type = 'half_year_playlists';
    const description = `Elevate your listening experience with the SonicLab Half Year Mix. Your top 50 tracks from the first half of ${thisYear}, delivered to you by SonicLab.`
    const url = process.env.NEXTAUTH_URL ?? '';

    if (createHalfYear) {
        const response = await fetch(`https://api.spotify.com/v1/users/${providerAccountId}/playlists`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playlistName,
                description: description,
                public: false
            })
        });


        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const playlistId = data.id;
        const songIds = await getTopSongs(refreshToken, spotifyClientId, spotifyClientSecret, 'medium_term', 50);

        const songIdsArray = songIds.map(song => song.id);


        await addTracksToSpotifyPlaylist(playlistId, accessToken, songIdsArray);

        await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: description
            })
        });

        const endpoint = `${url}/api/savePlaylist`;

        const savePlaylist = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                playlistId,
                playlistName,
                description,
                type
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const savePlaylistData = await savePlaylist.json();
        console.log("savePlaylistData.message - ", savePlaylistData.message);
        return playlistId;
    }

    return "Create half year playlist is false for " + userId;
}

export async function getRecentlyPlayedSongs(
    refreshToken: string,
    spotifyClientId: string,
    spotifyClientSecret: string,
    range: number
): Promise<Song[]> {

    const { access_token: accessToken } = await getAccessToken(refreshToken, spotifyClientId, spotifyClientSecret);

    const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${range}`, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    const data = await response.json();

    let songs: Song[] = [];
    if (data.items) {
        songs = data.items.map((item: { track: any; }) => {
            const track = item.track;
            return {
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                artistId: track.artists[0].id,
                image: track.album.images[0].url,
                link: track.external_urls.spotify,
            };
        });
    }

    return songs;
}

export async function getTopSongs(
    refreshToken: string,
    spotifyClientId: string,
    spotifyClientSecret: string,
    timeRange: string,
    songRange: number
): Promise<Song[]> {

    const { access_token: accessToken } = await getAccessToken(refreshToken, spotifyClientId, spotifyClientSecret);

    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${songRange}`, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    const data = await response.json();

    let songs: Song[] = [];
    if (data.items) {
        songs = data.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            artist: item.artists[0].name,
            artistId: item.artists[0].id,
            image: item.album.images[0].url,
            link: item.external_urls.spotify
        }));
    }

    return songs;
}

export async function getRecommandations(
    refreshToken: string,
    spotifyClientId: string,
    spotifyClientSecret: string,
    songs: any
): Promise<Song[]> {
    const seed_artists = songs.map((song: { artistId: any; }) => song.artistId);
    const seed_tracks = songs.map((song: { id: any; }) => song.id);

    const { access_token: accessToken } = await getAccessToken(refreshToken, spotifyClientId, spotifyClientSecret);

    const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=10&&seed_tracks=${seed_tracks.join(",")}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const data = await response.json();
    const tracks = data.tracks;

    let recommendations: Song[] = [];
    if (data.items) {
        recommendations = tracks.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            artist: item.artists[0].name,
            artistId: item.artists[0].id,
            image: item.album.images[0].url,
            link: item.external_urls.spotify
        }));
    }

    return tracks;
}