import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TraitDocument = HydratedDocument<Trait>;

@Schema()
export class Trait {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  uri: string;

  @Prop({ required: true })
  maxQuantity: number;

  @Prop({ required: true })
  tokenId: number;

  @Prop({ required: true })
  price: number;

  @Prop([String])
  whitelisted: string[];

  @Prop({ type: Date })
  expiryDate?: Date;
}

export const TraitSchema = SchemaFactory.createForClass(Trait);
