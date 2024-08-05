import { Injectable } from '@angular/core';
import { Pokemon } from '../../interfaces/pokemon';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  public types: any[] = [
    { 'Normal': 'rgb(142,131,103)' },
    { 'Feuer': 'rgb(205,62,37)' },
    { 'Wasser': 'rgb(27,125,224)' },
    { 'Elektro': 'rgb(221,163,13)' },
    { 'Pflanze': 'rgb(88,169,49)' },
    { 'Eis': 'rgb(29,166,196)' },
    { 'Kampf': 'rgb(126,49,27)' },
    { 'Gift': 'rgb(141,55,124)' },
    { 'Boden': 'rgb(175,135,36)' },
    { 'Flug': 'rgb(116,137,221)' },
    { 'Psycho': 'rgb(208,63,114)' },
    { 'Käfer': 'rgb(151,166,20)' },
    { 'Gestein': 'rgb(179,175,168)' },
    { 'Gespenst': 'rgb(63,63,150)' },
    { 'Drache': 'rgb(86,57,200)' },
    { 'Unlicht': 'rgb(77,60,48)' },
    { 'Stahl': 'rgb(133,131,168)' },
    { 'Fee': 'rgb(209,124,209)' }
  ];

  public currentPokemon!: Pokemon;
  public isOpen: boolean = false;
  public currentNavigation: number = 1;

  public getColor(typeName: string): string {
    const type = this.types.find(t => t[typeName]);
    return type ? type[typeName] : '#000';
  }

  public getGradient(types: any): string {
    const color1 = this.getColor(types.firstType);
    const color2 = this.getColor(types.secondType);
    return `linear-gradient(to bottom, ${color1}, ${color2})`;
  }

  public handleZero(pokemonId: number): string {
    if (pokemonId <= 9) {
      return '#0';
    }
    return '#';
  }

  public showCurrentNavigation(number: number): void {
    this.currentNavigation = number;
  }

  public handleBigCard(): void {
    this.isOpen = !this.isOpen;
  }
}
