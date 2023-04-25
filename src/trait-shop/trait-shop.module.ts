import { Module } from '@nestjs/common';
import { TraitShopService } from './trait-shop.service';
import { TraitShopController } from './trait-shop.controller';

@Module({
  controllers: [TraitShopController],
  providers: [TraitShopService]
})
export class TraitShopModule {}
