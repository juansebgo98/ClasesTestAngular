import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Inventario } from '../Inventario';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  

  private apiUrl = 'http://192.168.18.158:8080/api/inventarios';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Metodo para obetener todos los inventarios desde el Api Rest
   * @returns Lista de inventarios
   */
  getInventarios(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.apiUrl);
  }

  /**
   * Metodo para obtener un inventario por Id desde el Api Rest
   * @param id id de inventario
   * @returns 
   */
  getInventario(id: number): Observable<Inventario> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Inventario>(url).pipe(
        catchError(e=>{
            this.router.navigate(['/inventario']);
            console.error(e.error.mensaje);
            Swal.fire('Error al obtener',e.error.mensaje,'error');
            return throwError(e)
          })
    );
  }
  getInventarioProductoAlmacenamiento(idProducto: number, id: number) {
    const url = `${this.apiUrl}/producto/${idProducto}/almacenamiento/${id}`;
    return this.http.get<Inventario[]>(url).pipe(
        catchError(e=>{
            this.router.navigate(['/inventario']);
            console.error(e.error.mensaje);
            Swal.fire('Error al obtener inventario',e.error.mensaje,'error');
            return throwError(e)
          })
    );
  }
  /**
   * Metodo para obtener inventario de un producto desde el Api Rest
   * @param id 
   * @returns 
   */
  getInventarioProducto(id: number): Observable<Inventario[]> {
    const url = `${this.apiUrl}/producto/${id}`;
    return this.http.get<Inventario[]>(url).pipe(
        catchError(e=>{
            this.router.navigate(['/inventario']);
            console.error(e.error.mensaje);
            Swal.fire('Error al obtener inventario',e.error.mensaje,'error');
            return throwError(e)
          })
    );
  }

  /**
   * Metodo para crear un nuevo Inventario desde el Api Rest
   * @param inventario 
   * @returns 
   */
  crearInventario(inventario: Inventario): Observable<Inventario> {
    return this.http.post<Inventario>(this.apiUrl, inventario).pipe(
        map((response: any) => response.producto as Inventario),
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

  /**
   * Metodo para acutualizar un inventario desde el Api Rest
   * @param inventario 
   * @returns 
   */
  updateInventario(inventario: Inventario): Observable<Inventario> {
    const url = `${this.apiUrl}/${inventario.id}`;
    return this.http.put<Inventario>(url, inventario, {headers: this.httpHeaders}).pipe(
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

  /**
   * Metodo para aumentar la cantidad de un inventario desde el Api Rest
   * @param inventario 
   * @returns 
   */
  aumentarInventario(inventario: Inventario, cantidad: number): Observable<Inventario> {
    const url = `${this.apiUrl}/${inventario.id}/aumentar/${cantidad}`;
    return this.http.put<Inventario>(url, inventario, {headers: this.httpHeaders}).pipe(
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

  /**
   * Metodo para reducir la cantidad de un inventario desde el Api Rest
   * @param inventario 
   * @returns 
   */
  reduceInventario(inventario: Inventario, cantidad: number): Observable<Inventario> {
    const url = `${this.apiUrl}/${inventario.id}/reducir/${cantidad}`;
    return this.http.put<Inventario>(url, inventario, {headers: this.httpHeaders}).pipe(
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

  /**
   * Metodo para eliminar inventario desde el Api Rest
   * @param id 
   * @returns 
   */
  deleteInventario(id: number): Observable<{}> {
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
