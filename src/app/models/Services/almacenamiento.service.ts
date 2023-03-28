import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Almacenamiento } from '../Almacenamiento';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlmacenamientoService {

  private apiUrl = 'http://192.168.18.158:8080/api/almacenamiento';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  constructor(private http: HttpClient, private router: Router) { }

  getAlmacenamientos(): Observable<Almacenamiento[]> {
    return this.http.get<Almacenamiento[]>(this.apiUrl);
  }

  getAlmacenamiento(id: number): Observable<Almacenamiento> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Almacenamiento>(url).pipe(
        catchError(e=>{
            this.router.navigate(['/almacenamiento']);
            console.error(e.error.mensaje);
            Swal.fire('Error al obtener',e.error.mensaje,'error');
            return throwError(e)
          })
    );
  }

  getAlmacenamientoProducto(id: number): Observable<Almacenamiento[]> {
    const url = `${this.apiUrl}/producto/${id}`;
    return this.http.get<Almacenamiento[]>(url).pipe(
        catchError(e=>{
            this.router.navigate(['/almacenamiento']);
            console.error(e.error.mensaje);
            Swal.fire('Error al obtener almacenamiento '+id,e.error.mensaje,'error');
            return throwError(e)
          })
    );
  }

  crearAlmacenamiento(almacenamiento: Almacenamiento): Observable<Almacenamiento> {
    return this.http.post<Almacenamiento>(this.apiUrl, almacenamiento).pipe(
        map((response: any) => response.almacenamiento as Almacenamiento),
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

  updateAlmacenamiento(almacenamiento: Almacenamiento): Observable<Almacenamiento> {
    const url = `${this.apiUrl}/${almacenamiento.id}`;
    return this.http.put<Almacenamiento>(url, almacenamiento, {headers: this.httpHeaders}).pipe(
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

  deleteAlmacenamiento(id: number): Observable<{}> {
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
