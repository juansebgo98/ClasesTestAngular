import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


import { ActivatedRoute, Router } from '@angular/router';
import { ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { ProductoService } from 'src/app/Services/producto.service';
import { Producto } from 'src/app/models/Producto';
import { DatosProductoService } from 'src/app/Services/datosproducto.service';
import { Tienda } from 'src/app/models/Tienda';
import { TiendaService } from 'src/app/Services/tienda.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  producto: Producto;
  formularioProducto: FormGroup;
  idActual: Number;
  idEscaneado: Number;
  @ViewChild('id') id: ElementRef;
  showQRScanner = false;
  @ViewChild('action') action: any;
  @ViewChild('divScanner') divScanner: ElementRef;
  anniadirCompra: boolean;
  tiendas: Tienda[];


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productoService: ProductoService,
    private datosProductoService: DatosProductoService,
    private tiendaService: TiendaService
  ) { }

  ngOnInit(): void {
    this.tiendaService.getTiendas().subscribe(tiendas => {
      this.tiendas = tiendas;
    });

    this.anniadirCompra = false;
    this.formularioProducto = this.formBuilder.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      imagen: ['https://www.cardboardboxshop.com.au/wp-content/uploads/2020/10/Archive-Carton.jpg', Validators.required],
      anniadirCompra: [false],
      minimoCompra: [],
      tienda: [0]
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.idActual = parseInt(id);
    

    if (id !== null) {
      this.productoService.getProducto(+id).subscribe(
        producto => {
          this.producto = producto;
          let tiendaId = 0;
          if (this.producto.tienda != null) {
            tiendaId = this.producto.tienda.id;
          }
          this.formularioProducto.setValue({
            id: producto.id,
            nombre: producto.nombre,
            imagen: producto.imagen,
            anniadirCompra: producto.listaCompra,
            minimoCompra: producto.cantidadMinima,
            tienda: tiendaId
          });
          this.anniadirCompra = producto.listaCompra;
        }
      );
    } else {
      this.producto = new Producto();
    }
  }

  get f() {
    return this.formularioProducto.controls;
  }

  guardarProducto() {
    const id = Number(this.formularioProducto.value.id);
    let fallo = false;
    if (id == null || id == undefined || id == 0) {
      this.formularioProducto.value.id = this.idEscaneado;
    }
    if (this.formularioProducto.value.id == 0 || this.formularioProducto.value.imagen == null || this.formularioProducto.value.nombre == "") {
      // Resaltar campos inválidos en rojo
      Object.keys(this.formularioProducto.controls).forEach(key => {
        this.formularioProducto.controls[key].markAsDirty();
        this.formularioProducto.controls[key].markAsTouched();
      });

      // Mostrar mensaje de error con SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error, Campos incompletos',
        text: 'Por favor, completa correctamente todos los campos.',
      });
      fallo = true;
      return;
    } else if (this.formularioProducto.value.anniadirCompra && this.formularioProducto.value.minimoCompra == null) {
      Swal.fire({
        icon: 'error',
        title: 'Error, Campos incompletos',
        text: 'Si se selecciona añadir a la compra se debe poner una cantidad minima.',
      });
      fallo = true;
      return;
    }

    if (this.formularioProducto.value.imagen === 'https://www.cardboardboxshop.com.au/wp-content/uploads/2020/10/Archive-Carton.jpg') {
      Swal.fire({
        title: 'Imagen por defecto',
        text: '¿Está seguro que quiere utilizar la imagen por defecto?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          this.guardarProductoBaseDatos();
        }
      });
    } else {
      this.guardarProductoBaseDatos();
    }
  }

  guardarProductoBaseDatos() {
    this.producto.id = this.formularioProducto.value.id;
    this.producto.nombre = this.formularioProducto.value.nombre;
    this.producto.imagen = this.formularioProducto.value.imagen;
    this.producto.listaCompra = this.formularioProducto.value.anniadirCompra;
    console.log(this.formularioProducto.value.tienda);
    if (this.formularioProducto.value.tienda != 0 && this.formularioProducto.value.tienda != null) {
      let tienda: Tienda = new Tienda(this.formularioProducto.value.tienda);
      this.producto.tienda = tienda;
    }

    if (this.producto.listaCompra == false) {
      this.producto.cantidadMinima = 0;
    } else {
      this.producto.cantidadMinima = this.formularioProducto.value.minimoCompra;
    }

    if (this.producto.id == this.idActual) {
      this.productoService.updateProducto(this.producto).subscribe(
        () => this.router.navigate(['/'])
      );
    } else {
      this.productoService.getProducto(this.producto.id).subscribe(p => {

        Swal.fire({
          title: 'Producto ya existe',
          text: 'El producto ya existe ¿Está seguro que quiere sobre escribir el producto?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, actualizar producto',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.isConfirmed) {
            this.productoService.updateProducto(this.producto).subscribe(
              () => this.router.navigate(['/'])
            );
          }
        });
      }, error => {
        this.productoService.crearProducto(this.producto).subscribe(
          () => this.router.navigate(['/'])
        );
      }
      )
    }
  }

  public escaneado(e: ScannerQRCodeResult[]): void {
    const id = parseInt(e[0].value, 10);
    this.idEscaneado = id;
    this.id.nativeElement.value = this.idEscaneado;
    this.showQRScanner = false;
    this.datosProductoService.getDatosProductos(id).subscribe(datos => {

      if (datos.status_verbose == "product found") {
        let imagenObtenida = "";
        if (datos.product.image_front_url == "" || datos.product.image_front_url == undefined) {
          imagenObtenida = datos.product.selected_images.front.display.es;
        } else {
          imagenObtenida = datos.product.image_front_url;
        }
        this.formularioProducto.setValue({
          id: datos.code,
          nombre: datos.product.product_name,
          imagen: imagenObtenida,
          anniadirCompra: this.formularioProducto.value.anniadirCompra,
          minimoCompra: this.formularioProducto.value.minimoCompra,
          tienda: this.formularioProducto.value.tienda
        });
      }
    })
  }

  mostrarQRScanner() {
    this.showQRScanner = true;
    setTimeout(() => {
      this.action.start();
    }, 100);
  }

  anniadirACompra() {
    this.anniadirCompra = !this.anniadirCompra;

  }

}
