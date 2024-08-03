import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { CardService } from '../../services/card/card.service';

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
}
