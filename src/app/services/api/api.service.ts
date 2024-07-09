import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public url = 'https://pokeapi.co/api/v2/pokemon/';

  public pokemonNames: string[] = [];

  public async getPokemon() {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht in Ordnung');
      }
      const data = await response.json();
        this.pokemonNames.push(data);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
    }
  }
}