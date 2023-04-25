import { Test, TestingModule } from '@nestjs/testing';
import { TraitShopController } from './trait-shop.controller';
import { TraitShopService } from './trait-shop.service';

describe('TraitShopController', () => {
  let controller: TraitShopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TraitShopController],
      providers: [TraitShopService],
    }).compile();

    controller = module.get<TraitShopController>(TraitShopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
