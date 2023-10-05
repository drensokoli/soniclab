
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

export async function createAIPlaylist(
    providerAccountId: string,
    refreshToken: string,
    spotifyClientId: string,
    spotifyClientSecret: string,
    playlistName: string,
    songIds: string[],
    userId: string,
    description: string,
    songNumber: number,
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

    await addTracksToAIPlaylist(playlistId, accessToken, songIds);

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
            type: "ai_gen_playlists"
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const savePlaylistData = await savePlaylist.json();
    console.log(savePlaylistData.message);

    return playlistId;

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

    const playlistName = `SpotiLab Monthly Playlist - ${new Date(previousYear, previousMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
    const type = 'monthly_playlists';
    const description = 'SpotiLab monthly personalized playlist';
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

        await addTracksToMonthlyPlaylist(playlistId, accessToken);


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
        console.log(savePlaylistData.message);
        return playlistId;
    }

    return "Create monthly playlist is false";
}

const addTracksToAIPlaylist = async (
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

const addTracksToMonthlyPlaylist = async (
    playlistId: string,
    accessToken: string
) => {

    const songIds = await getMonthlyTracks(accessToken);
    // const songIds = [''];

    const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uris: songIds.map((id: any) => `spotify:track:${id}`)
        })
    });

    if (!addTracksResponse.ok) {
        throw new Error(`HTTP error! status: ${addTracksResponse.status}`);
    }

    return addTracksResponse;
}

const getMonthlyTracks = async (
    accessToken: string
) => {
    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50`, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const trackIds = data.items.map((item: any) => item.id);
    return trackIds;
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