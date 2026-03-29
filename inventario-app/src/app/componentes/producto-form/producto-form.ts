import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../servicios/producto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../../modelos/producto';

@Component({
  selector: 'app-producto-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm implements OnInit{
  private productoService =  inject(ProductoService);
  private router = inject(Router);
  private route =  inject(ActivatedRoute);

  producto = signal<Producto>( {
    descripcion: '',
    precio: 0,
    existencia: 0
  } );

  esEdicion = signal<boolean>(false);
  titulo = signal<string>('Nuevo Producto');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id){ //id != null => es edicion
      this.esEdicion.set(true);
      this.titulo.set('Editar Producto');
      this.productoService.getProducto(Number(id)).subscribe( {
        next: (data) => this.producto.set(data),
        error: (err) => console.error('Error al cargar producto', err)
      } );
    }
  }

  guardarProducto(): void {
    if(this.esEdicion()){ //si es edicion, se actualiza, sino se crea
      this.productoService.actualizarProducto(
        this.producto().idProducto!,
        this.producto()
      ).subscribe( {
        next: () => this.router.navigate( ['/productos'] ),
        error: (err) => console.error('Error al actualizar producto', err)
      });

    }
    else{
      this.productoService.crearProducto(this.producto()).subscribe({
        next: () => this.router.navigate( ['/productos'] ),
        error: (err) => console.error('Error al crear producto', err)
      });
    }
  }

  cancelar(): void {
    this.router.navigate( ['/productos'] );
  }
  
  //Metodo helper por que signal es inmutable, no se puede modificar directamente el objeto producto, se debe crear uno nuevo con los cambios
  actualizarCampo(campo: keyof Producto, valor: any): void {
    this.producto.update( prod => {
      return { ...prod, [campo]: valor };
    });
  }

  // Sin actualizarCampo tendríamos que escribir esto cada vez:
  //this.producto.update(p => ({ ...p, descripcion: valor }));

  // Con actualizarCampo es genérico para cualquier campo:
  //this.actualizarCampo('descripcion', valor);

}
