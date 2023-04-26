import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { TraitShopService } from './trait-shop.service';
import { CreateTraitShopDto } from './dto/create-trait-shop.dto';
import { UpdateTraitShopDto } from './dto/update-trait-shop.dto';
import { BuyTraitDto } from './dto/buy-trait.dto';

@Controller('trait')
@ApiTags('Traits')
export class TraitShopController {
  constructor(private readonly traitShopService: TraitShopService) {}

  @ApiBody({ type: CreateTraitShopDto, description: 'Create Trait' })
  @Post('create')
  createTrait(@Body() createTraitShopDto: CreateTraitShopDto) {
    return this.traitShopService.create(createTraitShopDto);
  }

  @ApiBody({
    type: BuyTraitDto,
    description:
      'Buy traits and save sell record to db so we can how user traits',
  })
  @Post('buy')
  buyTrait(@Body() buyBody: BuyTraitDto) {
    return this.traitShopService.buyTrait(buyBody);
  }

  @ApiBody({
    description:
      'Use to fetch all traits and also pass walletAddress to check if user is whitelisted or not, if whitelisted is empty it will show to all user',
  })
  @Get('all')
  findAllTraits(@Query('walletAddress') walletAddress: string) {
    return this.traitShopService.findAll(walletAddress);
  }

  @Get('user')
  findUserTraits(@Query('walletAddress') walletAddress: string) {
    return this.traitShopService.fetchAllTraitsOwnByUser(walletAddress);
  }

  @ApiBody({
    description: 'Use to fetch trait by tokenId',
  })
  @Get('tokenId/:tokenId')
  findOneTraitByTokenId(@Param('tokenId', ParseIntPipe) tokenId: number) {
    return this.traitShopService.findOneByTokenId(tokenId);
  }

  @ApiBody({
    description: 'Use to fetch trait by _id',
  })
  @Get('id/:id')
  findOneTraitById(@Param('id') id: string) {
    return this.traitShopService.findOneById(id);
  }

  @ApiBody({
    description: 'Use to get off-chain and on-chain count of nft by tokenId',
  })
  @Get('count/:tokenId')
  findTokenMintCount(@Param('tokenId') tokenId: number) {
    return this.traitShopService.getCountByTokenId(tokenId);
  }

  @ApiBody({
    type: UpdateTraitShopDto,
    description: 'Use to update the trait by id',
  })
  @Patch('id/:id')
  updateTrait(
    @Param('id') id: string,
    @Body() updateTraitShopDto: UpdateTraitShopDto,
  ) {
    return this.traitShopService.update(id, updateTraitShopDto);
  }

  @ApiBody({
    description: 'List of whitelisted address to update must be array',
    type: [String],
  })
  @Patch('whitelisted/:id')
  updateTraitWhitelisted(
    @Param('id') id: string,
    @Body() whitelisted: string[],
  ) {
    return this.traitShopService.updateWhitelisted(id, whitelisted);
  }

  @ApiBody({
    description: 'Use to delete trait by id',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.traitShopService.remove(id);
  }
}
