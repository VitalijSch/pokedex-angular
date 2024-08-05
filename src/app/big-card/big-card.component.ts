import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../services/card/card.service';
import { StatusValuesComponent } from './status-values/status-values.component';
import { ApiService } from '../services/api/api.service';

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
  private apiServcie: ApiService = inject(ApiService);

  public pokemon: any = this.cardService.currentPokemon;

  public closeBigCard(): void {
    this.cardService.handleBigCard();
  }

  public pokemonCrie(): Promise<void> {
    const audioElement = new Audio();
    audioElement.src = this.pokemon.crie;
    audioElement.volume = 0.5;
    return audioElement.play();
  }

  public nextPokemon(): void {
    this.apiServcie.pokemons.forEach((pokemon, index) => {
      if (this.pokemon.id === this.apiServcie.endLoad) {
        this.cardService.currentPokemon = this.apiServcie.pokemons[0];
      } else {
        if (pokemon.id === this.pokemon.id) {
          this.cardService.currentPokemon = this.apiServcie.pokemons[index + 1];
        }
      }
    });
    this.pokemon = this.cardService.currentPokemon;
  }

  public perviousPokemon(): void {
    this.apiServcie.pokemons.forEach((pokemon, index) => {
      if (this.pokemon.id === 1) {
        this.cardService.currentPokemon = this.apiServcie.pokemons[this.apiServcie.endLoad - 1];
      } else {
        if (pokemon.id === this.pokemon.id) {
          this.cardService.currentPokemon = this.apiServcie.pokemons[index - 1];
        }
      }
    });
    this.pokemon = this.cardService.currentPokemon;
  }
}
