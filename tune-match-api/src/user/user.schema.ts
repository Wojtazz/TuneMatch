import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Artist, Track } from 'src/spotify/spotify.interface';
import { Concert } from 'src/ticketmaster/ticketmaster.interface';

@Schema()
export class User {
  @Prop({ required: true })
  _id: mongoose.Schema.Types.String;
  @Prop({ required: true })
  username: string;
  @Prop({ required: true })
  displayName: string;
  @Prop({ required: true })
  country: string;
  @Prop({ required: true })
  accessToken: string;
  @Prop({ required: true })
  refreshToken: string;
  @Prop()
  topArtists: Artist[];
  @Prop()
  topTracks: Track[];
  @Prop()
  proposedConcerts?: Concert[];
}

export const UserSchema = SchemaFactory.createForClass(User);
