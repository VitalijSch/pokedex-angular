import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../services/card/card.service';
import { ApiService } from '../services/api/api.service';
import { Chart, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement);

@Component({
  selector: 'app-big-card',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './big-card.component.html',
  styleUrl: './big-card.component.scss'
})
export class BigCardComponent {
  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>;

  public cardService: CardService = inject(CardService);
  private apiService: ApiService = inject(ApiService);

  public allEvolutions: any[] = [];

  public pokemon: any = this.cardService.currentPokemon;
  private chartInstance: Chart | undefined;

  ngOnInit(): void {
    this.showPokemonEvolution();
  }

  ngAfterViewInit(): void {
    this.createOrUpdateChart();
  }

  createOrUpdateChart(): void {
    const ctx = this.myChart.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Context not found!');
      return;
    }
    if (this.chartInstance) {
      this.chartInstance.destroy();
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
    this.chartInstance = new Chart(ctx, {
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
    this.apiService.pokemons.forEach((pokemon, index) => {
      if (this.pokemon.id === this.apiService.endLoad) {
        this.cardService.currentPokemon = this.apiService.pokemons[0];
      } else {
        if (pokemon.id === this.pokemon.id) {
          this.cardService.currentPokemon = this.apiService.pokemons[index + 1];
        }
      }
    });
    this.pokemon = this.cardService.currentPokemon;
    if (this.cardService.currentNavigation === 1) {
      this.createOrUpdateChart();
    }
    this.showPokemonEvolution();
  }

  public perviousPokemon(): void {
    this.apiService.pokemons.forEach((pokemon, index) => {
      if (this.pokemon.id === 1) {
        this.cardService.currentPokemon = this.apiService.pokemons[this.apiService.endLoad - 1];
      } else {
        if (pokemon.id === this.pokemon.id) {
          this.cardService.currentPokemon = this.apiService.pokemons[index - 1];
        }
      }
    });
    this.pokemon = this.cardService.currentPokemon;
    if (this.cardService.currentNavigation === 1) {
      this.createOrUpdateChart();
    }
    this.showPokemonEvolution();
  }

  private showPokemonEvolution(): void {
    this.allEvolutions = [];
    this.apiService.allPokemons.forEach(pokemon => {
      if (pokemon.evolution === this.cardService.currentPokemon.evolution) {
        this.allEvolutions.push(pokemon);
      }
    });
    this.sortEvolution();
  }

  private sortEvolution(): void {
    this.allEvolutions.forEach((pokemon, index) => {
      if (pokemon.evolutionFrom === null) {
        this.allEvolutions.splice(index, 1);
        this.allEvolutions.unshift(pokemon);
      }
    });
  }

  public showCurrentStats(): void {
    this.cardService.showCurrentNavigation(1);
    if (this.cardService.currentNavigation === 1) {
      this.createOrUpdateChart();
    }
  }
}
