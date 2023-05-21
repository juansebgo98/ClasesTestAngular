import { Component } from '@angular/core';

@Component({
  selector: 'app-almacenamiento',
  templateUrl: './almacenamiento.component.html',
  styleUrls: ['./almacenamiento.component.css']
})
export class AlmacenamientoComponent {
  listaCurso: string[] = ['TypeScript', 'JavaScript', 'Java SE', 'C#'];

  habilitar: boolean = true;
  constructor() {

  }

  setHabilitar(): void {
    this.habilitar = !this.habilitar;
  }

}
