import { Inventario } from './Inventario';

export class Producto {
  id: number;
  imagen: string;
  nombre: string;
  inventarios: Inventario[];
  fechaMasProxima: Date;

  constructor(id?: number, nombre?: string, cantidad?: number, inventarios?: Inventario[]) {
      this.id = id;
      this.nombre = nombre;
      this.inventarios = inventarios;
  }
}