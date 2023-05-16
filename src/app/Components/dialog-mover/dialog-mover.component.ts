import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlmacenamientoService } from 'src/app/Services/almacenamiento.service';
import { InventarioService } from 'src/app/Services/inventario.service';
import { Almacenamiento } from 'src/app/models/Almacenamiento';
import { Inventario } from 'src/app/models/Inventario';
import { Producto } from 'src/app/models/Producto';

@Component({
  selector: 'app-dialog-mover',
  templateUrl: './dialog-mover.component.html',
  styleUrls: ['./dialog-mover.component.css']
})
export class DialogMoverComponent {

  producto: Producto;
  inventarioForm: FormGroup;
  inventario: Inventario;
  almacenamientos: Almacenamiento[];
  almacenamiento: Almacenamiento;
  mensajeAlmacenamiento: string;
  mensajeCantidad: string;

  constructor(
    public dialogRef: MatDialogRef<DialogMoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private almacenamientoService: AlmacenamientoService,
    private inventarioService: InventarioService,
  ) { }

  ngOnInit(): void {
    this.inventario = this.data.inventario;
    this.producto = this.data.producto;
    this.almacenamientoService.getAlmacenamientoInventario(this.inventario.id).subscribe(almacenamiento => {
      this.almacenamiento = almacenamiento;
    });


    this.almacenamientoService.getAlmacenamientos().subscribe(almacenamientos => {
      this.almacenamientos = almacenamientos;
    });

    this.inventarioForm = this.fb.group({
      cantidad: ['', Validators.required],
      almacenamiento: [this.almacenamiento, Validators.required]
    });

  }


  async moverProducto() {
    const valoresFormulario = this.inventarioForm.value;
    const cantidadMover = valoresFormulario.cantidad;
    let nuevoInventario = new Inventario();

    if (this.validarCampos(valoresFormulario)) {
      const inventarios = await this.inventarioService.getInventarioProductoAlmacenamiento(this.producto.id, valoresFormulario.almacenamiento.id).toPromise();

      for (let i = 0; i < inventarios.length; i++) {

        if (this.inventario.fechaCaducidad == null && this.inventario.fechaCaducidad === inventarios[i].fechaCaducidad) {
          nuevoInventario = inventarios[i];
          break;
        }

        const fechaCaducidad = new Date(this.inventario.fechaCaducidad);
        fechaCaducidad.setDate(fechaCaducidad.getDate() + 1);
        if (new Date(inventarios[i].fechaCaducidad).toISOString().substring(0, 10) === fechaCaducidad.toISOString().substring(0, 10)) {
          nuevoInventario = inventarios[i];
          break;
        }
      }
      this.inventario.cantidad = this.inventario.cantidad - cantidadMover;
      if (this.inventario.cantidad <= 0) {
        this.inventarioService.deleteInventario(this.inventario.id).subscribe(menssage => { })
      } else {
        this.inventarioService.updateInventario(this.inventario).subscribe(() => { });
      }

      if (nuevoInventario.id != null) {
        nuevoInventario.almacenamiento = valoresFormulario.almacenamiento;
        nuevoInventario.cantidad += cantidadMover;
        this.inventarioService.updateInventario(nuevoInventario).subscribe(i => {
        });

      } else {
        nuevoInventario.almacenamiento = valoresFormulario.almacenamiento;
        nuevoInventario.cantidad = cantidadMover;
        nuevoInventario.fechaCaducidad = this.inventario.fechaCaducidad;
        nuevoInventario.producto = this.producto;
        this.inventarioService.crearInventario(nuevoInventario).subscribe(i => {
        });
      }
      this.dialogRef.close();
    }
  }


  validarCampos(valoresFormulario: any): Boolean {
    const almacenamiento = valoresFormulario.almacenamiento;
    const cantidad = valoresFormulario.cantidad;
    let validar: Boolean = true;
    if (almacenamiento == null) {
      this.mensajeAlmacenamiento = "El almacenamiento no puede estar vacio.";
      validar = false;
    } else if (this.almacenamiento.id == almacenamiento.id) {
      this.mensajeAlmacenamiento = "El almacenamiento no puede ser el mismo.";
      validar = false;
    }

    if (cantidad == null || cantidad == '') {
      this.mensajeCantidad = "Debes especificar una cantidad.";
      validar = false;
    } else if (cantidad > this.inventario.cantidad) {
      this.mensajeCantidad = "La cantidad no puede ser mayor a la actual (" + this.inventario.cantidad + ").";
      validar = false;
    }
    return validar;
  }

  quitarError() {
    this.mensajeCantidad = null;
    this.mensajeAlmacenamiento = null;
  }
}

