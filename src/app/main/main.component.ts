import { Component, inject } from '@angular/core';
import { CardComponent } from './card/card.component';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CardComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  public apiService: ApiService = inject(ApiService);

  ngOnInit(): void {
    this.apiService.getPokemon();
  }
}
