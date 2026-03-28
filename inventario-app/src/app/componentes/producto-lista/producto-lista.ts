import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../../modelos/producto';
import { ProductoService } from '../../servicios/producto.service';


@Component({
  selector: 'app-producto-lista',
  imports: [CommonModule, RouterLink], // *ngFor funciona
  //imports: [RouterLink], // *ngFor no funciona, se usa @for
  templateUrl: './producto-lista.html',
  styleUrl: './producto-lista.css',
})
export class ProductoLista implements OnInit {
  //productos: Producto[] = [];
  productos = signal<Producto[]>([]); //Detecta elk cambio y actualiza esa aprte de la vista (reactivity primitiva) angular 21
  private productoService = inject(ProductoService);
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
}
  
