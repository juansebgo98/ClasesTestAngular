import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/utils/constant';
import { Root } from '../models/DatosProducto';

@Injectable({
  providedIn: 'root'
})
export class DatosProductoService {

  constructor(private http: HttpClient, private router: Router) { }

  getDatosProductos(id: number): Observable<Root> {
    return this.http.get<Root>(Constants.API_DATOS_PRODUCTOS+id+'&fields=code,product_name,image_front_url,selected_images');
  }

}
