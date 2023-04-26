import { IsString, IsInt, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BuyTraitDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  tokenId: number;

  @ApiProperty()
  @IsString()
  owner: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isOnChain: boolean;
}
