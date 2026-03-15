import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  @Output() search = new EventEmitter<string>();

  // En hero.component.ts
onSearchChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  this.search.emit(value); // Enviamos el string directamente
}
}