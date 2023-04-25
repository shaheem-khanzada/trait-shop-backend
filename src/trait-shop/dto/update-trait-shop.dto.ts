// import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional } from 'class-validator';
// import { CreateTraitShopDto } from './create-trait-shop.dto';

// export class UpdateTraitShopDto extends PartialType(CreateTraitShopDto) {

export class UpdateTraitShopDto {
  @IsOptional()
  @IsArray()
  whitelisted: string[];

  @IsOptional()
  expiryDate?: Date;
}
