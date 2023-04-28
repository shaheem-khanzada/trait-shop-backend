import { IsString, IsInt, IsNotEmpty } from 'class-validator';
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
}
