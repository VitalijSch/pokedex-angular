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

  private isLoading: boolean = false;

  public async onScroll(event: any): Promise<void> {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (atBottom) {
      await this.scrollToBottomAction();
    }
  }

  public async scrollToBottomAction(): Promise<void> {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.apiService.startLoad = this.apiService.startLoad + 20;
    this.apiService.endLoad = this.apiService.endLoad + 20;
    await this.apiService.fetchPokemons();
    this.isLoading = false;
  }
}