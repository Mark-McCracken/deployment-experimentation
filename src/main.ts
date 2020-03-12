import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {start as startTrace} from '@google-cloud/trace-agent';
import {start as startDebug} from '@google-cloud/debug-agent';
import {start as startProfiler} from '@google-cloud/profiler';
import * as morgan from "morgan";
export let tracer;
if (process.env.NODE_ENV === 'production') {
    tracer = startTrace();
    startProfiler();
    startDebug({allowExpressions: true});
} else {
    tracer = {
        createChildSpan: function(object: {name: string}) {} // do nothing.
    }
}

let app;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  app.use(morgan("short"));

  await app.listen(8080);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

process.once('SIGTERM', () => {
    console.info('SIGTERM signal received. Closing server');
    app.close(() => {
        console.info("Server closed.");
    });
});
