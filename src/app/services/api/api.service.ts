import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public pokemons: any[] = [];
  private pokemonTypes: any[] = [];
  public filteredPokemons: any[] = [];

  public startLoad: number = 0;
  public endLoad: number = 20;
  public loadingPokemon: boolean = true;

  constructor() {
    this.getPokemons();
    this.filteredPokemons = this.pokemons;
  }

  public async getPokemons(): Promise<void> {
    await this.fetchGermanPokemonTypes();
    await this.loadPokemons();
    this.loadingPokemon = false;
  }

  private async fetchGermanPokemonTypes(): Promise<void> {
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

  private async loadPokemons(): Promise<void> {
    for (let i = this.startLoad; i < this.endLoad; i++) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`);
      const data = await response.json();
      this.changeLanguageOfTypes(data);
      data.name = await this.fetchGermanPokemonNames(i);
      this.pokemons.push(data);
    }
  }

  private changeLanguageOfTypes(data: any): void {
    this.pokemonTypes.forEach(type => {
      if (data.types[0].type.name === type.en) {
        data.types[0].type.name = type.de;
      }
      if (data.types[1]) {
        if (data.types[1].type.name === type.en) {
          data.types[1].type.name = type.de;
        }
      }
    })
  }

  private async fetchGermanPokemonNames(i: number): Promise<void> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i + 1}/`);
    const data = await response.json();
    return data.names[5].name;
  }
}