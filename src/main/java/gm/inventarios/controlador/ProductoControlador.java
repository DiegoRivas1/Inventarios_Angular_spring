package gm.inventarios.controlador;

import gm.inventarios.modelo.Producto;
import gm.inventarios.servicio.ProductoServicio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("inventario-app") //  http://localhost:8080/inventario-app
@CrossOrigin(value = "http://localhost:4200") // Puerto por default de Angular
public class ProductoControlador {// Mnadar informacion al login de nuestra aplicacion
    private static final Logger logger = LoggerFactory.getLogger(ProductoControlador.class);

    @Autowired
    private ProductoServicio productoServicio;

    //http://localhost:8080/inventario-app/productos
    @GetMapping("/productos") // http://localhost:8080/inventario-app/productos
    public List<Producto> obtenerProductos() {
        List<Producto> productos = this.productoServicio.listarProductos();
        logger.info("Obteniendo " + productos.size() + " productos");
        productos.forEach(producto -> logger.info(producto.toString()) );
        return productos;
    }

    //GET por id http://localhost:8080/inventario-app/productos/1
    @GetMapping("/productos/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Integer id){
        Producto producto = this.productoServicio.buscarProductoPorId(id);
        if( producto != null){
            logger.info("Producto encontrado: {}", producto);
            return ResponseEntity.ok(producto);
        }
        return ResponseEntity.notFound().build();
    }
    // POST crear  http://localhost:8080/inventario-app/productos
    @PostMapping("/productos")
    public ResponseEntity<Producto> insertarProducto(@RequestBody Producto producto){
        Producto productoGuardado = this.productoServicio.guardarProducto(producto);
        logger.info("Producto guardado: {}", productoGuardado);
        return ResponseEntity.ok(productoGuardado);
    }

    // PUT actualizar  http://localhost:8080/inventario-app/productos/1
    /*
    @PutMapping("/productos/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Integer id, @RequestBody Producto producto){
        Producto productoBuscado = this.productoServicio.buscarProductoPorId(id);
        if (productoBuscado == null) return ResponseEntity.notFound().build();

        productoBuscado.setDescripcion(producto.getDescripcion());
        productoBuscado.setPrecio(producto.getPrecio());
        productoBuscado.setExistencia(producto.getExistencia());

        this.productoServicio.guardarProdcuto(productoBuscado);
        logger.info("Producto actualizado: {}", productoBuscado);
        return ResponseEntity.ok(productoBuscado);
    }
    */
    // PUT actualizar  http://localhost:8080/inventario-app/productos/1
    @PutMapping("/productos/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Integer id, @RequestBody Producto producto) {
        producto.setIdProducto(id);
        Producto productoActualizado = this.productoServicio.guardarProducto(producto);
        logger.info("Producto actualizado: {}", productoActualizado);
        return ResponseEntity.ok(productoActualizado);
    }
    // DELETE eliminar  http://localhost:8080/inventario-app/productos/1
    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Integer id){
        this.productoServicio.eliminarProductoPorId(id);
        logger.info("Producto eliminado: {}", id);
        return ResponseEntity.noContent().build();
    }







}
