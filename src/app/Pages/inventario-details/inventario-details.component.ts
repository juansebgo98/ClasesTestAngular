import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
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

    const inventarios = await this.inventarioService.getInventarioProductoAlmacenamiento(this.producto.id, valoresFormulario.almacenamiento.id).toPromise();
    for (let i = 0; i < inventarios.length; i++) {
      const fechaCaducidad = new Date(valoresFormulario.fechaCaducidad);
      fechaCaducidad.setDate(fechaCaducidad.getDate() + 1);
      const fechaCaducidadString = fechaCaducidad.toISOString().substring(0, 10);


      if (new Date(inventarios[i].fechaCaducidad).toISOString().substring(0, 10) === fechaCaducidadString) {
        nuevoInventario = inventarios[i];
        break;
      }
    }
    if (nuevoInventario.id == null) {
      nuevoInventario.producto = this.producto;
      nuevoInventario.almacenamiento = valoresFormulario.almacenamiento;
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

}
