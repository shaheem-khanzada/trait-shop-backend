import { IsString, IsInt, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTraitShopDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  uri: string;

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
  @IsInt()
  price: number;

  @IsOptional()
  @IsArray()
  whitelisted: string[];

  @ApiProperty()
  @IsOptional()
  expiryDate?: Date;
}
