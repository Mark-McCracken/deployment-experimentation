import { Body, Controller, Get, Param, Post, UseGuards, InternalServerErrorException } from '@nestjs/common';

function wait(ms: number): Promise<void> {
  return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
  });
}

@Controller()
export class OnlyController {
  pageColor: string;

  constructor() {
      const colors = ["red", "blue", "green", "dodgerblue", "pink", "yellow", "orange"];
      this.pageColor = colors[Math.floor(Math.sqrt(parseFloat(process.env["randomColorFloat"]) * Math.random()) * colors.length)]
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
    await wait(parseInt(process.env["latency"]) * 3 * Math.sqrt(Math.random()));
    return {"status": "ok"};
  }

  @Get('errors')
  getErrorsEndpoint() {
   const errorRate = parseFloat(process.env["errorrate"]);
   const successful = Math.random() > errorRate;
   if (!successful) throw new InternalServerErrorException("Unlucky, punk");
   return {"status": "ok"};
  }

}
