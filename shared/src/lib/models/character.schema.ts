import { z } from 'zod';

// Define the schema for a Star Wars character
export const CharacterSchema = z.object({
  // Unique identifier for the character
  uid: z.string(),
  // Name of the character
  name: z.string(),
  // Birth year of the character 
  birth_year: z.string(),
  // Name of the character's home planet
  homeworld: z.string(),
  // Terrain type which is the Aggregated value of the character's homeworld
  terrain: z.string(),
});

// Create a TypeScript type based on the CharacterSchema which can be accessed in the project.
export type Character = z.infer<typeof CharacterSchema>;
