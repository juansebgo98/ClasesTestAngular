import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BarcodeFormat } from '@zxing/library';
import Swal from 'sweetalert2';


import { Producto } from 'src/app/models/Producto'; 
import { ProductoService } from 'src/app/Services/producto.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  producto: Producto;
  formularioProducto: FormGroup;
  submitted = false;
  idActual: Number;
  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/ ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productoService: ProductoService,
    private modalService: NgbModal
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
    this.submitted = true;

    if (this.formularioProducto.invalid) {
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
          this.guardarProductoImagenPorDefecto();
        }
      });
    } else {
      this.guardarProductoImagenPorDefecto();
    }
  }

  guardarProductoImagenPorDefecto(){
    this.producto.id = this.formularioProducto.value.id;
    this.producto.nombre = this.formularioProducto.value.nombre;
    this.producto.imagen = this.formularioProducto.value.imagen;

    if (this.producto.id == this.idActual) {
      this.productoService.updateProducto(this.producto).subscribe(
        () => this.router.navigate(['/'])
      );
    } else {
      this.productoService.crearProducto(this.producto).subscribe(
        () => this.router.navigate(['/'])
      );
    }
  }

  cancelar() {
    this.modalService.dismissAll();
    this.router.navigate(['/'])
  }
  
}
