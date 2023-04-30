
import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/Producto';
import { ProductoService } from '../../Services/producto.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductoComponent } from '../producto/producto.component';


@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  providers: [DatePipe]
})
export class ProductListComponent implements OnInit {

  productos: Producto[];
  filteredProducts: Producto[];
  searchTerm: string = "";

  constructor(private productoService: ProductoService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.obtenerProductos();

  }

  filterProducts() {
    this.filteredProducts = this.productos.filter(product =>
      product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  obtenerProductos(): void {
    this.productoService.getProductos().subscribe(productos => {
      productos.forEach(producto => {
        producto.fechaMasProxima = new Date(Math.min(
          ...producto.inventarios
            .filter(i => i.fechaCaducidad) // solo considerar inventarios con fecha de caducidad definida
            .map(i => new Date(i.fechaCaducidad).getTime())
            .filter(t => !isNaN(t))
        ));
      });
      // Ordenar primero por fecha más próxima, y luego por aquellos sin fecha de caducidad
      this.productos = productos.sort((a, b) => {
        const aFecha = a.fechaMasProxima.getTime();
        const bFecha = b.fechaMasProxima.getTime();
        if (isNaN(aFecha) && isNaN(bFecha)) {
          return a.nombre.localeCompare(b.nombre);
        } else if (isNaN(aFecha)) {
          return 1;
        } else if (isNaN(bFecha)) {
          return -1;
        } else {
          return aFecha - bFecha;
        }
      });
      this.filteredProducts = this.productos;
    });
  }



  diasParaCaducar(fechaCaducidad: Date): number {
    const MILISEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
    const hoy = new Date();
    const fechaCad = new Date(fechaCaducidad);
    const diferencia = fechaCad.getTime() - hoy.getTime();
    return Math.ceil(diferencia / MILISEGUNDOS_POR_DIA);
  }

  eliminarProducto(id: number) {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar este producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteProducto(id).subscribe(() => {
          // Remove product from filtered list
          this.filteredProducts = this.filteredProducts.filter(producto => producto.id !== id);
          Swal.fire(
            '¡Eliminado!',
            'El producto ha sido eliminado correctamente.',
            'success'
          );
        }, () => {
          Swal.fire(
            '¡Error!',
            'Ha ocurrido un error al eliminar el producto.',
            'error'
          );
        });
      }
    });
  }

  todo() {

  }
}
