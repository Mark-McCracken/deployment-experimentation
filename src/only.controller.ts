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
            h1 {
                text-align: center;
            }
        </style>
    </head>
    <body>
        <h1>${process.env["HOSTNAME"]}</h1>
    </body>
    `;
  }

  @Get('health')
  healthCheck() {
    return {"status": "ok"};
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
