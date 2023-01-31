import { Component } from '@angular/core';
import {Cliente} from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent {
  clientes: Cliente[];
  paginador: any;
  constructor(private clienteService: ClienteService, private activateRoute: ActivatedRoute){

  }

  ngOnInit(): void {
    
    this.activateRoute.paramMap.subscribe( params =>{
      let page:number = +params.get('page');
      if(!page){
        page =  0;
      }

      this.clienteService.getClientes(page).subscribe(
        //function (clientes){this.clientes = clientes}
        response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        }
      );
    }
    );
   

  }

  delete(cliente: Cliente): void{
    swal.fire({
      title: '¿Estas seguro?',
      text: `¿Estas seguro de eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminarlo!',
      cancelButtonText:'No,Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          response=>{
            this.clientes=this.clientes.filter(cli => cli!= cliente);
            swal.fire(
              'Eliminado!',
              'El cliente ha sido eliminado.',
              'success'
            )
          }
        );
        
      }
    })
  }
}
