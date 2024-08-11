import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CardService } from '../../services/card/card.service';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {
  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>;

  public cardService: CardService = inject(CardService);
  public apiService: ApiService = inject(ApiService);

  ngAfterViewInit() {
    this.apiService.setChart(this.myChart);
  }
}
