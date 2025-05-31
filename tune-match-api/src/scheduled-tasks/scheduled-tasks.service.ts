import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { staticConfig } from 'src/config/static-config';
import { SpotifyService } from 'src/spotify/spotify.service';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ScheduledTasksService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly userService: UserService,
    private readonly spotifyService: SpotifyService,
  ) {}
  private readonly logger = new Logger(ScheduledTasksService.name);

  @Cron(CronExpression.EVERY_30_MINUTES)
  async refreshTokens(): Promise<void> {
    const users = await this.userModel.find().exec();
    this.logger.debug(`Refreshing tokens for ${users.length} users`);

    await Promise.all(
      users.map(async (user) => {
        await this.userService.refreshAccessToken(user);
      }),
    );

    this.logger.debug('Finished refreshing tokens');
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async updateTopTracks(): Promise<void> {
    const users = await this.userModel.find().exec();
    this.logger.debug(`Updating top tracks for ${users.length} users`);

    await Promise.all(
      users.map(async (user) => {
        const topTracks = await this.spotifyService.getTopTracks(
          user.accessToken,
          staticConfig.SPOTIFY_TIME_RANGES[0],
        );
        const userTopTracksIds = user.topTracks.map(
          (track) => track['trackId'],
        );
        const filteredTopTracks = topTracks.filter(
          (track) => !userTopTracksIds.includes(track.trackId),
        );

        if (filteredTopTracks.length > 0) {
          await this.userModel.updateOne(
            { _id: user._id },
            { $push: { topTracks: { $each: filteredTopTracks } } },
          );
        }
      }),
    );

    this.logger.debug(`Finished updating top tracks`);
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async updateTopArtists(): Promise<void> {
    const users = await this.userModel.find().exec();
    this.logger.debug(`Updating top tracks for ${users.length} users`);

    await Promise.all(
      users.map(async (user) => {
        const topArtists = await this.spotifyService.getTopArtists(
          user.accessToken,
          staticConfig.SPOTIFY_TIME_RANGES[0],
        );
        const userTopARtistsIds = user.topArtists.map(
          (artist) => artist['artistId'],
        );
        const filteredTopArtists = topArtists.filter(
          (artist) => !userTopARtistsIds.includes(artist.artistId),
        );

        if (filteredTopArtists.length > 0) {
          await this.userModel.updateOne(
            { _id: user._id },
            { $push: { topArtists: { $each: filteredTopArtists } } },
          );
        }
      }),
    );

    this.logger.debug(`Finished updating top tracks`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async addConcertsForUsers(): Promise<void> {
    const users: User[] = await this.userModel.find().exec();
    this.logger.debug(`Adding concerts for ${users.length} users`);

    for (const user of users) {
      const concerts = await this.userService.getConcertsForUser(user);

      this.logger.debug(
        `Found ${concerts.length} concerts for ${user.displayName}`,
      );

      if (concerts.length > 0) {
        await this.userService.updateUser(user._id as unknown as string, {
          $push: { proposedConcerts: { $each: concerts } },
        });
      }
    }

    this.logger.debug('Finished adding concerts');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async matchUsers(): Promise<void> {
    const users: User[] = await this.userModel.find().exec();

    for (const user of users) {
      await this.userService.matchUser(user);
    }
  }
}
