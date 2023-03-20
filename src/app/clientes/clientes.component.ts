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
  public busqueda: string = "";

  clientes: Cliente[];
  paginador: any;
  searchTerm = '';
  filteredProducts: Cliente[];
  
  constructor(private clienteService: ClienteService, private activateRoute: ActivatedRoute){

  }

  ngOnInit(): void {
    
    this.activateRoute.paramMap.subscribe( params =>{
      let page:number = +params.get('page');
      if(!page){
        page =  0;
      }

      /*
      this.clienteService.getClientes(page).subscribe(
        //function (clientes){this.clientes = clientes}
        response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        }
      );
      */
      this.clienteService.getClientes().subscribe(
        //function (clientes){this.clientes = clientes}
        response => {
          this.clientes = response as Cliente[];
          this.paginador = response;
          this.filteredProducts = this.clientes;
        }
      );
    }
    );
  

  }

  
  filterProducts() {
    this.filteredProducts = this.clientes.filter(product =>
      product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  increment(product) {
    product.id++;
  }

  decrement(product) {
    if (product.id > 0) {
      product.id--;
    }
  }
}