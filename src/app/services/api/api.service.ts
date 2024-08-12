import { ElementRef, Injectable } from '@angular/core';
import { Pokemon } from '../../interfaces/pokemon';
import { Chart } from 'chart.js';

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
  public search: string = '';

  public loadingPokemon: boolean = true;
  public loadingDescription: boolean = false;

  private chart!: ElementRef<HTMLCanvasElement>;
  private chartInstance: Chart | undefined;

  constructor() {
    this.loadPokemon();
  }

  /**
  * Loads a range of Pokémon data by fetching details from the PokéAPI.
  * The range is determined by `startLoad` and `endLoad` properties.
  * Resets the Pokémon data before starting the load process and updates the `pokemons` array.
  * 
  * @returns {Promise<any>} A promise that resolves when all Pokémon in the range have been loaded.
  */
  public async loadPokemon(): Promise<any> {
    this.resetPokemon();
    this.loadingPokemon = true;
    document.body.style.overflowY = 'hidden';
    for (let i = this.startLoad; i < this.endLoad; i++) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`);
      const data = await response.json();
      await this.pokemonData(data);
      this.pokemons.push(this.pokemon);
      this.resetPokemon();
    }
    this.loadingPokemon = false;
  }

  /**
   * Processes and stores the basic data of a Pokémon including its ID, image, types, and cry.
   * 
   * @param {any} data - The Pokémon data retrieved from the PokéAPI.
   * @returns {Promise<void>} A promise that resolves when the Pokémon data has been processed and stored.
   */
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

  /**
   * Loads and sets the Pokémon's name in German by fetching its species data from the PokéAPI.
   * 
   * @param {string} url - The URL to fetch the Pokémon species data.
   * @returns {Promise<void>} A promise that resolves when the Pokémon's name has been set.
   */
  private async loadPokemonName(url: string): Promise<void> {
    const response = await fetch(url);
    const data = await response.json();
    this.pokemon.name = this.searchGermanLanguage(data.names);
  }

  /**
   * Loads and sets the Pokémon's type names in German by fetching type data from the PokéAPI.
   * 
   * @param {string} url - The URL to fetch the Pokémon type data.
   * @param {number} index - The index to determine if the type is primary or secondary.
   * @returns {Promise<void>} A promise that resolves when the Pokémon's types have been set.
   */
  private async loadPokemonTypes(url: string, index: number): Promise<void> {
    const response = await fetch(url);
    const data = await response.json();
    if (index === 0) {
      this.pokemon.types.firstType = this.searchGermanLanguage(data.names);
    } else {
      this.pokemon.types.secondType = this.searchGermanLanguage(data.names);
    }
  }

  /**
   * Loads and processes the stats of a Pokémon by fetching its data from the PokéAPI.
   * The stats are then stored in the `pokemon.stats` array.
   * 
   * @param {number} id - The ID of the Pokémon whose stats are to be loaded.
   * @returns {Promise<void>} A promise that resolves when the Pokémon's stats have been loaded and stored.
   */
  public async loadPokemonStats(id: number): Promise<void> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    this.pokemon.stats = [];
    for (let i = 0; i < data.stats.length; i++) {
      const statData = {
        name: '',
        stat: data.stats[i].base_stat,
      };
      await this.loadPokemonStatsName(data.stats[i].stat.url, statData);
    }
  }

  /**
   * Loads and sets the name of a Pokémon's stat in German by fetching its data from the PokéAPI.
   * The stat name is then added to the corresponding stat object.
   * 
   * @param {string} url - The URL to fetch the Pokémon stat data.
   * @param {any} statData - The stat object that will be updated with the stat name.
   * @returns {Promise<void>} A promise that resolves when the stat name has been set.
   */
  private async loadPokemonStatsName(url: string, statData: any): Promise<void> {
    const response = await fetch(url);
    const data = await response.json();
    statData.name = this.searchGermanLanguage(data.names);
    this.pokemon.stats.push(statData);
  }

  /**
   * Loads detailed data of a Pokémon, including height, weight, genera, egg groups, and egg steps.
   * Additional species-specific data is fetched and processed.
   * 
   * @param {number} id - The ID of the Pokémon whose detailed data is to be loaded.
   * @returns {Promise<void>} A promise that resolves when the Pokémon's data has been fully loaded and processed.
   */
  public async loadPokemonData(id: number): Promise<void> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    this.pokemon.height = (data.height / 10).toString().replace('.', ',');
    this.pokemon.weight = (data.weight / 10).toString().replace('.', ',');
    await this.loadMorePokemonData(data.species.url);
  }

  /**
   * Loads additional species-specific data for a Pokémon, such as genera and egg groups.
   * This data is processed and stored in the `pokemon` object.
   * 
   * @param {string} url - The URL to fetch the Pokémon species data.
   * @returns {Promise<void>} A promise that resolves when the additional data has been loaded and processed.
   */
  private async loadMorePokemonData(url: string): Promise<void> {
    const response = await fetch(url);
    const data = await response.json();
    this.pokemon.genera = this.searchGermanLanguage(data.genera);
    this.pokemon.eggSteps = data.hatch_counter ? data.hatch_counter * 256 : 0;
    this.pokemon.eggGroups = [];
    if (data.egg_groups.length > 0) {
      for (let i = 0; i < data.egg_groups.length; i++) {
        await this.loadPokemonEggGroups(data.egg_groups[i].url);
      }
    } else {
      this.pokemon.eggGroups.push('Keine Daten vorhanden');
    }
  }

  /**
   * Loads and sets the names of a Pokémon's egg groups in German by fetching the data from the PokéAPI.
   * The egg group names are then added to the `pokemon.eggGroups` array.
   * 
   * @param {string} url - The URL to fetch the Pokémon egg group data.
   * @returns {Promise<void>} A promise that resolves when the egg group names have been set.
   */
  private async loadPokemonEggGroups(url: string): Promise<any> {
    const response = await fetch(url);
    const data = await response.json();
    this.pokemon.eggGroups.push(this.searchGermanLanguage(data.names));
  }

  /**
   * Loads evolution-related data for a Pokémon by first fetching its species data, 
   * and then the full evolution chain from the PokéAPI.
   * 
   * @param {number} id - The ID of the Pokémon whose evolution data is to be loaded.
   * @returns {Promise<void>} A promise that resolves when the evolution data has been loaded and processed.
   */
  public async loadPokemonForEvolution(id: number): Promise<void> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    await this.loadPokemonSpeciesForEvolution(data.species.url);
  }

  /**
   * Loads the evolution chain for a Pokémon by fetching the data from the PokéAPI.
   * 
   * @param {string} url - The URL to fetch the Pokémon species data.
   * @returns {Promise<void>} A promise that resolves when the evolution chain has been loaded and processed.
   */
  private async loadPokemonSpeciesForEvolution(url: string): Promise<void> {
    const response = await fetch(url);
    const data = await response.json();
    this.loadPokemonEvolutions(data.evolution_chain.url);
  }

  /**
   * Loads the full evolution chain for a Pokémon and processes the names of each evolutionary stage.
   * 
   * @param {string} url - The URL to fetch the Pokémon evolution chain data.
   * @returns {Promise<void>} A promise that resolves when the evolution names have been processed.
   */
  private async loadPokemonEvolutions(url: string): Promise<any> {
    const response = await fetch(url);
    const data = await response.json();
    await this.getEvolutionNames(data.chain);
  }

  /**
   * Recursively traverses the evolution chain and gathers the names of all evolutionary stages.
   * The gathered names are then processed and stored in the `pokemon.evolutions` array.
   * 
   * @param {any} evolution - The root object of the evolution chain.
   * @returns {Promise<void>} A promise that resolves when all evolution names have been gathered and processed.
   */
  private async getEvolutionNames(evolution: any): Promise<void> {
    const names: any[] = [];
    const traverseEvolutions = (currentEvolution: any) => {
      if (!currentEvolution) return;
      names.push(currentEvolution.species.name);
      for (let nextEvolution of currentEvolution.evolves_to) {
        traverseEvolutions(nextEvolution);
      }
    };
    traverseEvolutions(evolution);
    this.processAndLoadPokemonEvolutions(names);
  }

  /**
   * Processes the gathered evolution names and loads additional data for each evolutionary stage,
   * including images and names, then stores them in the `pokemon.evolutions` array.
   * 
   * @param {any[]} names - The array of evolutionary stage names.
   * @returns {Promise<void>} A promise that resolves when the evolution data has been processed and loaded.
   */
  private async processAndLoadPokemonEvolutions(names: any[]): Promise<void> {
    this.pokemon.evolutions = [];
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      await this.loadPokemonEvolutionsImg(name);
    }
  }

  /**
   * Loads and sets the image and additional data for a Pokémon in the evolution chain.
   * 
   * @param {string} name - The name of the Pokémon in the evolution chain.
   * @returns {Promise<void>} A promise that resolves when the evolution data has been loaded and set.
   */
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

  /**
   * Loads and sets the name of a Pokémon in the evolution chain by fetching its species data.
   * The name is then stored in the corresponding evolution data object.
   * 
   * @param {string} url - The URL to fetch the Pokémon species data.
   * @param {any} evolutionData - The evolution data object that will be updated with the Pokémon's name.
   * @returns {Promise<void>} A promise that resolves when the name has been set.
   */
  private async loadPokemonNamesAndIdForEvolution(url: string, evolutionData: any): Promise<void> {
    const response = await fetch(url);
    const data = await response.json();
    evolutionData.name = this.searchGermanLanguage(data.names);
    this.pokemon.evolutions.push(evolutionData);
  }

  /**
  * Loads all Pokémon species names that include the given name substring.
  * The results are stored in the `foundPokemonNames` array and then used to load detailed Pokémon data.
  * 
  * @param {string} name - The substring to search for in Pokémon species names.
  * @returns {Promise<void>} A promise that resolves when all matching Pokémon species names have been loaded.
  */
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

  /**
   * Loads detailed data for each Pokémon whose name is stored in the `foundPokemonNames` array.
   * The results are stored in the `foundPokemons` array.
   * 
   * @returns {Promise<any>} A promise that resolves when all matching Pokémon data has been loaded.
   */
  private async loadFoundPokemons(): Promise<any> {
    this.resetPokemon();
    this.loadingPokemon = true;
    document.body.style.overflowY = 'hidden';
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

  /**
   * Resets the `pokemon` object to its initial state, clearing all stored data.
   * 
   * @returns {void}
   */
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

  /**
   * Searches through a list of names or genera to find the German language entry.
   * 
   * @param {any} data - The data array containing names or genera in different languages.
   * @returns {string} The German name or genus if found, or 'Keine Daten vorhanden' if not.
   */
  private searchGermanLanguage(data: any): any {
    const germanNameObject = data.find((nameObj: any) => nameObj.language.name === 'de');
    if (germanNameObject) {
      if (germanNameObject.name) {
        return germanNameObject.name;
      }
      if (germanNameObject.genus) {
        return germanNameObject.genus;
      }
    } else {
      return 'Keine Daten vorhanden';
    }
  }

  /**
   * Sets the chart reference to the given chart instance.
   * 
   * @param {any} chart - The chart instance to set.
   */
  setChart(chart: any) {
    this.chart = chart;
  }

  /**
   * Creates or updates the Pokémon stats chart using the current Pokémon's stats.
   * Initializes the chart with the specified data and plugins.
   * 
   * @returns {void}
   */
  public createOrUpdateChart(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    this.destroyChartInstance();

    const data = this.createPokemonStatsChart();
    const progressBar = this.createProgressBarPlugin();

    this.initializeChart(ctx, data, progressBar);
  }

  /**
   * Creates the data structure for the Pokémon stats chart, including labels, data, and styles.
   * 
   * @returns {any} The data structure for the chart.
   */
  private createPokemonStatsChart() {
    return {
      labels: this.pokemon.stats.map((stat: { name: any; }) => stat.name),
      datasets: [{
        label: 'Pokémon Stats',
        data: this.pokemon.stats.map((stat: { stat: any; }) => stat.stat),
        backgroundColor: this.pokemon.stats.map((stat: { stat: number; }) => stat.stat <= 60 ? '#5cc0de' : '#5db85b'),
        borderColor: 'black',
        borderWidth: 1,
      }],
    };
  }

  /**
   * Retrieves the drawing context from the chart's canvas element.
   * 
   * @returns {CanvasRenderingContext2D | null} The 2D drawing context, or null if not found.
   */
  private getContext(): CanvasRenderingContext2D | null {
    const ctx = this.chart.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Context not found!');
      return null;
    }
    return ctx;
  }

  /**
   * Destroys the existing chart instance, if it exists.
   * 
   * @returns {void}
   */
  private destroyChartInstance(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  /**
   * Creates a plugin for rendering a progress bar on the chart.
   * 
   * @returns {any} The progress bar plugin configuration.
   */
  private createProgressBarPlugin(): any {
    return {
      id: 'progressBar',
      beforeDatasetsDraw: (chart: any) => this.drawProgressBar(chart),
    };
  }

  /**
   * Draws the progress bar on the chart based on the current data.
   * 
   * @param {object} chart - The chart object containing data and drawing context.
   * @returns {void}
   */
  private drawProgressBar(chart: { getDatasetMeta?: any; ctx?: any; data?: any; chartArea?: any; scales?: any; }): void {
    const { ctx, data, chartArea: { top, height, left }, scales: { y } } = chart;
    ctx.save();
    const barHeight = height / data.labels.length;
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
    this.drawLabelsAndValues(chart, top, barHeight, left);
  }

  /**
   * Draws the labels and values next to the progress bar on the chart.
   * 
   * @param {object} chart - The chart object containing data and drawing context.
   * @param {number} top - The top position of the chart area.
   * @param {number} barHeight - The height of each bar in the chart.
   * @param {number} left - The left position of the chart area.
   * @returns {void}
   */
  private drawLabelsAndValues(chart: any, top: number, barHeight: number, left: number): void {
    const { ctx, data } = chart;
    data.labels.forEach((label: any, index: number) => {
      const dataPoint = chart.getDatasetMeta(0).data[index];
      dataPoint.y = top + barHeight * (index + 0.8);
      ctx.font = '18px sans-serif';
      ctx.fillStyle = 'white';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, left - 200, dataPoint.y);
      ctx.fillStyle = 'rgba(180, 180, 180, 1)';
      ctx.fillText(data.datasets[0].data[index], left - 20, dataPoint.y);
    });
  }

  /**
   * Initializes the chart instance with the specified data and plugins.
   * 
   * @param {CanvasRenderingContext2D} ctx - The 2D drawing context.
   * @param {any} data - The data structure for the chart.
   * @param {any} progressBar - The progress bar plugin configuration.
   * @returns {void}
   */
  private initializeChart(ctx: CanvasRenderingContext2D, data: any, progressBar: any): void {
    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data,
      options: this.getChartOptions(),
      plugins: [progressBar],
    });
  }

  /**
   * Retrieves the configuration options for the chart, including layout and scales.
   * 
   * @returns {any} The chart options configuration.
   */
  private getChartOptions(): any {
    return {
      layout: { padding: { left: 200 } },
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: this.getChartScales(),
    };
  }

  /**
   * Retrieves the configuration for the chart's scales, including grid and tick display settings.
   * 
   * @returns {any} The chart scales configuration.
   */
  private getChartScales(): any {
    return {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { display: false },
        min: -150,
        max: 255,
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
        border: { display: false },
        ticks: { display: false },
      },
    };
  }

  /**
   * Sets the search input for the Pokémon search.
   * 
   * @param {string} searchContent - The search string to be set as the current search input.
   */
  public setSearchInput(searchContent: string): void {
    this.search = searchContent;
  }
}