import { Producto } from './Producto';
import { Almacenamiento } from './Almacenamiento';

export class SubProducto extends Producto {
  imagen: string;
  descripcion: string;
  fechaCaducidad: Date;
  precio: number;
  almacenamiento: Almacenamiento;

  constructor(id?: number, nombre?: string, imagen?: string, descripcion?: string, fechaCaducidad?: Date, precio?: number, almacenamiento?: Almacenamiento) {
      super(id, nombre);
      this.imagen = imagen;
      this.descripcion = descripcion;
      this.fechaCaducidad = fechaCaducidad;
      this.precio = precio;
      this.almacenamiento = almacenamiento;
  }
}