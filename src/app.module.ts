import { Module } from '@nestjs/common';
import { OnlyModule } from './only.module';
import { PromModule } from "@digikare/nestjs-prom";

@Module({
  imports: [
    PromModule.forRoot({
      defaultLabels: {
        app: 'deployment_experiment'
      }
    }),
    OnlyModule
  ]
})
export class AppModule {}