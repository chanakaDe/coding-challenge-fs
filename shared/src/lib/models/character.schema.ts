import { z } from 'zod';

export const CharacterSchema = z.object({
  uid: z.string(),
  name: z.string(),
  birth_year: z.string(),
  homeworld: z.string(),
  terrain: z.string(),
});

export type Character = z.infer<typeof CharacterSchema>;
