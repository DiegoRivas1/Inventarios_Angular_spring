import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../../modelos/producto';
import { ProductoService } from '../../servicios/producto.service';

import { LocaleService } from '../../servicios/locale.service';//currency, date, number
import { LocaleConfig } from '../../modelos/locale';
import { DynamicCurrencyPipe } from '../../pipes/dynamic-currency-pipe';

@Component({
  selector: 'app-producto-lista',
  imports: [CommonModule, RouterLink, DynamicCurrencyPipe], // *ngFor funciona
  //imports: [RouterLink], // *ngFor no funciona, se usa @for
  templateUrl: './producto-lista.html',
  styleUrl: './producto-lista.css',
})
export class ProductoLista implements OnInit {
  
  private localeService = inject(LocaleService);
  private productoService = inject(ProductoService);

  
  //productos: Producto[] = [];
  productos = signal<Producto[]>([]); //Detecta elk cambio y actualiza esa aprte de la vista (reactivity primitiva) angular 21
  locales = this.localeService.locales;//Idiomas
  localeActual = this.localeService.locale;
  //monedaActual = computed(() => this.localeService.getCurrency());//Usando computed para que se actualice automaticamente cuando cambie el locale
  //private cdr = inject(ChangeDetectorRef);
  //constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.getProductos();
  }

  getProductos(): void {
    this.productoService.getProductos().subscribe( 
      {
        next: (data) => {
              console.log('Datos recibidos:', data);
              //this.productos = data;
              this.productos.set(data);
              //this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al obtener productos:', err)
      }
    );
  }

  eliminarProducto(id: number): void {
    this.productoService.eliminarProducto(id).subscribe( () => {
      this.getProductos();
    });
  }

  cambiarLocale(locale: string) {
    this.localeService.setLocale(locale);
    //location.reload(); // necesario para que Angular actualice pipes
  }

  /*
  precioConvertido(precio: number): number {
    return this.localeService.convertirMoneda(precio);
  }
  */
 //bind hace que siga siedo localService pero con el contexto de producto-lista, es decir, se puede usar como una función normal sin perder el contexto de localeService
  precioConvertido = this.localeService.convertirMoneda.bind(this.localeService); //Otra forma de usar la función de conversión sin necesidad de crear un método adicional, localeService.convertirMoneda(producto.precio)


  //Control de eliminacion con confirmación modal
  productoAEliminar = signal<number | null>(null);

  confirmarEliminar(id: number): void {
    this.productoAEliminar.set(id);
  }

  ejecutarEliminar(): void {
    const id = this.productoAEliminar();
    if (id !== null) {
      this.productoService.eliminarProducto(id).subscribe(() => {
        this.productoAEliminar.set(null);
        this.getProductos();
      });
    }
  }

  cancelarEliminar(): void {
    this.productoAEliminar.set(null);
  }
}
  
