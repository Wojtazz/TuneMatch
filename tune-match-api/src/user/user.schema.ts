import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

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
  topArtists?: Array<unknown>;
  @Prop()
  topTracks?: Array<unknown>;
}

export const UserSchema = SchemaFactory.createForClass(User);
