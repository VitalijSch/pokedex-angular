import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api/api.service';
import { CardService } from '../services/card/card.service';

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
  public apiService: ApiService = inject(ApiService);
  public cardService: CardService = inject(CardService);

  @ViewChild('searchInput') searchInput!: ElementRef;

  public search: string = '';

  ngAfterViewChecked() {
    if (!this.apiService.loadingPokemon) {
      this.searchInput.nativeElement.focus();
    }
  }

/**
 * Asynchronously searches for Pokémon names if the search input is at least 3 characters long.
 * - If the search input meets the length criteria, it sets the search input in the API service,
 *   marks the `searchPokemon` flag as true in the card service, and loads all Pokémon names that
 *   match the search input.
 * 
 * @returns {Promise<void>} A promise that resolves when the search operation is complete.
 */
public async searchPokemon(): Promise<void> {
  if (this.search.length >= 3) {
      this.apiService.setSearchInput(this.search);
      this.cardService.searchPokemon = true;
      await this.apiService.loadAllPokemonNames(this.search.toLowerCase());
  }
}

/**
* Resets the Pokémon search if the search input is less than 3 characters long.
* - If the search input length is less than 3, it sets the `searchPokemon` flag to false
*   in the card service, clears the list of found Pokémon in the API service, and resets
*   the search input.
*/
public resetSearchPokemon(): void {
  if (this.search.length < 3) {
      this.cardService.searchPokemon = false;
      this.apiService.foundPokemons = [];
      this.apiService.search = '';
  }
}
}