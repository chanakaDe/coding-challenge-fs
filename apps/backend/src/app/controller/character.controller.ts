import { Controller, Get, Query } from '@nestjs/common';

import { CharacterService } from '../services/character.service';
import { Character } from '@fullstack/shared';

/**
 * Controller responsible for handling Star Wars character-related HTTP requests.
 */
@Controller()
export class CharacterController {
  /**
   * Initializes the CharacterController with the CharacterService dependency.
   * @param characterService - The service responsible for character-related operations.
   */
  constructor(private readonly characterService: CharacterService) {}

  /**
   * Handles GET requests to fetch Star Wars characters.
   * @param page - The page number for pagination (optional).
   * @param name - The name filter for character search (optional).
   * @returns A promise that resolves to an object containing an array of characters and the total number of pages.
   */
  @Get('characters')
  async getStarWarsCharacters(
    @Query('page') page: number,
    @Query('filter') name: string
  ): Promise<{ characters: Character[]; total_pages: number }> {
    return this.characterService.getStarWarsCharacters(page, name);
  }
}
