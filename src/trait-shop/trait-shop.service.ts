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
import { UserTrait } from './schemas/user-traits.schema';
import { BuyTraitDto } from './dto/buy-trait.dto';

@Injectable()
export class TraitShopService {
  constructor(
    @InjectModel(Trait.name) private traitModel: Model<Trait>,
    @InjectModel(UserTrait.name)
    private userTraitModel: Model<UserTrait>,
    private apesTraitContract: ApesTraitsContractService,
  ) {
    setTimeout(() => {
      this.apesTraitContract.getTotalSuppyByTokenId(808).then(console.log);
    }, 4000);
  }

  async create(createTraitShopDto: CreateTraitShopDto) {
    const isAlreadyExist = await this.findOneByTokenId(
      createTraitShopDto.tokenId,
    );
    if (isAlreadyExist) {
      throw new HttpException(
        `Trait with tokenId ${createTraitShopDto.tokenId} already exist`,
        HttpStatus.CONFLICT,
      );
    }
    const trait = new this.traitModel(createTraitShopDto);
    return trait.save();
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

  async fetchAllTraitsOwnByUser(
    ownerAddress: string,
  ): Promise<(Trait & UserTrait)[]> {
    const traitsOwnByUser = await this.userTraitModel.aggregate([
      { $match: { owner: ownerAddress } },
      {
        $lookup: {
          from: 'traits',
          localField: 'tokenId',
          foreignField: 'tokenId',
          as: 'trait',
        },
      },
      { $unwind: '$trait' },
      {
        $project: {
          _id: 0,
          name: '$trait.name',
          uri: '$trait.uri',
          tokenId: 1,
          owner: 1,
          offChain: 1,
          onChain: 1,
        },
      },
    ]);
    return traitsOwnByUser;
  }

  findOneByTokenId(tokenId: number): Promise<Trait> {
    return this.traitModel.findOne({ tokenId }).exec();
  }

  findOneOwnerTraitByTokenId(tokenId: number): Promise<UserTrait> {
    return this.userTraitModel.findOne({ tokenId }).exec();
  }

  findOneById(id: string) {
    return this.traitModel.findById(id).exec();
  }

  async update(traitId: string, updateTraitShopDto: UpdateTraitShopDto) {
    const trait = await this.traitModel.findByIdAndUpdate(
      traitId,
      updateTraitShopDto,
    );
    if (!trait) {
      throw new NotFoundException(`Trait with ID ${traitId} not found`);
    }
    return trait;
  }

  async updateOwnerTraitOffchainCount(tokenId: number, count: number) {
    const trait = await this.userTraitModel.findOneAndUpdate(
      { tokenId },
      { offChain: count },
    );
    if (!trait) {
      throw new NotFoundException(`Trait with ID ${tokenId} not found`);
    }
    return trait;
  }

  async sumOffChainForTokenId(tokenId: number): Promise<number> {
    try {
      const result = await this.userTraitModel
        .aggregate([
          { $match: { tokenId: tokenId } },
          { $group: { _id: null, totalOffChain: { $sum: '$offChain' } } },
        ])
        .exec();

      return result?.[0]?.totalOffChain ?? 0;
    } catch (e) {
      return 0;
    }
  }

  async getCountByTokenId(tokenId: number) {
    const onChainCount = await this.apesTraitContract.getTotalSuppyByTokenId(
      tokenId,
    );
    const offChainCount = await this.sumOffChainForTokenId(tokenId);
    return { onChainCount, offChainCount, total: offChainCount + onChainCount };
  }

  async buyTrait({ quantity, owner, tokenId, isOnChain }: BuyTraitDto) {
    try {
      const trait = await this.findOneByTokenId(tokenId);
      if (!trait) {
        throw new NotFoundException(`Trait with tokenID ${tokenId} not found`);
      }

      const { total } = await this.getCountByTokenId(tokenId);

      if (!(total + quantity <= trait.maxQuantity)) {
        throw new HttpException(
          `The requested action exceeds the maximum quantity allowed for this trait: ${tokenId}. Maximum allowed quantity is ${trait.maxQuantity}. Please reduce the quantity and try again`,
          HttpStatus.CONFLICT,
        );
      }

      const existingUserTrait = await this.userTraitModel
        .findOne({ tokenId, owner })
        .exec();

      if (existingUserTrait) {
        if (isOnChain) {
          quantity += existingUserTrait.onChain || 0;
          existingUserTrait.onChain = quantity;
        } else {
          quantity += existingUserTrait.offChain || 0;
          existingUserTrait.offChain = quantity;
        }
        return existingUserTrait.save();
      } else {
        const buyPayload: Partial<UserTrait> = { owner, tokenId };
        if (isOnChain) {
          buyPayload.onChain = quantity;
        } else {
          buyPayload.offChain = quantity;
        }
        const userTrait = new this.userTraitModel(buyPayload);
        return userTrait.save();
      }
    } catch (error) {
      // Handle error
      console.error(error);
      throw error;
    }
  }

  async updateWhitelisted(
    traitId: string,
    newWhitelisted: string[],
  ): Promise<Trait> {
    const trait = await this.traitModel.findById(traitId).exec();
    if (!trait) {
      throw new NotFoundException(`Trait with ID ${traitId} not found`);
    }
    if (!(Array.isArray(newWhitelisted) && newWhitelisted.length)) {
      throw new NotFoundException(
        'Whitelisted must be an array with at least one element',
      );
    }
    const existingWhitelisted = trait.whitelisted || [];
    const updatedWhitelisted = [...existingWhitelisted, ...newWhitelisted];
    const uniqueWhitelisted = [...new Set(updatedWhitelisted)];
    trait.whitelisted = uniqueWhitelisted;
    return await trait.save();
  }

  remove(_id: string) {
    return this.traitModel.deleteOne({ _id }).exec();
  }
}
