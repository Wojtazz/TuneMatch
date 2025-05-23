export class UserDto {
  _id: string;
  username: string;
  displayName: string;
  country: string;
  topArtists?: Array<unknown>;
  topTracks?: Array<unknown>;
  accessToken: string;
  refreshToken: string;
}
