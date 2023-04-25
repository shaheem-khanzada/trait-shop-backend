import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TraitShopService } from './trait-shop.service';
import { TraitShopController } from './trait-shop.controller';
import { Trait, TraitSchema } from './schemas/trait.schema';
import { ApesTraitsContractService } from './apes-traits-contract.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trait.name, schema: TraitSchema }]),
  ],
  controllers: [TraitShopController],
  providers: [TraitShopService, ApesTraitsContractService],
})
export class TraitShopModule {}
