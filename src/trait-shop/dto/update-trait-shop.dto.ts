import { IsArray, IsOptional, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTraitShopDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  uri: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  maxQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
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
