/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

/**
 * Bootstrap function to initialize and start the NestJS application.
 */
async function bootstrap() {
  // Create a new NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the application
  app.enableCors();
  
  // Set the global prefix for all routes
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Determine the port to run the server on. No env configured since its a dev repo.
  const port = process.env.PORT || 3000;

  // Start the application and listen on the specified port
  await app.listen(port);

  // Log a message indicating that the application is running
  Logger.log(
    `Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

// Execute the bootstrap function to start the application
bootstrap();
