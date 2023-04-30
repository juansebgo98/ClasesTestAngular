import { Almacenamiento } from "./Almacenamiento";
import { Producto } from "./Producto";

export class Inventario {
  id: number;
  almacenamiento: Almacenamiento;
  producto: Producto;
  cantidad: number;
  precio: number;
  fechaCaducidad: Date;

  constructor(id?: number, almacenamiento?: Almacenamiento, producto?: Producto, cantidad?: number, precio?: number, fechaCaducidad?: Date) {
    this.id = id;
    this.almacenamiento = almacenamiento;
    this.producto = producto;
    this.cantidad = cantidad;
    this.precio = precio;
    this.fechaCaducidad = fechaCaducidad;
  }

}