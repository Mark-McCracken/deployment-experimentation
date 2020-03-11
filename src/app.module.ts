import { Module } from '@nestjs/common';
import { OnlyController } from './only.controller';

@Module({
  controllers: [OnlyController]
})
export class AppModule {}