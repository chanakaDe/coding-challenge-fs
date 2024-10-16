import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CharacterSchema, Character } from '@fullstack/shared';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private readonly http: HttpClient) {}

  private apiUrl = 'http://localhost:3000/api/characters';

  fetchCharacters(page: number, filter: string = ''): Observable<Character[]> {
    return this.http
      .get<any>(`${this.apiUrl}?page=${page}&filter=${filter}`)
      .pipe(
        map((response) => {
          // Validate the character data using Zod schema
          return response.characters.map((character: any) =>
            CharacterSchema.parse(character)
          );
        })
      );
  }
}
