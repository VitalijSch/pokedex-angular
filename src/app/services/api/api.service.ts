import { Injectable } from '@angular/core';
import { Pokemon } from '../../interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public pokemon: Pokemon = {
    id: 0,
    name: '',
    img: '',
    types: {
      firstType: '',
      secondType: '',
    },
    crie: '',
    genera: '',
    height: '',
    weight: '',
    eggGroups: [],
    eggSteps: 0,
    stats: [],
    evolutions: []
  }

  public pokemons: Pokemon[] = [];
  public foundPokemons: Pokemon[] = [];
  private foundPokemonNames: string[] = [];

  public startLoad: number = 0;
  public endLoad: number = 20;

  public loadingPokemon: boolean = true;
  public loadingDescription: boolean = false;

  constructor() {
    this.loadPokemon();
  }

  public async loadPokemon(): Promise<any> {
    this.resetPokemon();
    this.loadingPokemon = true;
    for (let i = this.startLoad; i < this.endLoad; i++) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`);
      const data = await response.json();
      await this.pokemonData(data);
      this.pokemons.push(this.pokemon);
      this.resetPokemon();
    }
    this.loadingPokemon = false;
  }

  private async pokemonData(data: any): Promise<void> {
    this.pokemon.id = data.id;
    await this.loadPokemonName(data.species.url);
    this.pokemon.img = data['sprites']['other']['official-artwork']['front_default'];
    for (let i = 0; i < data.types.length; i++) {
      const types = data.types[i];
      await this.loadPokemonTypes(types.type.url, i);
    }
    this.pokemon.crie = data.cries.latest;
  }

  private async loadPokemonName(url: string): Promise<void> {
    const response = await fetch(url);
    const data = await response.json();
    this.pokemon.name = data.names[5].name;
  }

  private async loadPokemonTypes(url: string, index: number): Promise<void> {
    const response = await fetch(url);
    const data = await response.json();
    if (index === 0) {
      this.pokemon.types.firstType = data.names[4].name
    } else {
      this.pokemon.types.secondType = data.names[4].name
    }
  }

  public async loadPokemonStats(id: number): Promise<void> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    this.pokemon.stats = [];
    for (let i = 0; i < data.stats.length; i++) {
      const statData = {
        name: '',
        stat: data.stats[i].base_stat,
      };
      await this.loadPokemonStatsName(data.stats[i].stat.url, i, statData);
    }
  }

  private async loadPokemonStatsName(url: string, index: number, statData: any): Promise<any> {
    const response = await fetch(url);
    const data = await response.json();
    statData.name = data.names[4].name;
    this.pokemon.stats.push(statData);
  }

  public async loadPokemonData(id: number): Promise<void> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    this.pokemon.height = (data.height / 10).toString().replace('.', ',');
    this.pokemon.weight = (data.weight / 10).toString().replace('.', ',');
    await this.loadMorePokemonData(data.species.url);
  }

  private async loadMorePokemonData(url: string): Promise<void> {
    const response = await fetch(url);
    const data = await response.json();
    this.pokemon.genera = data.genera[4].genus;
    this.pokemon.eggSteps = data.hatch_counter * 256;
    this.pokemon.eggGroups = [];
    for (let i = 0; i < data.egg_groups.length; i++) {
      await this.loadPokemonEggGroups(data.egg_groups[i].url);
    }
  }

  private async loadPokemonEggGroups(url: string): Promise<any> {
    const response = await fetch(url);
    const data = await response.json();
    this.pokemon.eggGroups.push(data.names[4].name);
  }

  public async loadPokemonForEvolution(id: number): Promise<void> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    await this.loadPokemonSpeciesForEvolution(data.species.url);
  }

  private async loadPokemonSpeciesForEvolution(url: string): Promise<void> {
    const response = await fetch(url);
    const data = await response.json();
    this.loadPokemonEvolutions(data.evolution_chain.url);
  }

  private async loadPokemonEvolutions(url: string): Promise<any> {
    const response = await fetch(url);
    const data = await response.json();
    await this.getEvolutionNames(data.chain);
  }

  private async getEvolutionNames(evolution: any) {
    const names = [];
    let currentEvolution = evolution;
    while (currentEvolution) {
      names.push(currentEvolution.species.name);
      currentEvolution = currentEvolution.evolves_to.length > 0 ? currentEvolution.evolves_to[0] : null;
    }
    this.pokemon.evolutions = [];
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      await this.loadPokemonEvolutionsImg(name);
    }
  }

  private async loadPokemonEvolutionsImg(name: string): Promise<any> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    const evolutionData = {
      id: data.id,
      img: data['sprites']['other']['official-artwork']['front_default'],
      name: ''
    };
    await this.loadPokemonNamesAndIdForEvolution(data.species.url, evolutionData);
  }

  private async loadPokemonNamesAndIdForEvolution(url: string, evolutionData: any): Promise<void> {
    const response = await fetch(url);
    const data = await response.json();
    evolutionData.name = data.names[5].name;
    this.pokemon.evolutions.push(evolutionData);
  }

  public async loadAllPokemonNames(name: string): Promise<void> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/?limit=1025}`);
    const data = await response.json();
    this.foundPokemonNames = [];
    for (let i = 0; i < data.results.length; i++) {
      const pokemonName = data.results[i].name;
      if (pokemonName.includes(name)) {
        this.foundPokemonNames.push(pokemonName);
      }
    }
    this.loadFoundPokemons();
  }

  private async loadFoundPokemons(): Promise<any> {
    this.resetPokemon();
    this.loadingPokemon = true;
    this.foundPokemons = [];
    for (let i = 0; i < this.foundPokemonNames.length; i++) {
      const name = this.foundPokemonNames[i];
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      await this.pokemonData(data);
      this.foundPokemons.push(this.pokemon);
      this.resetPokemon();
    }
    this.loadingPokemon = false;
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
      genera: '',
      height: '',
      weight: '',
      eggGroups: [],
      eggSteps: 0,
      stats: [],
      evolutions: []
    }
  }
}