export interface Producto {
    idProducto?: number;// Es opcional porque se genera automáticamente en la base de datos
    descripcion: string;
    precio: number;
    existencia: number;

}

/*
export class Producto {
    idProducto?: number;// Es opcional porque se genera automáticamente en la base de datos
    descripcion!: string; // ! indica que esta propiedad se inicializará posteriormente, evitando el error de "Property has no initializer and is not definitely assigned in the constructor."
    precio!: number;
    existencia!: number;

}

*/