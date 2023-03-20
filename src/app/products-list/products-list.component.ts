import { Component, OnInit } from '@angular/core';
import { Producto } from '../models/Producto';
import { SubProducto } from '../models/SubProducto';
import { Almacenamiento } from '../models/Almacenamiento';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  productos: Producto[] = [];
  searchText: string = '';
  selectedStorage: Almacenamiento | null = null;
  sortedProducts: SubProducto[] = [];

  constructor() { }

  ngOnInit(): void {
    const almacenamiento1 = new Almacenamiento(1, 'Almacenamiento 1', 'Lugar 1', []);
    const producto1 = new SubProducto(1, 'Producto 1', 'imagen1.png', 'Descripción 1', new Date('2023-05-01'), 10, 1, almacenamiento1);
    const producto2 = new SubProducto(2, 'Producto 2', 'imagen2.png', 'Descripción 2', new Date('2023-06-01'), 20, 1, almacenamiento1);
    const producto3 = new SubProducto(3, 'Producto 3', 'imagen3.png', 'Descripción 3', new Date('2023-04-01'), 30, 1, almacenamiento1);

    almacenamiento1.productos.push(producto1, producto2, producto3);

    const almacenamiento2 = new Almacenamiento(1, 'Almacenamiento 2', 'Lugar 2', []);
    const producto4 = new SubProducto(1, 'Producto 4', 'imagen1.png', 'Descripción 1', new Date('2023-05-01'), 10, 1, almacenamiento2);
    const producto5 = new SubProducto(2, 'Producto 5', 'imagen2.png', 'Descripción 2', new Date('2023-06-01'), 20, 1, almacenamiento2);
    const producto6 = new SubProducto(3, 'Producto 6', 'imagen3.png', 'Descripción 3', new Date('2023-04-01'), 30, 1, almacenamiento2);
    
    almacenamiento2.productos.push(producto4, producto5, producto6);

    this.productos = [almacenamiento1, almacenamiento2];
    this.sortedProducts = this.sortProductsByDate();
  }

  sortProductsByDate(): SubProducto[] {
    let allProducts: SubProducto[] = [];

    for (const almacenamiento of this.productos) {
      allProducts = allProducts.concat(almacenamiento.productos);
    }

    return allProducts.sort((a, b) => a.fechaCaducidad.getTime() - b.fechaCaducidad.getTime());
  }

  filterProductsByStorage(products: SubProducto[]): SubProducto[] {
    if (!this.selectedStorage) {
      return products;
    }

    return products.filter(p => p.almacenamiento === this.selectedStorage);
  }

  filterProductsByName(products: SubProducto[]): SubProducto[] {
    if (!this.searchText) {
      return products;
    }

    return products.filter(p => p.nombre.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  onStorageChange(storage: Almacenamiento | null): void {
    this.selectedStorage = storage;
    this.sortedProducts = this.sortProductsByDate();
  }

  onSearchChange(searchText: string): void {
    this.searchText = searchText;
    this.sortedProducts = this.sortProductsByDate();
  }

  increaseProductQuantity(product: SubProducto): void {
    product.cantidad += 1;
  }

  decreaseProductQuantity(product: SubProducto): void {
    if (product.cantidad > 0) {
      product.cantidad -= 1;
    }
  }
}
