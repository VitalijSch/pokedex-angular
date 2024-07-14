import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public pokemons: any[] = [];
  public filteredPokemons: any[] = [];

  public startLoad: number = 0;
  public endLoad: number = 20;

  constructor() {
    this.getPokemons();
    this.filteredPokemons = this.pokemons;
  }

  public async getPokemons(): Promise<void> {
    if (this.endLoad >= 1025) {
      this.endLoad = 1025;
    }
    for (let i = this.startLoad; i < this.endLoad; i++) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`);
      const data = await response.json();
      this.pokemons.push(data);
    }
  }
}