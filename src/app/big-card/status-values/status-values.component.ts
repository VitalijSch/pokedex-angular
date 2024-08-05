import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { CardService } from '../../services/card/card.service';

@Component({
  selector: 'app-status-values',
  standalone: true,
  imports: [],
  templateUrl: './status-values.component.html',
  styleUrl: './status-values.component.scss'
})
export class StatusValuesComponent {
  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>;

  private cardService: CardService = inject(CardService);

  ngAfterViewInit(): void {
    const ctx = this.myChart.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Context not found!');
      return;
    }

    const data = {
      labels: this.cardService.currentPokemon.stats.map((stat: { name: any; }) => stat.name),
      datasets: [{
        label: 'Pokémon Stats',
        data: this.cardService.currentPokemon.stats.map((stat: { stat: any; }) => stat.stat),
        backgroundColor: this.cardService.currentPokemon.stats.map((stat: { stat: number; }) => stat.stat <= 60 ? 'red' : 'green'),
        borderColor: 'black',
        borderWidth: 1,
      }],
    };

    const progressBar = {
      id: 'progressBar',
      beforeDatasetsDraw(chart: { getDatasetMeta?: any; ctx?: any; data?: any; chartArea?: any; scales?: any; }) {
        const {
          ctx,
          data,
          chartArea: { top, bottom, left, right, width, height },
          scales: { x, y },
        } = chart;

        ctx.save();
        const barHeight = height / data.labels.length;
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
        ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';

        data.labels.forEach((label: any, index: number) => {
          const dataPoint = chart.getDatasetMeta(0).data[index];
          dataPoint.y = top + barHeight * (index + 0.8);

          // Draw label
          ctx.font = '24px sans-serif';
          ctx.fillStyle = 'white';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, left - 200, dataPoint.y);

          // Draw value
          ctx.font = '24px sans-serif';
          ctx.fillStyle = 'rgba(180, 180, 180, 1)';
          ctx.textBaseline = 'middle';
          ctx.fillText(data.datasets[0].data[index], left + 70, dataPoint.y);
        });
      },
    };

    new Chart(ctx, {
      type: 'bar',
      data,
      options: {
        layout: {
          padding: { left: 200 },
        },
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: { display: false },
            min: -150,
            max: 255,

          },
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: { display: false },
          },
        },
      },
      plugins: [progressBar],
    });
  }
}
