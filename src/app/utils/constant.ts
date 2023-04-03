import { HttpHeaders } from "@angular/common/http";

export class Constants {
    public static readonly API_URL = 'http://localhost:8080/api';
    public static readonly API_URL_PRODUCTO = 'http://localhost:8080/api/productos';
    public static readonly API_URL_INVENTARIO = 'http://localhost:8080/api/inventarios';
    public static readonly API_URL_ALMACENAMIENTO = 'http://localhost:8080/api/almacenamiento';

    public static readonly httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
  }
  