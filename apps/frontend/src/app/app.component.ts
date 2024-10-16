import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StarWarsCharacterListComponent } from './components/star-wars-character-list/star-wars-character-list.component';

@Component({
  standalone: true,
  imports: [RouterModule, StarWarsCharacterListComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';
}
