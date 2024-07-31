import { Component, inject } from '@angular/core';
import { BigCardService } from '../services/big-card/big-card.service';
import { CommonModule } from '@angular/common';

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
  public bigCardService: BigCardService = inject(BigCardService);

  public pokemon: any = this.bigCardService.currentPokemon;

  public closeBigCard(): void {
    this.bigCardService.currentPokemon = undefined;
  }
}
