import { SubProducto } from './SubProducto';

export class Producto {
  id: number;
  nombre: string;
  cantidad: number;
  listaSubProductos: SubProducto[];

  constructor(id?: number, nombre?: string, cantidad?: number, listaSubProductos?: SubProducto[]) {
      this.id = id;
      this.nombre = nombre;
      this.cantidad = cantidad;
      this.listaSubProductos = listaSubProductos;
  }
}