import { Test } from '@nestjs/testing';

import { CharacterService } from './character.service';

describe('CharacterService', () => {
  let service: CharacterService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [CharacterService],
    }).compile();

    service = app.get<CharacterService>(CharacterService);
  });
});
