export class UserDto {
  username: string;
  displayName: string;
  country: string;
  topArtists?: Array<unknown>;
  topTracks?: Array<unknown>;
}
