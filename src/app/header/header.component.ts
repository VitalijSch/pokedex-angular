import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private apiService: ApiService = inject(ApiService);

  public search: string = '';

  public searchPokemon(): void {
    if (this.search.length >= 3) {
      this.apiService.filteredPokemons = [];
      this.apiService.pokemons.forEach(pokemon => {
        if (pokemon.name.startsWith(this.search)) {
          this.apiService.filteredPokemons.push(pokemon);
        }
      });
    } else {
      this.apiService.filteredPokemons = [];
      this.apiService.filteredPokemons = this.apiService.pokemons;
    }
  }
}