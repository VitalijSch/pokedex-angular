import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api/api.service';
import { CardService } from '../services/card/card.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public apiService: ApiService = inject(ApiService);
  private cardService: CardService = inject(CardService);

  @ViewChild('searchInput') searchInput!: ElementRef;

  public search: string = '';

  ngAfterViewChecked() {
    if (!this.apiService.loadingPokemon) {
      this.searchInput.nativeElement.focus();
    }
  }

  public async searchPokemon(): Promise<void> {
    if (this.search.length >= 3) {
      this.cardService.searchPokemon = true;
      await this.apiService.loadAllPokemonNames(this.search.toLowerCase());
    } else {
      this.cardService.searchPokemon = false;
      this.apiService.foundPokemons = [];
    }
  }
}