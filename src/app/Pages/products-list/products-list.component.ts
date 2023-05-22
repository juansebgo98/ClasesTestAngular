
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import Swal from 'sweetalert2';
import { ProductoService } from '../../Services/producto.service';
import { Producto } from '../../models/Producto';


@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  providers: [DatePipe]
})
export class ProductListComponent implements OnInit {

  @ViewChild('action') action: any;
  @ViewChild('divScanner') divScanner: ElementRef;

  productos: Producto[];
  filteredProducts: Producto[];
  searchTerm: string = "";
  showQRScanner = false;

  constructor(private router: Router, private productoService: ProductoService, private datePipe: DatePipe) { }

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
        let total = 0;
        for (let i = 0; i < producto.inventarios.length; i++) {
          total = total + producto.inventarios[i].cantidad;
        }
        producto.cantidadAlmacenado = total;
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

  activarCamaraBuscar() {
    this.showQRScanner = true;
    setTimeout(() => {
      this.action.start();
      
      let listaCamaras = this.action.devices.value;
      for (let i = 0; i < listaCamaras.length; i++) {
        let c = listaCamaras[i];
        if (c.label.toLowerCase().includes("back")) {
          this.action.selectDevice(c.deviceId).then(() => {
            // Resto del código dentro del condicional
            // Aquí puedes realizar las acciones necesarias con la cámara trasera seleccionada
          }).catch((error) => {
            // Manejo de errores si no se pudo seleccionar la cámara trasera
          });
          break; // Termina el bucle una vez que se ha encontrado la cámara trasera
        }         
      }
    }, 100);
  }

  public onEvent(e: ScannerQRCodeResult[]): void {
    const id = parseInt(e[0].value, 10);
    this.productoService.getProducto(id).subscribe(producto => {
      this.filteredProducts = [producto];
      this.searchTerm = producto.nombre;
    }, error => {
      this.router.navigate(['/productos']);
      console.error(error.error.mensaje);
      Swal.fire('Error al obtener', error.error.mensaje, 'error');
    })
    this.showQRScanner = false;
  }
}
