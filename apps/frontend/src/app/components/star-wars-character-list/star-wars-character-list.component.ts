import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, Subject } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Character } from '@fullstack/shared';

@Component({
  selector: 'star-wars-character-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-wars-character-list.component.html',
  styleUrls: ['./star-wars-character-list.component.scss'],
})
export class StarWarsCharacterListComponent implements OnInit {
  characters: Character[] = [];
  filter: string = '';
  page: number = 1;
  loading: boolean = false;
  hasMore: boolean = true;

  private readonly filterSubject = new Subject<string>();

  constructor(private readonly characterService: DataService) {
    this.filterSubject.pipe(debounceTime(500)).subscribe((filter) => {
      this.fetchCharacters(filter);
    });
  }

  ngOnInit() {
    this.fetchCharacters();
  }

  fetchCharacters(filter: string = '') {
    this.loading = true;

    this.characterService.fetchCharacters(this.page, filter).subscribe({
      next: (characters: Character[]) => {
        if (characters.length > 0) {
          // Check if the filter is applied
          if (filter) {
            // When searching, replace existing characters
            this.characters = characters;
            this.page = 1; // Reset to the first page
          } else {
            // When clearing the search field, reset page to 1 and fetch the first page of data
            if (this.page === 1) {
              this.characters = characters; // Load first page characters
            } else {
              // When loading more characters (pagination)
              this.characters = [...this.characters, ...characters];
            }
          }
          this.hasMore = characters.length > 0; // Check if there's more data to load
        } else {
          this.hasMore = false; // No more data to load
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  handleFilterChange(event: Event) {
    this.filter = (event.target as HTMLInputElement).value;

    // Reset page and fetch new characters if search field is cleared
    if (!this.filter) {
      this.page = 1; // Reset page for fetching initial characters
    }

    this.filterSubject.next(this.filter); // Emit the new filter value
  }

  loadMore() {
    if (!this.loading && this.hasMore) {
      this.page++;
      this.fetchCharacters(this.filter); // Fetch more characters with the current filter
    }
  }
}
