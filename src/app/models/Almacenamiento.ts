import { Inventario } from './Inventario';

export class Almacenamiento {
  id: number;
  nombre: string;
  lugar: string;
  inventarios: Inventario[];

  constructor(id?: number, nombre?: string, lugar?: string, inventarios?: Inventario[]) {
      this.id = id;
      this.nombre = nombre;
      this.lugar = lugar;
      this.inventarios = inventarios;
  }
}