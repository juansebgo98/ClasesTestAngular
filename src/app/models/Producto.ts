import { Inventario } from './Inventario';
import { Tienda } from './Tienda';

export class Producto {
  id: number;
  imagen: string;
  nombre: string;
  inventarios: Inventario[];
  fechaMasProxima: Date;
  cantidadAlmacenado: number;
  cantidadMinima: number;
  listaCompra: boolean;
  tienda: Tienda;

  /**
   * Clase Producto
   * @param id 
   * @param nombre 
   * @param cantidad 
   * @param inventarios 
   * @param cantidadMinima 
   */
  constructor(id?: number, nombre?: string, cantidad?: number, inventarios?: Inventario[], cantidadMinima?: number, listaCompra? : boolean, tienda?: Tienda) {
    this.id = id;
    this.nombre = nombre;
    this.inventarios = inventarios;
    this.cantidadMinima = cantidadMinima;
    this.listaCompra = listaCompra;
    this.tienda = tienda;
  }
}