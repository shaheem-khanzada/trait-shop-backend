import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Trait } from './schemas/trait.schema';
import { CreateTraitShopDto } from './dto/create-trait-shop.dto';
import { UpdateTraitShopDto } from './dto/update-trait-shop.dto';

@Injectable()
export class TraitShopService {
  constructor(@InjectModel(Trait.name) private traitModel: Model<Trait>) {}

  create(createTraitShopDto: CreateTraitShopDto) {
    const createdCat = new this.traitModel(createTraitShopDto);
    return createdCat.save();
  }

  findAll(whitelistedPerson: string): Promise<Trait[]> {
    const now = new Date();
    return this.traitModel
      .find({
        $and: [
          {
            $or: [
              { whitelisted: { $size: 0 } },
              { whitelisted: { $in: [whitelistedPerson] } },
            ],
          },
          {
            $or: [{ expiryDate: null }, { expiryDate: { $gte: now } }],
          },
        ],
      })
      .exec();
  }

  findOneByTokenId(tokenId: number) {
    return this.traitModel.findOne({ tokenId }).exec();
  }

  findOneById(id: number) {
    return this.traitModel.findById(id).exec();
  }

  update(id: number, updateTraitShopDto: UpdateTraitShopDto) {
    return `This action updates a #${id} traitShop`;
  }

  remove(id: number) {
    return this.traitModel.findByIdAndDelete(id).exec();
  }
}
