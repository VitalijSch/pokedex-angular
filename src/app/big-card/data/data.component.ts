import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { CardService } from '../../services/card/card.service';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss'
})
export class DataComponent {
@Input() pokemon: any;

  public cardService: CardService = inject(CardService);
}
