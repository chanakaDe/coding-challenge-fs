import {
  Injectable,
  Inject,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Character } from '@fullstack/shared';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

/**
 * Service responsible for fetching and caching Star Wars character data.
 * Not using .env due to the development env of the project.
 */
@Injectable()
export class CharacterService {
  private readonly logger = new Logger(CharacterService.name);
  private readonly baseUrl = 'https://www.swapi.tech/api';

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  /**
   * Fetches detailed information for a specific character.
   * Attempts to retrieve from cache first, then falls back to API call.
   * @param uid - Unique identifier for the character.
   * @returns Promise resolving to Character object.
   */
  private async getCharacterDetails(uid: string): Promise<Character> {
    const cacheKey = `character_${uid}`;
    this.logger.log(
      `Attempting to get character from cache with key: ${cacheKey}`
    );

    // Try to retrieve the character from cache
    const cachedCharacter = await this.cacheManager.get<Character>(cacheKey);
    if (cachedCharacter) {
      this.logger.log(`Cache hit for character ${uid}`);
      return cachedCharacter;
    }

    this.logger.warn(`Cache miss for character ${uid}`);

    // Fetch character from SWAPI
    try {
      const personDetails = await lastValueFrom(
        this.httpService
          .get(`${this.baseUrl}/people/${uid}`)
          .pipe(map((response) => response.data.result.properties))
      );

      const homeworldDetails = personDetails.homeworld
        ? await lastValueFrom(
            this.httpService
              .get(personDetails.homeworld)
              .pipe(map((response) => response.data.result.properties))
          )
        : { name: 'Unknown', terrain: 'Unknown' };

      const character: Character = {
        uid,
        name: personDetails.name,
        birth_year: personDetails.birth_year,
        homeworld: homeworldDetails.name,
        terrain: homeworldDetails.terrain,
      };

      // Cache the character for 10 minutes (600 seconds)
      await this.cacheManager.set(cacheKey, character, 600);
      this.logger.log(`Character ${uid} cached successfully.`);
      return character;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch character details for ${uid}: ${error.message}`,
        error.stack
      );
      throw new HttpException(
        'Failed to fetch character details',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Retrieves Star Wars characters with optional filtering and pagination.
   * @param page - Page number for pagination.
   * @param name - Optional name filter for character search.
   * @returns Promise resolving to object containing characters array and total pages.
   */
  async getStarWarsCharacters(
    page: number,
    name?: string
  ): Promise<{ characters: Character[]; total_pages: number }> {
    try {
      if (name) {
        return this.searchCharactersByName(name);
      } else {
        return this.fetchCharactersWithPagination(page);
      }
    } catch (error: any) {
      this.logger.error(
        'Failed to fetch Star Wars characters: ' + error.message,
        error.stack
      );
      throw new HttpException(
        'Failed to fetch Star Wars characters',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Searches for characters by name.
   * @param name - Name or partial name to search for.
   * @returns Promise resolving to object containing matching characters and total pages.
   */
  private async searchCharactersByName(
    name: string
  ): Promise<{ characters: Character[]; total_pages: number }> {
    const searchUrl = `${this.baseUrl}/people/?name=${name}`;
    const searchResponse = await lastValueFrom(
      this.httpService.get(searchUrl).pipe(map((response) => response.data))
    );

    const results = searchResponse.result;
    if (Array.isArray(results) && results.length > 0) {
      const detailedCharacters = await Promise.all(
        results.map((person: any) => this.getCharacterDetails(person.uid))
      );
      return { characters: detailedCharacters, total_pages: 1 };
    } else {
      return { characters: [], total_pages: 0 };
    }
  }

  /**
   * Fetches a paginated list of characters.
   * Attempts to retrieve from cache first, then falls back to API call.
   * @param page - Page number to fetch.
   * @returns Promise resolving to object containing characters for the page and total pages.
   */
  private async fetchCharactersWithPagination(
    page: number
  ): Promise<{ characters: Character[]; total_pages: number }> {
    const cacheKey = `characters_page_${page}`;
    this.logger.log(
      `Attempting to get characters from cache with key: ${cacheKey}`
    );

    const cachedCharacters = await this.cacheManager.get<{
      characters: Character[];
      total_pages: number;
    }>(cacheKey);
    if (cachedCharacters) {
      this.logger.log(`Cache hit for page ${page}`);
      return cachedCharacters;
    }

    this.logger.warn(`Cache miss for page ${page}`);
    const peopleUrl = `${this.baseUrl}/people?page=${page}&limit=10`;
    const peopleResponse = await lastValueFrom(
      this.httpService.get(peopleUrl).pipe(map((response) => response.data))
    );

    const { results, total_pages } = peopleResponse;
    if (Array.isArray(results)) {
      const detailedCharacters = await Promise.all(
        results.map((person: any) => this.getCharacterDetails(person.uid))
      );
      const response = { characters: detailedCharacters, total_pages };

      // Cache the result for this page indefinitely
      await this.cacheManager.set(cacheKey, response, 0);
      this.logger.log(`Page ${page} cached successfully.`);
      return response;
    } else {
      return { characters: [], total_pages: 0 };
    }
  }
}
