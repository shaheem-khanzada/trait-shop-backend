import { Test, TestingModule } from '@nestjs/testing';
import { TraitShopService } from './trait-shop.service';

describe('TraitShopService', () => {
  let service: TraitShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TraitShopService],
    }).compile();

    service = module.get<TraitShopService>(TraitShopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
