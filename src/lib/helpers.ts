import { deletePlaylist } from "./spotify";
import { Button, Modal } from 'antd';

interface Playlist {
    playlistName: string;
    playlistId: string;
    description: string;
    type: string;
    created_at?: string;
}

export async function fetchUser(userEmail: string, setPlaylists: any) {
    try {
        const response = await fetch('/api/getUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userEmail: userEmail
            }),
        });
        const data = await response.json();

        sessionStorage.setItem('userId', data.userId);
        sessionStorage.setItem('providerAccountId', data.providerAccountId);
        sessionStorage.setItem('refreshToken', data.refresh_token);
        sessionStorage.setItem('createMonthly', data.createMonthly);
        sessionStorage.setItem('createHalfYear', data.createHalfYear);

        fetchPlaylists(data.userId, setPlaylists);

    } catch (error) {
        console.error('Error:', error);
    }
}

export async function fetchPlaylists(userId: string, setPlaylists: any) {
    try {
        const response = await fetch('/api/getPlaylists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
            }),
        });

        const data = await response.json();

        const monthlyPlaylists = data.monthly_playlists.map((playlist: Playlist) => ({
            playlistName: playlist.playlistName,
            playlistId: playlist.playlistId,
            description: playlist.description,
            created_at: playlist.created_at,
            type: 'monthly_playlists',
        }));

        const halfYearPlaylists = data.half_year_playlists.map((playlist: Playlist) => ({
            playlistName: playlist.playlistName,
            playlistId: playlist.playlistId,
            description: playlist.description,
            created_at: playlist.created_at,
            type: 'half_year_playlists',
        }));

        // const aiGenPlaylists = data.ai_gen_playlists.map((playlist: Playlist) => ({
        //     playlistId: playlist.playlistId,
        //     description: playlist.description,
        //     created_at: playlist.created_at,
        //     type: 'ai_gen_playlists',
        // }));

        const topPlaylists = data.top_playlists.map((playlist: Playlist) => ({
            playlistName: playlist.playlistName,
            playlistId: playlist.playlistId,
            description: playlist.description,
            created_at: playlist.created_at,
            type: 'top_playlists',
        }));

        const sessionPlaylists = data.session_playlists.map((playlist: Playlist) => ({
            playlistName: playlist.playlistName,
            playlistId: playlist.playlistId,
            description: playlist.description,
            created_at: playlist.created_at,
            type: 'session_playlists',
        }));

        // const allPlaylists = [...monthlyPlaylists, ...halfYearPlaylists, ...aiGenPlaylists, ...topPlaylists, ...sessionPlaylists];
        const allPlaylists = [...monthlyPlaylists, ...halfYearPlaylists, ...topPlaylists, ...sessionPlaylists];

        allPlaylists.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setPlaylists(allPlaylists);
        sessionStorage.setItem('playlists', JSON.stringify(allPlaylists));

    } catch (error) {
        console.error(error);
    }
}

export async function handleCreateMonthly(name: string) {

    const createMonthly = sessionStorage.getItem('createMonthly') === 'true' ? false : true;
    const createHalfYear = sessionStorage.getItem('createHalfYear') === 'true' ? false : true;
    const providerAccountId = sessionStorage.getItem('providerAccountId');

    let response;

    if (name === 'createMonthly') {
        response = await fetch('/api/checkMonthly', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                providerAccountId: providerAccountId,
                createMonthly: createMonthly,
            }),
        });
        sessionStorage.setItem('createMonthly', createMonthly.toString());
    } else {
        response = await fetch('/api/checkHalfYear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                providerAccountId: providerAccountId,
                createHalfYear: createHalfYear,
            }),
        });
        sessionStorage.setItem('createHalfYear', createHalfYear.toString());

    }

    const data = await response.json();

    console.log(data.message);
}

export const handleDeletePlaylist = async (playlistName: string, playlistId: string, playlistType: string, setPlaylists: any, refreshToken: string, spotifyClientId: string, spotifyClientSecret: string) => {
    Modal.confirm({
        title: 'Delete Playlist?',
        content: `Are you sure you want to delete "${playlistName}"?`,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        maskClosable: true,
        style: {
            top: 220,
        },
        onOk: async () => {
            try {
                const playlistArray = sessionStorage.getItem('playlists');
                const parsedPlaylistArray = JSON.parse(playlistArray as string);
                const updatedPlaylists = parsedPlaylistArray.filter((playlist: Playlist) => playlist.playlistId !== playlistId);
                setPlaylists(updatedPlaylists);
                sessionStorage.setItem('playlists', JSON.stringify(updatedPlaylists));

                deletePlaylist(refreshToken, spotifyClientId, spotifyClientSecret, playlistId);

                const userId = sessionStorage.getItem('userId');

                const response = await fetch('/api/deletePlaylist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        playlistId: playlistId,
                        playlistType: playlistType,
                    }),
                });

                const data = await response.json();
                console.log(data.message);

                return updatedPlaylists;
            } catch (error) {
                console.error(error);
            }
        },
        onCancel() {
            console.log('Cancel');
        },
    });
};
