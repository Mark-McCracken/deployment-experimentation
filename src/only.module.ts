import { Module } from '@nestjs/common';
import { OnlyController } from './only.controller';
import { PromModule, MetricType } from "@digikare/nestjs-prom";

@Module({
  imports: [
    PromModule.forMetrics([
        {
            type: MetricType.Histogram,
            configuration: {
                name: 'latency',
                help: 'latency only for /latency endpoint'
            }
        },
        {
            type: MetricType.Histogram,
            configuration: {
                name: 'error_rate',
                help: 'error rate only for /errors endpoint'
            }
        }
    ])
  ],
  controllers: [OnlyController]
})
export class OnlyModule {}
