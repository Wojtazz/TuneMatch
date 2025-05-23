import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SpotifyOauthGuard } from './guards/spotify-oauth.guard';
import { Profile } from 'passport-spotify';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(SpotifyOauthGuard)
  @Get('login')
  login(): void {
    return;
  }

  @UseGuards(SpotifyOauthGuard)
  @Get('redirect')
  async spotifyAuthRedirect(
    @Req() req: any,
    @Res() res: Response,
  ): Promise<Response> {
    const {
      user,
      authInfo,
    }: {
      user: Profile;
      authInfo: {
        accessToken: string;
        refreshToken: string;
        expires_in: number;
      };
    } = req;

    if (!user) {
      res.redirect('/');
      return;
    }

    req.user = undefined;

    const jwt = this.authService.login(user);

    res.set('authorization', `Bearer ${jwt}`);
    const userData: UserDto = {
      _id: user.id,
      username: user.username,
      displayName: user.displayName,
      country: user.country,
      accessToken: authInfo.accessToken,
      refreshToken: authInfo.refreshToken,
    };
    await this.userService.createUser(userData);

    return res.status(201).json({ authInfo, user });
  }
}
