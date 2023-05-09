import { Inventario } from './Inventario';

export class Producto {
  id: number;
  imagen: string;
  nombre: string;
  inventarios: Inventario[];
  fechaMasProxima: Date;
  cantidadAlmacenado: number;
  cantidadMinima: number;

  /**
   * Clase Producto
   * @param id 
   * @param nombre 
   * @param cantidad 
   * @param inventarios 
   * @param cantidadMinima 
   */
  constructor(id?: number, nombre?: string, cantidad?: number, inventarios?: Inventario[], cantidadMinima?: number) {
    this.id = id;
    this.nombre = nombre;
    this.inventarios = inventarios;
    this.cantidadMinima = cantidadMinima;
  }
}