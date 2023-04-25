import { Injectable } from '@nestjs/common';
import { CreateTraitShopDto } from './dto/create-trait-shop.dto';
import { UpdateTraitShopDto } from './dto/update-trait-shop.dto';

@Injectable()
export class TraitShopService {
  create(createTraitShopDto: CreateTraitShopDto) {
    return 'This action adds a new traitShop';
  }

  findAll() {
    return `This action returns all traitShop`;
  }

  findOne(id: number) {
    return `This action returns a #${id} traitShop`;
  }

  update(id: number, updateTraitShopDto: UpdateTraitShopDto) {
    return `This action updates a #${id} traitShop`;
  }

  remove(id: number) {
    return `This action removes a #${id} traitShop`;
  }
}
