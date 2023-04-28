import {
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTraitShopDto {
  @ApiProperty()
  @IsInt()
  maxQuantity: number;

  @ApiProperty()
  @IsInt()
  tokenId: number;

  @ApiProperty()
  @IsInt()
  commission: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  sponsor: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsArray()
  whitelisted: string[];

  @ApiProperty()
  @IsOptional()
  expiryDate?: Date;
}
