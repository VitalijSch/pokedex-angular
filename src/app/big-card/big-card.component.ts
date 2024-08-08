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
  public apiService: ApiService = inject(ApiService);

  public pokemon: any = this.apiService.pokemon;
  private chartInstance: Chart | undefined;

  ngOnInit(): void {
 
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
      labels: this.pokemon.stats.map((stat: { name: any; }) => stat.name),
      datasets: [{
        label: 'Pokémon Stats',
        data: this.pokemon.stats.map((stat: { stat: any; }) => stat.stat),
        backgroundColor: this.pokemon.stats.map((stat: { stat: number; }) => stat.stat <= 60 ? '#5cc0de' : '#5db85b'),
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

  public async nextPokemon(): Promise<void> {
    let currentIndex = this.apiService.pokemons.indexOf(this.pokemon);
    this.apiService.pokemons.forEach((pokemon, index) => {
      if (currentIndex === this.apiService.pokemons.length - 1) {
        this.apiService.pokemon = this.apiService.pokemons[0];
      } else {
        if (pokemon.id === this.pokemon.id) {
          this.apiService.pokemon = this.apiService.pokemons[index + 1];
        }
      }
    });
    this.pokemon = this.apiService.pokemon;
    if (this.cardService.currentNavigation === 1) {
      this.createOrUpdateChart();
    }
    if (this.cardService.currentNavigation === 0) {
      this.apiService.loadingDescription = true;
      await this.apiService.loadPokemonData(this.pokemon.id);
      this.apiService.loadingDescription = false;
    }
    if (this.cardService.currentNavigation === 1) {
      this.apiService.loadingDescription = true;
      await this.apiService.loadPokemonStats(this.pokemon.id);
      this.createOrUpdateChart();
      this.apiService.loadingDescription = false;
    }
    if (this.cardService.currentNavigation === 2) {
      this.apiService.loadingDescription = true;
      await this.apiService.loadPokemonForEvolution(this.pokemon.id);
      this.apiService.loadingDescription = false;
    }
  }

  public async perviousPokemon(): Promise<void> {
    let currentIndex = this.apiService.pokemons.indexOf(this.pokemon);
    this.apiService.pokemons.forEach((pokemon, index) => {
      if (currentIndex === 0) {
        this.apiService.pokemon = this.apiService.pokemons[this.apiService.pokemons.length - 1];
      } else {
        if (pokemon.id === this.pokemon.id) {
          this.apiService.pokemon = this.apiService.pokemons[index - 1];
        }
      }
    });
    this.pokemon = this.apiService.pokemon;
    if (this.cardService.currentNavigation === 1) {
      this.createOrUpdateChart();
    }
    if (this.cardService.currentNavigation === 0) {
      this.apiService.loadingDescription = true;
      await this.apiService.loadPokemonData(this.pokemon.id);
      this.apiService.loadingDescription = false;
    }
    if (this.cardService.currentNavigation === 1) {
      this.apiService.loadingDescription = true;
      await this.apiService.loadPokemonStats(this.pokemon.id);
      this.createOrUpdateChart();
      this.apiService.loadingDescription = false;
    }
    if (this.cardService.currentNavigation === 2) {
      this.apiService.loadingDescription = true;
      await this.apiService.loadPokemonForEvolution(this.pokemon.id);
      this.apiService.loadingDescription = false;
    }
  }

  public async showPokemonData(): Promise<void> {
    this.apiService.loadingDescription = true;
    this.cardService.showCurrentNavigation(0);
    await this.apiService.loadPokemonData(this.pokemon.id);
    this.apiService.loadingDescription = false;
  }

  public async showPokemonStats(): Promise<void> {
    this.apiService.loadingDescription = true;
    this.cardService.showCurrentNavigation(1);
    await this.apiService.loadPokemonStats(this.pokemon.id);
    this.createOrUpdateChart();
    this.apiService.loadingDescription = false;
  }

  public async showPokemonEvolutions(): Promise<void> {
    this.apiService.loadingDescription = true;
    this.cardService.showCurrentNavigation(2);
    await this.apiService.loadPokemonForEvolution(this.pokemon.id);
    this.apiService.loadingDescription = false;
  }
}
