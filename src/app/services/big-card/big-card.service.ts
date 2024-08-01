import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BigCardService {
  public types: any[] = [
    { 'normal': 'rgb(142,131,103)' },
    { 'fire': 'rgb(205,62,37)' },
    { 'water': 'rgb(27,125,224)' },
    { 'electric': 'rgb(221,163,13)' },
    { 'grass': 'rgb(88,169,49)' },
    { 'ice': 'rgb(29,166,196)' },
    { 'fighting': 'rgb(126,49,27)' },
    { 'poison': 'rgb(141,55,124)' },
    { 'ground': 'rgb(175,135,36)' },
    { 'flying': 'rgb(116,137,221)' },
    { 'psychic': 'rgb(208,63,114)' },
    { 'bug': 'rgb(151,166,20)' },
    { 'rock': 'rgb(179,175,168)' },
    { 'ghost': 'rgb(63,63,150)' },
    { 'dragon': 'rgb(86,57,200)' },
    { 'dark': 'rgb(77,60,48)' },
    { 'steel': 'rgb(133,131,168)' },
    { 'fairy': 'rgb(209,124,209)' }
  ];

  public currentPokemon!: any;
  public currentNavigation: number = 1;

  public saveCurrentPokemon(pokemon: any): void {
    this.currentPokemon = pokemon;
  }

  public getColor(typeName: string): string {
    const type = this.types.find(t => t[typeName]);
    return type ? type[typeName] : '#000';
  }

  public getGradient(types: any[]): string {
    const color1 = this.getColor(types[0].type.name);
    const color2 = this.getColor(types[1].type.name);
    return `linear-gradient(to bottom, ${color1}, ${color2})`;
  }

  public handleZero(pokemonId: number): string {
    if (pokemonId <= 9) {
      return '#000';
    }
    if (pokemonId <= 99) {
      return '#00';
    }
    if (pokemonId <= 999) {
      return '#0';
    }
    return '#';
  }

  public showCurrentNavigation(number: number): void {
    this.currentNavigation = number;
  }
}
