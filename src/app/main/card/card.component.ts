import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { BigCardService } from '../../services/big-card/big-card.service';

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

  public bigCardService: BigCardService = inject(BigCardService);
}
