import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, pipe, throwError } from 'rxjs';
import { Producto } from '../Producto';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://192.168.18.158:8080/api/productos';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  constructor(private http: HttpClient, private router: Router) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getProducto(id: number): Observable<Producto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Producto>(url).pipe(
        catchError(e=>{
            this.router.navigate(['/productos']);
            console.error(e.error.mensaje);
            Swal.fire('Error al obtener',e.error.mensaje,'error');
            return throwError(e)
          })
    );
  }

  getProductoAlmacenamiento(id: number): Observable<Producto[]> {
    const url = `${this.apiUrl}/almacenamiento/${id}`;
    return this.http.get<Producto[]>(url).pipe(
        catchError(e=>{
            this.router.navigate(['/productos']);
            console.error(e.error.mensaje);
            Swal.fire('Error al obtener',e.error.mensaje,'error');
            return throwError(e)
          })
    );;
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto).pipe(
        map((response: any) => response.producto as Producto),
        catchError(e=>{
          if(e.status == 400){
            return throwError(e);
          }
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error,'error');
          return throwError(e);
        })
      );
  }

  updateProducto(producto: Producto): Observable<Producto> {
    const url = `${this.apiUrl}/${producto.id}`;
    return this.http.put<Producto>(url, producto, {headers: this.httpHeaders}).pipe(
        catchError(e=>{
          if(e.status == 400){
            return throwError(e);
          }
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error,'error');
          return throwError(e);
        })
      );
  }

  deleteProducto(id: number): Observable<{}> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, {headers: this.httpHeaders}).pipe(
        catchError(e=>{
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error,'error');
          return throwError(e);
        })
      );
  }
}
