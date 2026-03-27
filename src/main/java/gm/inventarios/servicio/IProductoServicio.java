package gm.inventarios.servicio;

import gm.inventarios.modelo.Producto;

import java.util.List;

public interface IProductoServicio {
    List<Producto> listarProductos();
    Producto buscarProductoPorId(Integer id);
    void guardarProdcuto(Producto producto);
    void eliminarProductoPorId(Integer id);
}
