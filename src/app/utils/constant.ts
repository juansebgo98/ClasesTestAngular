import { HttpHeaders } from "@angular/common/http";

export class Constants {
    public static readonly API_URL = 'http://192.168.18.243:8081/api';
    public static readonly API_URL_PRODUCTO = 'http://192.168.18.243:8081/api/productos';
    public static readonly API_URL_INVENTARIO = 'http://192.168.18.243:8081/api/inventarios';
    public static readonly API_URL_ALMACENAMIENTO = 'http://192.168.18.243:8081/api/almacenamiento';

    public static readonly httpHeaders = new HttpHeaders({'Content-Type':'application/json'})
  }
  