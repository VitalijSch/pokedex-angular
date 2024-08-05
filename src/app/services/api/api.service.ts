import { Injectable } from '@angular/core';
import { Pokemon } from '../../interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public pokemons: any[] = [];
  public filteredPokemons: any[] = [];
  private pokemonTypes: any[] = [];
  private pokemonStats: any[] = [];

  public pokemon: Pokemon = {
    id: 0,
    name: '',
    img: '',
    types: {
      firstType: '',
      secondType: '',
    },
    crie: '',
    stats: [],
  }

  public startLoad: number = 0;
  public endLoad: number = 20;
  public loadingPokemon: boolean = true;

  constructor() {
    this.getPokemons();
    this.filteredPokemons = this.pokemons;
  }

  public async getPokemons(): Promise<void> {
    await this.fetchPokemonTypes();
    await this.fetchPokemonStats();
    await this.loadPokemons();
  }

  private async fetchPokemonTypes(): Promise<void> {
    for (let i = 0; i < 18; i++) {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${i + 1}/`);
      const data = await response.json();
      this.pokemonTypes.push(
        {
          "de": data.names[4].name,
          "en": data.name
        }
      );
    }
  }

  private async fetchPokemonStats(): Promise<void> {
    for (let i = 0; i < 8; i++) {
      const response = await fetch(`https://pokeapi.co/api/v2/stat/${i + 1}/`);
      const data = await response.json();
      this.pokemonStats.push(
        {
          "de": data.names[4].name,
          "en": data.name
        }
      );
    }
  }

  public async loadPokemons(): Promise<void> {
    this.loadingPokemon = true;
    for (let i = this.startLoad; i < this.endLoad; i++) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`);
      const data = await response.json();
      this.savePokemonData(data);
      await this.fetchGermanPokemonNames(i);
      this.saveTypes(data);
      this.saveStats(data);
      this.pokemons.push(this.pokemon);
      this.resetPokemon();
    }
    this.loadingPokemon = false;
    console.log(this.pokemons)
  }

  private savePokemonData(data: any): void {
    this.pokemon.id = data.id;
    this.pokemon.img = data['sprites']['other']['official-artwork']['front_default'];
    this.pokemon.crie = data.cries.latest;
  }

  private async fetchGermanPokemonNames(i: number): Promise<void> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i + 1}/`);
    const data = await response.json();
    this.pokemon.name = data.names[5].name;
  }

  private saveTypes(data: any): void {
    this.pokemonTypes.forEach(type => {
      if (data.types[0].type.name === type.en) {
        this.pokemon.types.firstType = type.de;
      }
      if (data.types[1]) {
        if (data.types[1].type.name === type.en) {
          if (this.pokemon.types.secondType !== undefined) {
            this.pokemon.types.secondType = type.de;
          }
        }
      }
    })
  }

  private saveStats(data: any): void {
    this.pokemonStats.forEach(stat => {
      data.stats.forEach((pokeStat: { [x: string]: any; stat: { name: any; }; }) => {
        if (pokeStat.stat.name === stat.en) {
          let baseStat = {
            name: stat.de,
            stat: pokeStat['base_stat']
          }
          this.pokemon.stats.push(baseStat);
        }
      })
    })
  }

  private resetPokemon(): void {
    this.pokemon = {
      id: 0,
      name: '',
      img: '',
      types: {
        firstType: '',
        secondType: '',
      },
      crie: '',
      stats: [],
    }
  }
}