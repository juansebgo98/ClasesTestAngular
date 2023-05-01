import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


import { ActivatedRoute, Router } from '@angular/router';
import { ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { ProductoService } from 'src/app/Services/producto.service';
import { Producto } from 'src/app/models/Producto';
import { DatosProductoService } from 'src/app/Services/datosproducto.service';

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


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productoService: ProductoService,
    private datosProductoService: DatosProductoService
  ) { }

  ngOnInit(): void {
    this.formularioProducto = this.formBuilder.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      imagen: ['https://www.cardboardboxshop.com.au/wp-content/uploads/2020/10/Archive-Carton.jpg', Validators.required]
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.idActual = parseInt(id);

    if (id !== null) {
      this.productoService.getProducto(+id).subscribe(
        producto => {
          this.producto = producto;
          this.formularioProducto.setValue({
            id: producto.id,
            nombre: producto.nombre,
            imagen: producto.imagen
          });
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
    console.log(id);
    if (id == null || id == undefined || id == 0) {
      this.formularioProducto.value.id = this.idEscaneado;
      console.log(this.formularioProducto.value.id);
      console.log(this.formularioProducto.value.imagen);
      console.log(this.formularioProducto.value.nombre);
    }
    if (this.formularioProducto.value.id == 0 && this.formularioProducto.value.imagen == null && this.formularioProducto.value.nombre == null) {
      // Resaltar campos inválidos en rojo
      Object.keys(this.formularioProducto.controls).forEach(key => {
        this.formularioProducto.controls[key].markAsDirty();
        this.formularioProducto.controls[key].markAsTouched();
      });

      // Mostrar mensaje de error con SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa correctamente todos los campos.',
      });

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
        let imagenObtenida ="";
        if(datos.product){
          console.log(datos.product.selected_images)
          imagenObtenida= datos.product.selected_images.front.display.es;
        }else{
          imagenObtenida = datos.product.image_front_url;
        }
        this.formularioProducto.setValue({
          id: datos.code,
          nombre: datos.product.product_name,
          imagen: imagenObtenida
        });
      }
    })
  }

  mostrarQRScanner() {
    this.showQRScanner = true;
    this.action.start();
  }

}
