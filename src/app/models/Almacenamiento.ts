import { SubProducto } from './SubProducto';

export class Almacenamiento {
  id: number;
  nombre: string;
  lugar: string;
  productos: SubProducto[];

  constructor(id?: number, nombre?: string, lugar?: string, productos?: SubProducto[]) {
      this.id = id;
      this.nombre = nombre;
      this.lugar = lugar;
      this.productos = productos;
  }
}