import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { AlmacenamientoService } from 'src/app/Services/almacenamiento.service';
import { InventarioService } from 'src/app/Services/inventario.service';
import { Almacenamiento } from 'src/app/models/Almacenamiento';
import { Inventario } from 'src/app/models/Inventario';
import { Producto } from 'src/app/models/Producto';

@Component({
  selector: 'app-inventario-details',
  templateUrl: './inventario-details.component.html',
  styleUrls: ['./inventario-details.component.css']
})
export class InventarioDetailsComponent implements OnInit {
  producto: Producto = new Producto();
  inventario: Inventario;
  inventarioForm: FormGroup;
  almacenamientos: Almacenamiento[];
  selectedValue: Almacenamiento;
  showQRScanner: boolean;
  @ViewChild('action') action: any;
  almacenamientoEncontrado: Almacenamiento;


  constructor(
    private fb: FormBuilder,
    private almacenamientoService: AlmacenamientoService,
    private inventarioService: InventarioService,
    private route: ActivatedRoute,
    private router: Router,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,

  ) { }

  ngOnInit(): void {
    this._locale = 'es';
    this._adapter.setLocale(this._locale);

    const id = +this.route.snapshot.paramMap.get('id');
    // Aquí se debería obtener el producto por el ID utilizando un servicio
    // pero como no has proporcionado el código de tu proyecto, se deja como un placeholder
    this.inventario = new Inventario();
    this.producto.id = id;
    this.inventario.producto = this.producto;
    this.inventarioForm = this.fb.group({
      cantidad: ['', Validators.required],
      almacenamiento: ['', Validators.required],
      precio: [''],
      fechaCaducidad: []
    });
    this.almacenamientoService.getAlmacenamientos().subscribe(almacenamientos => {
      this.almacenamientos = almacenamientos;
    });
  }

  async crearInventario() {
    // Obtener los valores del formulario
    const valoresFormulario = this.inventarioForm.value;
    let nuevoInventario = new Inventario();

    const inventarios = await this.inventarioService.getInventarioProductoAlmacenamiento(this.producto.id, valoresFormulario.almacenamiento).toPromise();

    for (let i = 0; i < inventarios.length; i++) {
      let fechaCaducidadString = null;
      let fechaObtenida = null;

      if (valoresFormulario.fechaCaducidad != null) {
        const fechaCaducidad = new Date(valoresFormulario.fechaCaducidad);
        fechaCaducidad.setDate(fechaCaducidad.getDate() + 1);
        fechaCaducidadString = fechaCaducidad.toISOString().substring(0, 10);
      }

      fechaObtenida = new Date(inventarios[i].fechaCaducidad).toISOString().substring(0, 10);
      if (fechaObtenida == '1970-01-01') {
        fechaObtenida = null;
      }
      if (fechaObtenida === fechaCaducidadString) {
        nuevoInventario = inventarios[i];
        break;
      }
    }
    this.almacenamientoEncontrado = await this.almacenamientoService.getAlmacenamiento(valoresFormulario.almacenamiento).toPromise();

    if (nuevoInventario.id == null) {

      nuevoInventario.producto = this.producto;
      nuevoInventario.almacenamiento = this.almacenamientoEncontrado;
      nuevoInventario.cantidad = valoresFormulario.cantidad;
      if (valoresFormulario.fechaCaducidad != null) {
        let fecha = new Date(valoresFormulario.fechaCaducidad);
        fecha.setHours(12);
        nuevoInventario.fechaCaducidad = fecha;
      }
      // Crear una nueva instancia de Inventario con los valores del formulario
      this.inventarioService.crearInventario(nuevoInventario).subscribe(() => {

        // Llamar al método de servicio para crear el inventario
        // Si se crea el inventario correctamente, redirigir a la pantalla de detalles del producto
        this.router.navigate([`/inventario/${this.producto.id}`]);
      });
    } else {
      let cantidad: number = valoresFormulario.cantidad;

      nuevoInventario.cantidad += cantidad;
      this.inventarioService.updateInventario(nuevoInventario).subscribe(() => {
        this.router.navigate([`/inventario/${this.producto.id}`]);
      });
    }

  }

  mostrarQRScanner() {
    this.showQRScanner = true;
    setTimeout(() => {
      this.action.start();
      this.action.deviceActive = 0;
    }, 100);
  }

  public escaneado(e: ScannerQRCodeResult[]): void {
    const id = parseInt(e[0].value, 10);
    this.showQRScanner = false;
    this.almacenamientoService.getAlmacenamiento(id).subscribe(almacenamientoEncontrado => {
      this.inventarioForm.setValue({
        almacenamiento: almacenamientoEncontrado.id,
        cantidad: this.inventarioForm.value.cantidad,
        precio: this.inventarioForm.value.precio,
        fechaCaducidad: this.inventarioForm.value.fechaCaducidad
      })
    });
    this.action.stop()
  }


}
