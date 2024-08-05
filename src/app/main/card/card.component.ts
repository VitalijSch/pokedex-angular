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

  public openBigCard(): void {
    this.cardService.handleBigCard();
    this.cardService.currentPokemon = this.pokemon;
  }
}
