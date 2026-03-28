import { Routes } from '@angular/router';
import { ProductoLista } from './componentes/producto-lista/producto-lista';
import { ProductoForm } from './componentes/producto-form/producto-form';

export const routes: Routes = [
    { path: '', redirectTo: 'productos', pathMatch: 'full' },
    { path: 'productos', component: ProductoLista },
    { path: 'productos/nuevo', component: ProductoForm },
    { path: 'productos/editar/:id',  component: ProductoForm }
];
