import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserTraitDocument = HydratedDocument<UserTrait>;

@Schema({ timestamps: true })
export class UserTrait {
  @Prop({ required: true })
  tokenId: number;

  @Prop({ required: true })
  owner: string;

  @Prop()
  offChain: number;

  @Prop()
  onChain: number;
}

export const UserTraitSchema = SchemaFactory.createForClass(UserTrait);
