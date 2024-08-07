import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { BigCardComponent } from './big-card/big-card.component';
import { CardService } from './services/card/card.service';
import { LoadingScreenComponent } from './main/loading-screen/loading-screen.component';
import { ApiService } from './services/api/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    BigCardComponent,
    LoadingScreenComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public cardService: CardService = inject(CardService);
  public apiService: ApiService = inject(ApiService);
}
