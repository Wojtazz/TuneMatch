import { Concert } from 'src/ticketmaster/ticketmaster.interface';

export interface MatchedUser {
  _id: string;
  displayName: string;
  matchedConcerts: Concert[];
}
