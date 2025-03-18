import {
  Controller,
  Get,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('top-tracks')
  async getTopTracks(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('No Authorization Header');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }
    console.log('Bearer token:', token);
    return this.spotifyService.getTopTracks(token);
  }
}
