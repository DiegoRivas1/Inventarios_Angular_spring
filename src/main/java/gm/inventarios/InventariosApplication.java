package gm.inventarios;

import gm.inventarios.modelo.Producto;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class InventariosApplication {

	public static void main(String[] args) {
		SpringApplication.run(InventariosApplication.class, args);

		//Prueba lombok
		Producto producto = new Producto();
		producto.setDescripcion("Camisa");
		producto.setPrecio(600.0);
		producto.setExistencia(120);

		//Imprimir
		System.out.println("producto = " + producto);
	}

}
