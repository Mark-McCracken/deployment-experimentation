import { Body, Controller, Get, Param, Post, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { InjectHistogramMetric, HistogramMetric } from '@digikare/nestjs-prom';

@Controller()
export class OnlyController {
  pageColor: string;

  constructor(@InjectHistogramMetric('latency') private readonly latencyHistogram,
              @InjectHistogramMetric('error_rate') private readonly errorRateHistogram) {
      const colors = ["red", "blue", "green", "dodgerblue", "pink", "yellow", "orange"];
      this.pageColor = colors[Math.floor(Math.sqrt(parseFloat(process.env["randomColorFloat"]) * Math.random()) * colors.length)]
  }

  wait(ms: number): Promise<void> {
    this.latencyHistogram.observe(ms);
    return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
    });
  }

  @Get()
  async homepage() {
    return `
    <!DOCTYPE html>
    <head>
        <style>
            body {
                background-color: ${this.pageColor}
            }
            h1, h2 {
                text-align: center;
            }
        </style>
    </head>
    <body>
        <h1>Host: ${process.env["HOSTNAME"]}</h1>
        <h2>Version: ${process.env["version"]}</h2>
        <h2>Environment Type: ${process.env["ENVIRONMENT_TYPE"]}</h2>
    </body>
    `;
  }

  @Get('health')
  healthCheck() {
    return {"status": "ok"};
  }

  @Get('version')
  version() {
    return {
      hostname: process.env["HOSTNAME"],
      version: process.env["version"],
      randomColorFloat: parseInt(process.env["randomColorFloat"]),
      randomColor: this.pageColor,
      envType: process.env["ENVIRONMENT_TYPE"],
      errorRate: parseInt(process.env["errorrate"]),
      latency: parseInt(process.env["latency"])
    }
  }

  @Get('latency')
  async getLatencyEndpoint() {
    const staticLatency: number = parseInt(process.env["latency"]);
    const realLatency: number = Math.floor(staticLatency * 3 * Math.sqrt(Math.random()));
    await this.wait(realLatency);
    return { status: "ok", staticLatency, realLatency };
  }

  @Get('errors')
  getErrorsEndpoint() {
   const errorRate = parseFloat(process.env["errorrate"]);
   const successful = Math.random() > errorRate;
   if (!successful) {
     this.errorRateHistogram.observe(1);
     throw new InternalServerErrorException("Unlucky, punk");
   }
   this.errorRateHistogram.observe(0);
   return {"status": "ok"};
  }

}
