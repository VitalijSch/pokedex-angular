import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() pokemon!: any;

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

  public getColor(typeName: string): string {
    const type = this.types.find(t => t[typeName]);
    return type ? type[typeName] : '#000';
  }

  public getGradient(types: any[]): string {
    const color1 = this.getColor(types[0].type.name);
    const color2 = this.getColor(types[1].type.name);
    return `linear-gradient(to bottom, ${color1}, ${color2})`;
  }
}
