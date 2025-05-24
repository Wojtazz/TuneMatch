import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UserDto } from './user.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SpotifyService } from 'src/spotify/spotify.service';
import { staticConfig } from 'src/config/static-config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly httpService: HttpService,
    private readonly spotifyService: SpotifyService,
  ) {}

  async createUser(userData: UserDto): Promise<User> {
    return await this.saveOrUpdateUser(userData);
  }

  async saveOrUpdateUser(userData: UserDto): Promise<User> {
    const topArtistsNames = [];
    const topArtists = [];

    const topTracksIds = [];
    const topTracks = [];
    await Promise.all(
      staticConfig.SPOTIFY_TIME_RANGES.map(async (timeRange) => {
        const artists = await this.spotifyService.getTopArtists(
          userData.accessToken,
          timeRange,
        );
        const tracks = await this.spotifyService.getTopTracks(
          userData.accessToken,
          timeRange,
        );

        artists.map((e) => {
          if (!topArtistsNames.includes(e.artistName)) {
            topArtists.push(e);
            topArtistsNames.push(e.artistName);
          }
        });
        tracks.map((e) => {
          if (!topTracksIds.includes(e.trackId)) {
            topTracks.push(e);
            topTracksIds.push(e.trackId);
          }
        });
      }),
    );

    const user = await this.userModel.findById(userData._id);
    if (user) {
      const userTopTracksIds = user.topTracks.map((track) => track['trackId']);
      const filteredTopTracks = topTracks.filter(
        (track) => !userTopTracksIds.includes(track.trackId),
      );

      const userTopARtistsIds = user.topArtists.map(
        (artist) => artist['artistId'],
      );
      const filteredTopArtists = topArtists.filter(
        (artist) => !userTopARtistsIds.includes(artist.artistId),
      );

      userData.topArtists = [...user.topArtists, ...filteredTopArtists];
      userData.topTracks = [...user.topTracks, ...filteredTopTracks];
    } else {
      userData.topArtists = topArtists;
      userData.topTracks = topTracks;
    }

    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: userData._id },
      userData,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return updatedUser;
  }

  async refreshAccessToken(user: User): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: user.refreshToken,
        }),
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    const { access_token, refresh_token } = response.data;

    await this.userModel.updateOne(
      { _id: user._id },
      {
        accessToken: access_token,
      },
    );

    if (refresh_token)
      await this.userModel.updateOne(
        { _id: user._id },
        {
          refreshToken: refresh_token,
        },
      );

    return access_token;
  }
}
