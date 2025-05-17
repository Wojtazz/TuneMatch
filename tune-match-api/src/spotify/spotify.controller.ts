import {
  Controller,
  Get,
  UnauthorizedException,
  Headers,
  Query,
  Param,
} from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('top-tracks')
  async getTopTracks(
    @Headers('authorization') authHeader: string,
    @Query('time-range') timeRange: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('No Authorization Header');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    return this.spotifyService.getTopTracks(token, timeRange);
  }

  @Get('top-artists')
  async getTopArtists(
    @Headers('authorization') authHeader: string,
    @Query('time-range') timeRange: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('No Authorization Header');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    return await this.spotifyService.getTopArtists(token, timeRange);
  }
}
