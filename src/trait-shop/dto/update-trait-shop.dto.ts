import { PartialType } from '@nestjs/mapped-types';
import { CreateTraitShopDto } from './create-trait-shop.dto';

export class UpdateTraitShopDto extends PartialType(CreateTraitShopDto) {}
