import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  username: string;
  @Prop({ required: true })
  displayName: string;
  @Prop({ required: true })
  country: string;
  @Prop()
  topArtists?: Array<unknown>;
  @Prop()
  topTracks?: Array<unknown>;
}

export const UserSchema = SchemaFactory.createForClass(User);
