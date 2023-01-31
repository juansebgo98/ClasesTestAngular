import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent {

  public cliente:Cliente = new Cliente();
  public titulo: string ='Crear cliente';

  public errores: string[];
  
  constructor(private clienteService: ClienteService, private router:Router, private activateRoute:ActivatedRoute){}


  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void{
    this.activateRoute.params.subscribe(
      params=>{
        let id = params['id']
        if(id){
          this.clienteService.getCliente(id).subscribe((cliente)=>this.cliente=cliente)
        }
      }
    );
  }

  public crear(): void{

    this.clienteService.crear(this.cliente).subscribe({
      next: (cliente) => {
        this.router.navigate(['/clientes'])
        swal.fire('Nuevo cliente', `Cliente ${cliente.nombre} creado con éxito`,'success')
      },
      error: (err) =>{
        this.errores = err.error.errors as string[];
        console.error('Codigo error desde backend: '+err.status);
        console.error(err.errors);
      }
    });
  }

  public update():void{
    this.clienteService.update(this.cliente).subscribe(
      json=>{
        this.router.navigate(['/clientes'])
        swal.fire('Cliente actualizado', `Cliente ${json.cliente.nombre} actualizado con éxito`,'success')
      },
      err=>{
        this.errores = err.error.errors as string[];
        console.error('Codigo error desde backend: '+err.status);
        console.error(err.error.errors);
      }
    );
  }
}
