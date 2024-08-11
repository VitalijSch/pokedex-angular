import { Injectable } from '@angular/core';

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
    { 'Geist': 'rgb(63,63,150)' },
    { 'Drache': 'rgb(86,57,200)' },
    { 'Unlicht': 'rgb(77,60,48)' },
    { 'Stahl': 'rgb(133,131,168)' },
    { 'Fee': 'rgb(209,124,209)' }
  ];

  public isOpen: boolean = false;
  public searchPokemon: boolean = false;
  public currentNavigation: number = 1;

  /**
  * Retrieves the color associated with a given Pokémon type name.
  * 
  * @param {string} typeName - The name of the Pokémon type.
  * @returns {string} The color corresponding to the Pokémon type, or a default color of `#000` if not found.
  */
  public getColor(typeName: string): string {
    const type = this.types.find(t => t[typeName]);
    return type ? type[typeName] : '#000';
  }

  /**
   * Creates a CSS linear gradient string based on the colors of two Pokémon types.
   * 
   * @param {any} types - An object containing the first and second Pokémon types.
   * @returns {string} A linear gradient CSS string from the first type's color to the second type's color.
   */
  public getGradient(types: any): string {
    const color1 = this.getColor(types.firstType);
    const color2 = this.getColor(types.secondType);
    return `linear-gradient(to bottom, ${color1}, ${color2})`;
  }

  /**
   * Determines the prefix to use for a Pokémon ID, returning '#0' for single-digit IDs and '#' otherwise.
   * 
   * @param {number} pokemonId - The ID of the Pokémon.
   * @returns {string} The prefix string based on the Pokémon ID.
   */
  public handleZero(pokemonId: number): string {
    if (pokemonId <= 9) {
      return '#0';
    }
    return '#';
  }

  /**
   * Updates the current navigation index, which determines what part of the UI is displayed.
   * 
   * @param {number} number - The index of the navigation to show.
   * @returns {void}
   */
  public showCurrentNavigation(number: number): void {
    this.currentNavigation = number;
  }

  /**
   * Toggles the visibility of the big card component, opening or closing it.
   * 
   * @returns {void}
   */
  public handleBigCard(): void {
    this.isOpen = !this.isOpen;
  }
}
