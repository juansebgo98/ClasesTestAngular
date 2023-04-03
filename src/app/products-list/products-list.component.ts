
import { Component, OnInit } from '@angular/core';
import { Inventario } from '../models/Inventario';
import { Producto } from '../models/Producto';
import { InventarioService } from '../models/Services/inventario.service';
import { ProductoService } from '../models/Services/producto.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms'; 

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
    this.productoService.getProductos()
      .subscribe(productos => {
        productos.forEach(producto => {
          producto.fechaMasProxima = new Date(Math.min(...producto.inventarios.map(i => new Date(i.fechaCaducidad).getTime()).filter(t => !isNaN(t))));
        });
        this.productos = productos.sort((a, b) => a.fechaMasProxima.getTime() - b.fechaMasProxima.getTime());
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
}
