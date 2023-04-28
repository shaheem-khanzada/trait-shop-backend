import {
  IsArray,
  IsOptional,
  IsInt,
  IsString,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTraitShopDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  maxQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  commission: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  sponsor: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  whitelisted: string[];

  @ApiProperty()
  @IsOptional()
  expiryDate?: Date;
}
