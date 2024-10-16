import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { CharacterController } from './controller/character.controller';
import { CharacterService } from './services/character.service';
import { CacheModule } from '@nestjs/cache-manager';

/**
 * Main application module that configures and organizes the application's components.
 */
@Module({
  imports: [
    // Configure the cache module for the application
    CacheModule.register({
      ttl: 0, // Time to live for cache items (0 means no expiration)
      max: 100, // Maximum number of items in cache
    }),
    // Import HttpModule for making HTTP requests
    HttpModule,
  ],
  controllers: [CharacterController], // Register the CharacterController
  providers: [CharacterService], // Register the CharacterService as a provider
})
export class AppModule {}


