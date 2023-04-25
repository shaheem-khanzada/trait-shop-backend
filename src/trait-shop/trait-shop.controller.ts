import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TraitShopService } from './trait-shop.service';
import { CreateTraitShopDto } from './dto/create-trait-shop.dto';
import { UpdateTraitShopDto } from './dto/update-trait-shop.dto';

@Controller('trait-shop')
export class TraitShopController {
  constructor(private readonly traitShopService: TraitShopService) {}

  @Post()
  create(@Body() createTraitShopDto: CreateTraitShopDto) {
    return this.traitShopService.create(createTraitShopDto);
  }

  @Get()
  findAll() {
    return this.traitShopService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.traitShopService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTraitShopDto: UpdateTraitShopDto,
  ) {
    return this.traitShopService.update(+id, updateTraitShopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.traitShopService.remove(+id);
  }
}
