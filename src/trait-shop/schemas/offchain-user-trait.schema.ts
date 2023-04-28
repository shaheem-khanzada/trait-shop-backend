import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserOffChainTraitDocument = HydratedDocument<UserOffChainTrait>;

@Schema({ collection: 'traits_offchain_testnet' })
export class UserOffChainTrait {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  wallet: string;

  @Prop({ required: true })
  date: Date;
}

export const UserOffChainTraitSchema =
  SchemaFactory.createForClass(UserOffChainTrait);
