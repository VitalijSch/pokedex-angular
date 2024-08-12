import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../services/card/card.service';
import { ApiService } from '../services/api/api.service';
import { Chart, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';
import { DataComponent } from './data/data.component';
import { StatsComponent } from './stats/stats.component';
import { EvolutionsComponent } from './evolutions/evolutions.component';

Chart.register(CategoryScale, LinearScale, BarController, BarElement);

@Component({
  selector: 'app-big-card',
  standalone: true,
  imports: [
    CommonModule,
    DataComponent,
    StatsComponent,
    EvolutionsComponent
  ],
  templateUrl: './big-card.component.html',
  styleUrl: './big-card.component.scss'
})
export class BigCardComponent {
  public cardService: CardService = inject(CardService);
  public apiService: ApiService = inject(ApiService);

  public pokemon: any = this.apiService.pokemon;

  /**
    * Closes the big card by triggering the `handleBigCard` method of the `CardService`.
    * @returns {void}
    */
  public closeBigCard(): void {
    this.cardService.handleBigCard();
  }

  /**
   * Plays the cry sound of the current Pokémon.
   * @returns {Promise<void>} A promise that resolves when the audio playback is initiated.
   */
  public pokemonCrie(): Promise<void> {
    const audioElement = new Audio();
    audioElement.src = this.pokemon.crie;
    audioElement.volume = 0.5;
    return audioElement.play();
  }

  /**
   * Selects the next Pokémon in the list and updates the view with the new Pokémon's data.
   * @returns {Promise<void>} A promise that resolves when the Pokémon data has been updated.
   */
  public async nextPokemon(): Promise<void> {
    if(this.apiService.loadingDescription) {
      return;
    }
    let currentArray = this.apiService.foundPokemons.length > 0 ? this.apiService.foundPokemons : this.apiService.pokemons;
    let currentIndex = currentArray.indexOf(this.pokemon);
    this.selectNextPokemon(currentArray, currentIndex);
    this.pokemon = this.apiService.pokemon;
    this.handleChartCreationOrUpdate();
    await this.handlePokemonData();
    await this.handlePokemonStats();
    await this.handlePokemonForEvolution();
  }

  /**
   * Selects the next Pokémon in the array based on the current index.
   * @param {any[]} currentArray - The array of Pokémon.
   * @param {number} currentIndex - The index of the current Pokémon.
   * @returns {void}
   */
  private selectNextPokemon(currentArray: any, currentIndex: number): void {
    currentArray.forEach((pokemon: { id: any; }, index: number) => {
      if (currentIndex === currentArray.length - 1) {
        this.apiService.pokemon = currentArray[0];
      } else {
        if (pokemon.id === this.pokemon.id) {
          this.apiService.pokemon = currentArray[index + 1];
        }
      }
    });
  }

  /**
   * Selects the previous Pokémon in the list and updates the view with the new Pokémon's data.
   * @returns {Promise<void>} A promise that resolves when the Pokémon data has been updated.
   */
  public async previousPokemon(): Promise<void> {
    if(this.apiService.loadingDescription) {
      return;
    }
    let currentArray = this.apiService.foundPokemons.length > 0 ? this.apiService.foundPokemons : this.apiService.pokemons;
    let currentIndex = currentArray.indexOf(this.pokemon);
    this.selectPreviousPokemon(currentArray, currentIndex);
    this.pokemon = this.apiService.pokemon;
    this.handleChartCreationOrUpdate();
    await this.handlePokemonData();
    await this.handlePokemonStats();
    await this.handlePokemonForEvolution();
  }

  /**
   * Selects the previous Pokémon in the array based on the current index.
   * @param {any[]} currentArray - The array of Pokémon.
   * @param {number} currentIndex - The index of the current Pokémon.
   * @returns {void}
   */
  private selectPreviousPokemon(currentArray: any, currentIndex: number): void {
    currentArray.forEach((pokemon: { id: any; }, index: number) => {
      if (currentIndex === 0) {
        this.apiService.pokemon = currentArray[currentArray.length - 1];
      } else {
        if (pokemon.id === this.pokemon.id) {
          this.apiService.pokemon = currentArray[index - 1];
        }
      }
    });
  }

  /**
   * Handles the creation or update of the chart if the current navigation index is 1.
   * @returns {void}
   */
  private handleChartCreationOrUpdate(): void {
    if (this.cardService.currentNavigation === 1) {
      this.apiService.createOrUpdateChart();
    }
  }

  /**
   * Loads and handles Pokémon data if the current navigation index is 0.
   * @returns {Promise<void>} A promise that resolves when the Pokémon data has been loaded.
   */
  private async handlePokemonData(): Promise<void> {
    if (this.cardService.currentNavigation === 0) {
      this.apiService.loadingDescription = true;
      await this.apiService.loadPokemonData(this.pokemon.id);
      this.apiService.loadingDescription = false;
    }
  }

  /**
   * Loads and handles Pokémon stats if the current navigation index is 1, and updates the chart.
   * @returns {Promise<void>} A promise that resolves when the Pokémon stats have been loaded and the chart updated.
   */
  private async handlePokemonStats(): Promise<void> {
    if (this.cardService.currentNavigation === 1) {
      this.apiService.loadingDescription = true;
      await this.apiService.loadPokemonStats(this.pokemon.id);
      this.apiService.createOrUpdateChart();
      this.apiService.loadingDescription = false;
    }
  }

  /**
 * Loads and handles Pokémon evolution data if the current navigation index is 2.
 * @returns {Promise<void>} A promise that resolves when the Pokémon evolution data has been loaded.
 */
  private async handlePokemonForEvolution(): Promise<void> {
    if (this.cardService.currentNavigation === 2) {
      this.apiService.loadingDescription = true;
      await this.apiService.loadPokemonForEvolution(this.pokemon.id);
      setTimeout(() => {
        this.apiService.loadingDescription = false;
      }, 1000);
    }
  }

  /**
   * Displays the Pokémon data by loading it and setting the navigation to the appropriate index.
   * @returns {Promise<void>} A promise that resolves when the Pokémon data has been loaded.
   */
  public async showPokemonData(): Promise<void> {
    this.startLoadingAndShowNavigation(0);
    await this.apiService.loadPokemonData(this.pokemon.id);
    this.apiService.loadingDescription = false;
  }

  /**
   * Displays the Pokémon stats by loading them and setting the navigation to the appropriate index.
   * @returns {Promise<void>} A promise that resolves when the Pokémon stats have been loaded and the chart updated.
   */
  public async showPokemonStats(): Promise<void> {
    this.startLoadingAndShowNavigation(1);
    await this.apiService.loadPokemonStats(this.pokemon.id);
    this.apiService.createOrUpdateChart();
    this.apiService.loadingDescription = false;
  }

  /**
   * Displays the Pokémon evolutions by loading them and setting the navigation to the appropriate index.
   * @returns {Promise<void>} A promise that resolves when the Pokémon evolution data has been loaded.
   */
  public async showPokemonEvolutions(): Promise<void> {
    this.startLoadingAndShowNavigation(2);
    await this.apiService.loadPokemonForEvolution(this.pokemon.id);
    this.apiService.loadingDescription = false;
  }

  /**
   * Starts loading the Pokémon data and shows the current navigation view.
   * @param {number} navigation - The index of the navigation to show.
   * @returns {void}
   */
  private startLoadingAndShowNavigation(navigation: number): void {
    this.apiService.loadingDescription = true;
    this.cardService.showCurrentNavigation(navigation);
  }
}