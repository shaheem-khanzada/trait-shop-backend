import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TraitShopModule } from './trait-shop/trait-shop.module';

@Module({
  imports: [TraitShopModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
