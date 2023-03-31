import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BarcodeFormat } from '@zxing/library';

import { Producto } from '../models/Producto';
import { ProductoService } from '../models/Services/producto.service';

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
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.formularioProducto = this.formBuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      imagen: ['', Validators.required]
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
      return;
    }

    this.producto.id = this.formularioProducto.value.id;
    this.producto.nombre = this.formularioProducto.value.nombre;
    this.producto.imagen = this.formularioProducto.value.imagen;

    if (this.producto.id !== this.idActual) {
      this.productoService.updateProducto(this.producto).subscribe(
        () => this.router.navigate(['/'])
      );
    } else {
      this.productoService.crearProducto(this.producto).subscribe(
        () => this.router.navigate(['/'])
      );
    }
  }
  
}
