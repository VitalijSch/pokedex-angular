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

  public async openBigCard(): Promise<void> {
    this.cardService.handleBigCard();
    this.apiService.pokemon = this.pokemon;
    if (this.cardService.currentNavigation === 0) {
      this.apiService.loadingDescription = true;
      await this.apiService.loadPokemonData(this.pokemon.id);
      this.apiService.loadingDescription = false;
    }
    if (this.cardService.currentNavigation === 1) {
      this.apiService.loadingDescription = true;
      await this.apiService.loadPokemonStats(this.pokemon.id);
      this.apiService.loadingDescription = false;
    }
    if (this.cardService.currentNavigation === 2) {
      this.apiService.loadingDescription = true;
      await this.apiService.loadPokemonForEvolution(this.pokemon.id);
      this.apiService.loadingDescription = false;
    }
  }
}
