import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../services/card/card.service';
import { StatusValuesComponent } from './status-values/status-values.component';

@Component({
  selector: 'app-big-card',
  standalone: true,
  imports: [
    CommonModule,
    StatusValuesComponent
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

  public pokemonCrie(): Promise<void> {
    const audioElement = new Audio();
    audioElement.src = this.pokemon.crie;
    audioElement.volume = 0.5;
    return audioElement.play();
  }
}
