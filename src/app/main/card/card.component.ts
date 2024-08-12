import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { CardService } from '../../services/card/card.service';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() pokemon!: any;

  public cardService: CardService = inject(CardService);
  private apiService: ApiService = inject(ApiService);

  /**
  * Opens the big card view for the selected Pokémon.
  * It triggers the display of Pokémon data, stats, and evolutions by calling the relevant methods.
  * 
  * @returns {Promise<void>} A promise that resolves when the big card is opened and the Pokémon details are displayed.
  */
  public async openBigCard(): Promise<void> {
    document.body.style.overflowY = 'hidden';
    this.cardService.handleBigCard();
    this.apiService.pokemon = this.pokemon;
    this.showPokemonData();
    this.showPokemonStats();
    this.showPokemonEvolutions();
  }

  /**
   * Loads and displays the current Pokémon's data if the navigation index is set to 0.
   * 
   * @returns {Promise<void>} A promise that resolves when the Pokémon data has been loaded.
   */
  private async showPokemonData(): Promise<void> {
    if (this.cardService.currentNavigation === 0) {
      this.apiService.loadingDescription = true;
      await this.apiService.loadPokemonData(this.pokemon.id);
      this.apiService.loadingDescription = false;
    }
  }

  /**
   * Loads and displays the current Pokémon's stats if the navigation index is set to 1.
   * It also creates or updates the relevant chart.
   * 
   * @returns {Promise<void>} A promise that resolves when the Pokémon stats have been loaded and the chart updated.
   */
  private async showPokemonStats(): Promise<void> {
    if (this.cardService.currentNavigation === 1) {
      this.apiService.loadingDescription = true;
      await this.apiService.loadPokemonStats(this.pokemon.id);
      this.apiService.createOrUpdateChart();
      this.apiService.loadingDescription = false;
    }
  }

  /**
   * Loads and displays the current Pokémon's evolution data if the navigation index is set to 2.
   * 
   * @returns {Promise<void>} A promise that resolves when the Pokémon evolution data has been loaded.
   */
  private async showPokemonEvolutions(): Promise<void> {
    if (this.cardService.currentNavigation === 2) {
      this.apiService.loadingDescription = true;
      await this.apiService.loadPokemonForEvolution(this.pokemon.id);
      this.apiService.loadingDescription = false;
    }
  }
}