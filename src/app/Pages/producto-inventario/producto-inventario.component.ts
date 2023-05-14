import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogMovelComponent } from 'src/app/Components/dialog-movel/dialog-movel.component';
import { AlmacenamientoService } from 'src/app/Services/almacenamiento.service';
import { InventarioService } from 'src/app/Services/inventario.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { Almacenamiento } from 'src/app/models/Almacenamiento';
import { Inventario } from 'src/app/models/Inventario';
import { Producto } from 'src/app/models/Producto';


@Component({
  selector: 'app-inventory',
  templateUrl: './producto-inventario.component.html',
  styleUrls: ['./producto-inventario.component.css'],
  providers: [DatePipe]
})
export class ProductoInventoryComponent implements OnInit {

  displayedColumns: string[] = ['cantidad', 'fechaCaducidad', 'acciones'];
  idProducto: number;
  producto: Producto;
  almacenamientos: Almacenamiento[];

  constructor(private productoService: ProductoService, private datePipe: DatePipe, private inventarioService: InventarioService,
    private almacenamientoService: AlmacenamientoService, private activatedRoute: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.idProducto = +params.get('id');
      this.productoService.getProducto(this.idProducto).subscribe(
        producto => this.producto = producto
      );
      this.almacenamientoService.getAlmacenamientoProducto(this.idProducto).subscribe(
        almacenamientos => {
          this.almacenamientos = almacenamientos.map(almacenamiento => {
            this.inventarioService.getInventarioProductoAlmacenamiento(this.idProducto, almacenamiento.id).subscribe(
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

  mover(inventario: Inventario) {
    const dialogRef = this.dialog.open(DialogMovelComponent);
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
              this.inventarioService.getInventarioProductoAlmacenamiento(this.idProducto, almacenamiento.id).subscribe(
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
