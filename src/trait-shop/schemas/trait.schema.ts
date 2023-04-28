import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TraitDocument = HydratedDocument<Trait>;

@Schema({ timestamps: true, collection: 'traits_sells' })
export class Trait {
  @Prop({ required: true })
  maxQuantity: number;

  @Prop({ required: true })
  tokenId: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  commission: number;

  @Prop()
  sponsor: string;

  @Prop([String])
  whitelisted: string[];

  @Prop({ type: Date })
  expiryDate?: Date;
}

export const TraitSchema = SchemaFactory.createForClass(Trait);
