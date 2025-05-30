export interface Artist {
  artistName: string;
  artistId: string;
}

export interface Track {
  trackName: string;
  trackId: string;
  trackArtists: string[];
}
