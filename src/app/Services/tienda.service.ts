import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Constants } from 'src/app/utils/constant';
import Swal from 'sweetalert2';
import { Tienda } from 'src/app/models/Tienda';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  constructor(private http: HttpClient, private router: Router) { }

  getTiendas(): Observable<Tienda[]> {
    return this.http.get<Tienda[]>(Constants.API_URL_TIENDA);
  }

  getTienda(id: number): Observable<Tienda> {
    const url = `${Constants.API_URL_TIENDA}/${id}`;
    return this.http.get<Tienda>(url).pipe(
      catchError(e => {
        return throwError(e)
      })
    );
  }

  async existeTienda(id: number): Promise<boolean> {
    let existe = false;
    this.getTienda(id).subscribe(p => {
      existe = true;
    }, error => {
      existe = false;
    })
    return existe;
  }

  crearTienda(producto: Tienda): Observable<Tienda> {
    return this.http.post<Tienda>(Constants.API_URL_TIENDA, producto).pipe(
      map((response: any) => response.producto as Tienda),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  updateTienda(producto: Tienda): Observable<Tienda> {
    const url = `${Constants.API_URL_TIENDA}/${producto.id}`;
    return this.http.put<Tienda>(url, producto, { headers: Constants.httpHeaders }).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  deleteTienda(id: number): Observable<{}> {
    const url = `${Constants.API_URL_TIENDA}/${id}`;
    return this.http.delete(url, { headers: Constants.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
