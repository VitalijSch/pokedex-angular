import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../services/card/card.service';

@Component({
  selector: 'app-big-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './big-card.component.html',
  styleUrl: './big-card.component.scss'
})
export class BigCardComponent {
  public cardService: CardService = inject(CardService);

  public pokemon: any = this.cardService.currentPokemon;

  public closeBigCard(): void {
    this.cardService.currentPokemon = undefined;
  }

  public pokemonCrie(id: number): Promise<void> {
    const audioElement = new Audio();
    const crie = (`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`);
    audioElement.src = crie;
    audioElement.volume = 0.1;
    return audioElement.play();
  }
}
