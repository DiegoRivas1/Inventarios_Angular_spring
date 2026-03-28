import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../modelos/producto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {

  //private apiURL = 'http://localhost:8080/api/productos';
  private apiURL = `${environment.apiUrl}/productos`; //readonly solo se aasigna una vez y no se puede modificar
  private http = inject(HttpClient);
  
  //constructor(private readonly http: HttpClient){}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiURL);
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiURL}/${id}`);
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiURL, producto);
  }

  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiURL}/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
