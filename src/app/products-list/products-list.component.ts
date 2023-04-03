
import { Component, OnInit } from '@angular/core';
import { Inventario } from '../models/Inventario';
import { Producto } from '../models/Producto';
import { InventarioService } from '../models/Services/inventario.service';
import { ProductoService } from '../models/Services/producto.service';
import { DatePipe } from '@angular/common';
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
    if (confirm('¿Estás seguro que deseas eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe(() => {
        // Remove product from filtered list
        this.filteredProducts = this.filteredProducts.filter(producto => producto.id !== id);
      });
    }
  }
}
