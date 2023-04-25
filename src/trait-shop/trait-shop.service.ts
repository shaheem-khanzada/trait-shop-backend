import { Model } from 'mongoose';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Trait } from './schemas/trait.schema';
import { CreateTraitShopDto } from './dto/create-trait-shop.dto';
import { UpdateTraitShopDto } from './dto/update-trait-shop.dto';
import { ApesTraitsContractService } from './apes-traits-contract.service';

@Injectable()
export class TraitShopService {
  constructor(
    @InjectModel(Trait.name) private traitModel: Model<Trait>,
    private apesTraitContract: ApesTraitsContractService,
  ) {}

  async create(createTraitShopDto: CreateTraitShopDto) {
    const isAlreadyExist = await this.findOneByTokenId(
      createTraitShopDto.tokenId,
    );
    if (isAlreadyExist) {
      throw new HttpException(
        `Trait with tokenId ${createTraitShopDto.tokenId} already exist`,
        HttpStatus.FOUND,
      );
    }
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

  findOneById(id: string) {
    return this.traitModel.findById(id).exec();
  }

  async update(id: string, updateTraitShopDto: UpdateTraitShopDto) {
    const trait = await this.traitModel.findByIdAndUpdate(
      id,
      updateTraitShopDto,
      {
        new: true,
      },
    );
    if (!trait) {
      return new NotFoundException();
    }
    return trait;
  }

  remove(id: string) {
    this.apesTraitContract.getTotalSuppyByTokenId(123);
    const filter = { _id: id };
    return this.traitModel.deleteOne(filter).exec();
  }
}
