import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Almacenamiento } from '../models/Almacenamiento';
import { Inventario } from '../models/Inventario';
import { Producto } from '../models/Producto';
import { AlmacenamientoService } from '../models/Services/almacenamiento.service';
import { InventarioService } from '../models/Services/inventario.service';
import { DatePipe } from '@angular/common';
import { ProductoService } from '../models/Services/producto.service';


@Component({
  selector: 'app-inventory',
  templateUrl: './producto-inventario.component.html',
  styleUrls: ['./producto-inventario.component.css'],
  providers: [DatePipe]
})
export class InventoryComponent implements OnInit {

  displayedColumns: string[] = ['cantidad', 'fechaCaducidad', 'acciones'];

  idProducto: number;
  producto: Producto;
  almacenamientos: Almacenamiento[];

  constructor(private productoService: ProductoService, private datePipe: DatePipe ,private inventarioService: InventarioService,private almacenamientoService: AlmacenamientoService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.idProducto = +params.get('id');
      this.productoService.getProducto(this.idProducto).subscribe(
        producto => this.producto = producto
      );
      this.almacenamientoService.getAlmacenamientoProducto(this.idProducto).subscribe(
        almacenamientos => {
          this.almacenamientos = almacenamientos.map(almacenamiento => {
            this.inventarioService.getInventarioProductoAlmacenamiento(this.idProducto,almacenamiento.id).subscribe(
              inventarios => almacenamiento.inventarios = inventarios
            );
            return almacenamiento;
          });
        }
      );
    });
  }
  

  incrementCantidad(inventario: Inventario) {
    inventario.cantidad++;
    this.inventarioService.updateInventario(inventario).subscribe();
  }

  decrementCantidad(inventario: Inventario) {
    inventario.cantidad--;
    if (inventario.cantidad > 0) {
      this.inventarioService.updateInventario(inventario).subscribe();
    } else {
      const index = this.almacenamientos.findIndex((a) =>
        a.inventarios.includes(inventario)
      );
      this.inventarioService.deleteInventario(inventario.id).subscribe(() => {
        this.almacenamientoService.getAlmacenamientoProducto(this.idProducto).subscribe(
          almacenamientos => {
            this.almacenamientos = almacenamientos.map(almacenamiento => {
              this.inventarioService.getInventarioProductoAlmacenamiento(this.idProducto,almacenamiento.id).subscribe(
                inventarios => almacenamiento.inventarios = inventarios
              );
              return almacenamiento;
            });
          }
        );
      });
    }
  }

  diasParaCaducar(fechaCaducidad: Date): number {
    const MILISEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
    const hoy = new Date();
    const fechaCad = new Date(fechaCaducidad);
    const diferencia = fechaCad.getTime() - hoy.getTime();
    return Math.ceil(diferencia / MILISEGUNDOS_POR_DIA);
}
}
