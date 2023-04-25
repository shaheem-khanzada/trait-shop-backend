import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TraitShopService } from './trait-shop.service';
import { CreateTraitShopDto } from './dto/create-trait-shop.dto';
import { UpdateTraitShopDto } from './dto/update-trait-shop.dto';

@Controller('trait')
export class TraitShopController {
  constructor(private readonly traitShopService: TraitShopService) {}

  @Post('create')
  create(@Body() createTraitShopDto: CreateTraitShopDto) {
    return this.traitShopService.create(createTraitShopDto);
  }

  @Get('walletAddress/:walletAddress')
  findAll(@Param('walletAddress') walletAddress: string) {
    console.log('findAll runs');
    return this.traitShopService.findAll(walletAddress);
  }

  @Get('tokenId/:tokenId')
  findOneByTokenId(@Param('tokenId', ParseIntPipe) tokenId: number) {
    return this.traitShopService.findOneByTokenId(tokenId);
  }

  @Get('id/:id')
  findOneById(@Param('id') id: string) {
    return this.traitShopService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTraitShopDto: UpdateTraitShopDto,
  ) {
    return this.traitShopService.update(id, updateTraitShopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.traitShopService.remove(id);
  }
}
