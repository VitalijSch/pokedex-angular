import { Component, inject } from '@angular/core';
import { CardComponent } from './card/card.component';
import { ApiService } from '../services/api/api.service';
import { CardService } from '../services/card/card.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CardComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  public apiService: ApiService = inject(ApiService);
  private cardService: CardService = inject(CardService);

  private isLoading: boolean = false;

  /**
  * Handles the scroll event on an element and triggers an action if the user scrolls to the bottom.
  * If the user reaches the bottom of the scrollable element and a Pokémon search is not in progress, 
  * it initiates loading more Pokémon.
  * 
  * @param {any} event - The scroll event object.
  * @returns {Promise<void>} A promise that resolves when the scroll action is processed.
  */
  public async onScroll(event: any): Promise<void> {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (atBottom && !this.cardService.searchPokemon) {
      await this.scrollToBottomAction();
    }
  }

  /**
   * Loads more Pokémon when the user scrolls to the bottom of the list.
   * This method adjusts the range of Pokémon to be loaded and fetches the data.
   * 
   * @returns {Promise<void>} A promise that resolves when additional Pokémon data has been loaded.
   */
  public async scrollToBottomAction(): Promise<void> {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.apiService.startLoad = this.apiService.startLoad + 20;
    this.apiService.endLoad = this.apiService.endLoad + 20;
    await this.apiService.loadPokemon();
    this.isLoading = false;
  }
}