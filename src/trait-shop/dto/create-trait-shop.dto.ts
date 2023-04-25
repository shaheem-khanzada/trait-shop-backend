import { IsString, IsInt, IsDate, IsArray, IsOptional } from 'class-validator';

export class CreateTraitShopDto {
  @IsString()
  name: string;

  @IsString()
  uri: string;

  @IsInt()
  maxQuantity: number;

  @IsInt()
  tokenId: number;

  @IsInt()
  price: number;

  @IsOptional()
  @IsArray()
  whitelisted: string[];

  @IsOptional()
  @IsDate()
  expiryDate?: Date;
}
