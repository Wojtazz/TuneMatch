import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SpotifyService {
  async getTopTracks(accessToken: string) {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/top/tracks',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  }
}
