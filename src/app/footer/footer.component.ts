import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  /**
 * Retrieves the current year as a four-digit number.
 * 
 * @returns {number} The current year.
 */
  public getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
