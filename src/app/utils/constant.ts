import { HttpHeaders } from "@angular/common/http";

export class Constants {
  //API ENDPOINTS PRODUCTOS
  public static readonly API_DATOS_PRODUCTOS = 'https://world.openfoodfacts.org/api/v2/product/';

  //API ENDPOINTS APLICACION

  //public static readonly API_URL = 'http://100.79.195.105/api';
  public static readonly API_URL = 'https://despensaback.duckdns.org/api';
  public static readonly API_URL_PRODUCTO = Constants.API_URL + '/productos';
  public static readonly API_URL_TIENDA = Constants.API_URL + '/tiendas';
  public static readonly API_URL_INVENTARIO = Constants.API_URL + '/inventarios';
  public static readonly API_URL_ALMACENAMIENTO = Constants.API_URL + '/almacenamiento';
  /*
    public static readonly API_URL = 'http://localhost:8080/api';
    public static readonly API_URL_PRODUCTO = 'http://localhost:8080/api/productos';
    public static readonly API_URL_INVENTARIO = 'http://localhost:8080/api/inventarios';
    public static readonly API_URL_ALMACENAMIENTO = 'http://localhost:8080/api/almacenamiento';
  */
  public static readonly httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
}

