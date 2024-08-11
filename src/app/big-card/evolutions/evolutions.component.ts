import { Component, inject, Input } from '@angular/core';
import { CardService } from '../../services/card/card.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evolutions',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './evolutions.component.html',
  styleUrl: './evolutions.component.scss'
})
export class EvolutionsComponent {
  @Input() pokemon: any;

  public cardService: CardService = inject(CardService);
}
