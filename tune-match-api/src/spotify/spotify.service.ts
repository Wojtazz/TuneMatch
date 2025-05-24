import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SpotifyService {
  async getTopTracks(accessToken: string, timeRange: string) {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/top/tracks',
      {
        params: {
          limit: 5,
          time_range: timeRange,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const topTracksData: Array<any> = response.data.items;
    const topTracksAndIds = topTracksData.map((e) => {
      const artists = e.artists.map((artist) => artist.name);

      return {
        trackName: e.name,
        trackId: e.id,
        trackArtists: artists,
      };
    });
    return topTracksAndIds;
  }

  async getTopArtists(accessToken: string, timeRange: string) {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/top/artists',
      {
        params: {
          limit: 5,
          time_range: timeRange,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const topArtistsData: Array<any> = response.data.items;
    const topArtistsAndIds = topArtistsData.map((e) => {
      return {
        artistName: e.name,
        artistId: e.id,
      };
    });

    return topArtistsAndIds;
  }
}
