import { Test, TestingModule } from '@nestjs/testing';

import { CharacterController } from './character.controller';
import { CharacterService } from '../services/character.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [CharacterController],
      providers: [CharacterService],
    }).compile();
  });
});
