import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BigCardService {
  public types: any[] = [
    { 'normal': '#ACAD99' },
    { 'fire': '#E87A3D' },
    { 'water': '#639CE4' },
    { 'electric': '#E7C536' },
    { 'grass': '#82C95B' },
    { 'ice': '#81CFD7' },
    { 'fighting': '#C45D4C' },
    { 'poison': '#B369AF' },
    { 'ground': '#CEB250' },
    { 'flying': '#90AAD7' },
    { 'psychic': '#E96C95' },
    { 'bug': '#ACC23E' },
    { 'rock': '#BAA85E' },
    { 'ghost': '#816DB6' },
    { 'dragon': '#8572C8' },
    { 'dark': '#79726B' },
    { 'steel': '#9FA9AF' },
    { 'fairy': '#E8B0EB' }
  ];

  public currentPokemon!: any;

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
}
