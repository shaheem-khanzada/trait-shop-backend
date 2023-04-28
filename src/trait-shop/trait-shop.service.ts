import { Model, Connection } from 'mongoose';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Trait } from './schemas/trait.schema';
import { CreateTraitShopDto } from './dto/create-trait-shop.dto';
import { UpdateTraitShopDto } from './dto/update-trait-shop.dto';
import { ApesTraitsContractService } from './apes-traits-contract.service';
import { UserOffChainTrait } from './schemas/offchain-user-trait.schema';
import { BuyTraitDto } from './dto/buy-trait.dto';

@Injectable()
export class TraitShopService {
  constructor(
    @InjectModel(Trait.name) private traitModel: Model<Trait>,
    @InjectModel(UserOffChainTrait.name)
    private userOffChainTrait: Model<UserOffChainTrait>,
    @InjectConnection() private connection: Connection,
    private apesTraitContract: ApesTraitsContractService,
  ) {}

  signMessage(body: any) {
    return this.apesTraitContract.signMessage(body);
  }

  async findApeTraitById(id: number): Promise<any | null> {
    const apesTraitsCollection = this.connection.collection('apes_traits');
    const apesTrait = await apesTraitsCollection.findOne({ id });
    return apesTrait ? apesTrait : null;
  }

  async create(createTraitShopDto: CreateTraitShopDto) {
    const { tokenId } = createTraitShopDto;
    const apeTrait = await this.findApeTraitById(tokenId);
    if (!apeTrait) {
      throw new HttpException(
        `Ape trait with tokenId ${tokenId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const isAlreadyExist = await this.findOneByTokenId(tokenId);
    if (isAlreadyExist) {
      throw new HttpException(
        `Trait with tokenId ${tokenId} already exists`,
        HttpStatus.NOT_FOUND,
      );
    }
    const trait = new this.traitModel(createTraitShopDto);
    return trait.save();
  }

  async findAll(whitelistedPerson: string): Promise<Trait[]> {
    const now = new Date();
    const traits = await this.traitModel
      .aggregate([
        {
          $match: {
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
          },
        },
        {
          $lookup: {
            from: 'apes_traits',
            let: { tokenId: '$tokenId' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$id', '$$tokenId'] },
                },
              },
            ],
            as: 'apeTrait',
          },
        },
        {
          $addFields: {
            apeTrait: { $arrayElemAt: ['$apeTrait', 0] },
          },
        },
        {
          $match: {
            apeTrait: { $ne: null },
          },
        },
      ])
      .exec();

    return traits;
  }

  async fetchAllTraitsOwnByUser(
    ownerAddress: string,
  ): Promise<(Trait & UserOffChainTrait)[]> {
    const traitsOwnByUser = await this.userOffChainTrait.aggregate([
      { $match: { wallet: ownerAddress } },
      {
        $lookup: {
          from: 'apes_traits',
          let: { id: '$id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$id', '$$id'] },
              },
            },
            {
              $project: {
                minted: 0,
                _id: 0,
              },
            },
          ],
          as: 'apeTrait',
        },
      },
      {
        $project: {
          _id: 0,
          minted: 0,
        },
      },
      {
        $addFields: {
          apeTrait: { $arrayElemAt: ['$apeTrait', 0] },
        },
      },
      {
        $match: {
          apeTrait: { $ne: null },
        },
      },
    ]);
    return traitsOwnByUser;
  }

  async findOneByTokenId(tokenId: number) {
    const trait = await this.traitModel.findOne({ tokenId }).exec();
    if (!trait) {
      return new NotFoundException(`Trait with tokenId ${tokenId} not found`);
    }
    const apeTrait = await this.findApeTraitById(trait.tokenId);
    if (!apeTrait) {
      throw new HttpException(
        `Ape trait with tokenId ${trait.tokenId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return { ...trait.toObject(), apeTrait };
  }

  async findOneById(id: string) {
    const trait = await this.traitModel.findById(id).exec();
    if (!trait) {
      return new NotFoundException(`Trait with ID ${id} not found`);
    }
    const apeTrait = await this.findApeTraitById(trait.tokenId);
    if (!apeTrait) {
      throw new HttpException(
        `Ape trait with tokenId ${trait.tokenId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return { ...trait.toObject(), apeTrait };
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

  async sumOffChainForTokenId(tokenId: number): Promise<number> {
    try {
      const result = await this.userOffChainTrait
        .aggregate([
          { $match: { tokenId: tokenId } },
          { $group: { _id: null, totalOffChain: { $sum: '$amount' } } },
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

  async buyTraitOffChain({ quantity, owner, tokenId }: BuyTraitDto) {
    try {
      const trait = await this.traitModel.findOne({ tokenId }).exec();

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

      const existingUserTrait = await this.userOffChainTrait
        .findOne({ id: tokenId, wallet: owner })
        .exec();

      if (existingUserTrait) {
        quantity += existingUserTrait.amount || 0;
        existingUserTrait.amount = quantity;
        return existingUserTrait.save();
      } else {
        const buyPayload: Partial<UserOffChainTrait> = {
          wallet: owner,
          id: tokenId,
          date: new Date(),
        };
        buyPayload.amount = quantity;
        const userTrait = new this.userOffChainTrait(buyPayload);
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
