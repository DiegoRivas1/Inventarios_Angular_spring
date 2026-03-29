# 🏷️ Sistema de Inventarios

Sistema web fullstack para la gestión de inventario de productos, desarrollado con **Spring Boot** en el backend y **Angular** en el frontend. Permite realizar operaciones CRUD completas sobre productos, con soporte de múltiples monedas y conversión de precios en tiempo real.

---

------------------------------------------------------------------------

## Demo

![Demo](screenshots/sistema_inventario_gif.gif)

------------------------------------------------------------------------

## 🛠️ Tecnologías utilizadas

### Backend
| Tecnología | Versión |
|---|---|
| Java | 25.0.2 |
| Spring Boot | 4.0.4 |
| Spring Data JPA | 4.0.4 |
| Hibernate ORM | 7.2.7.Final |
| MySQL Connector/J | 9.6.0 |
| Lombok | 1.18.44 |
| Apache Tomcat (embebido) | 11.0.18 |
| HikariCP (pool conexiones) | 7.0.2 |

### Frontend
| Tecnología | Versión |
|---|---|
| Angular CLI | 21.2.4 |
| Angular | 21.2.6 |
| Node.js | 24.14.1 |
| TypeScript | 5.9.3 |
| Bootstrap | 5.3.8 (CDN) |

### Base de datos
| Tecnología | Versión |
|---|---|
| MySQL | 8.0.45 |

---

## 📁 Estructura del proyecto

```
Inventarios_Angular_spring/          ← raíz del proyecto
│
├── src/                             ← Backend Spring Boot
│   ├── main/
│   │   ├── java/gm/inventarios/
│   │   │   ├── InventariosApplication.java
│   │   │   ├── controlador/
│   │   │   │   └── ProductoControlador.java
│   │   │   ├── modelo/
│   │   │   │   └── Producto.java
│   │   │   ├── repositorio/
│   │   │   │   └── ProductoRepositorio.java
│   │   │   └── servicio/
│   │   │       ├── IProductoServicio.java
│   │   │       └── ProductoServicio.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── logback-spring.xml
│   └── test/
│
├── inventario-app/                  ← Frontend Angular
│   └── src/
│       ├── app/
│       │   ├── componentes/
│       │   │   ├── producto-lista/
│       │   │   │   ├── producto-lista.ts
│       │   │   │   ├── producto-lista.html
│       │   │   │   └── producto-lista.css
│       │   │   └── producto-form/
│       │   │       ├── producto-form.ts
│       │   │       ├── producto-form.html
│       │   │       └── producto-form.css
│       │   ├── modelos/
│       │   │   ├── producto.ts
│       │   │   └── locale.ts
│       │   ├── pipes/
│       │   │   └── dynamic-currency-pipe.ts
│       │   ├── servicios/
│       │   │   ├── producto.service.ts
│       │   │   └── locale.service.ts
│       │   ├── app.ts
│       │   ├── app.html
│       │   ├── app.config.ts
│       │   └── app.routes.ts
│       ├── environments/
│       │   ├── environment.ts
│       │   └── environment.development.ts
│       └── styles.css
│
├── .env                             ← Variables de entorno (no se sube al repo)
├── .env.example                     ← Plantilla de variables de entorno
├── pom.xml
└── README.md
```

---

## 🏗️ Patrón de diseño y arquitectura

### Backend / Arquitectura en capas

El backend sigue el patrón de **arquitectura en capas** (Layered Architecture), separando responsabilidades:

```
[ Cliente Angular ]
        ↓ HTTP Request
[ Controlador ]  → Recibe peticiones HTTP, delega al servicio
        ↓
[ Servicio ]     → Lógica de negocio, implementa la interfaz
        ↓
[ Repositorio ]  → Acceso a datos con Spring Data JPA
        ↓
[ Modelo ]       → Entidad JPA mapeada a tabla en MySQL
        ↓
[ Base de datos MySQL ]
```

| Capa | Clase | Responsabilidad |
|---|---|---|
| Controlador | `ProductoControlador` | Expone endpoints REST, maneja CORS |
| Servicio | `ProductoServicio` | Lógica de negocio, operaciones CRUD |
| Interfaz | `IProductoServicio` | Contrato del servicio (abstracción) |
| Repositorio | `ProductoRepositorio` | Extiende `JpaRepository`, queries a BD |
| Modelo | `Producto` | Entidad JPA con anotaciones Lombok |

### Frontend / Arquitectura de componentes Angular

El frontend sigue el patrón de **componentes standalone** de Angular 21 con separación en capas:

```
[ app.html ]         → Layout principal con navbar y router-outlet
      ↓
[ app.routes.ts ]    → Enrutamiento a componentes según URL
      ↓
[ Componentes ]      → Lógica de UI y presentación
      ↓
[ Servicios ]        → Llamadas HTTP al backend
      ↓
[ Modelos ]          → Interfaces TypeScript (contratos de datos)
```

| Capa | Archivo | Responsabilidad |
|---|---|---|
| Componente | `producto-lista` | Tabla de productos, eliminar con modal |
| Componente | `producto-form` | Formulario crear/editar producto |
| Servicio | `producto.service.ts` | CRUD HTTP hacia la API REST |
| Servicio | `locale.service.ts` | Gestión de idioma y conversión de moneda |
| Pipe | `dynamic-currency-pipe.ts` | Formato dinámico de moneda según locale |
| Modelo | `producto.ts` | Interface TypeScript del producto |
| Modelo | `locale.ts` | Interface de configuración de locale |

---

## ⚡ Características técnicas destacadas

### Reactividad con Signals (Angular 21)
Angular 21 usa **zoneless** por defecto, eliminando `zone.js`. Para que la vista se actualice automáticamente cuando llegan datos del backend se usan **Signals**:

```typescript
// Sin signal — Angular no detecta el cambio en zoneless
productos: Producto[] = [];
this.productos = data; // ❌ la vista no se actualiza

// Con signal — Angular detecta el cambio automáticamente
productos = signal<Producto[]>([]);
this.productos.set(data); // ✅ la vista se actualiza
```

Los signals actúan como semáforos reactivos: en lugar de que Angular revise todos los componentes constantemente (pull), el signal avisa directamente cuando cambia (push), mejorando el rendimiento.

### Conversión dinámica de monedas
El sistema soporta tres monedas en tiempo real sin recargar la página:

| País | Moneda | Código |
|---|---|---|
| Perú | Sol peruano | PEN |
| España | Euro | EUR |
| Estados Unidos | Dólar | USD |

Implementado con:
- `LocaleService` — signal reactivo del locale actual y tasas de cambio
- `DynamicCurrencyPipe` — pipe impuro (`pure: false`) que reformatea precios al cambiar el locale
- `computed()` — deriva la moneda actual del locale automáticamente

### Base de datos automática
La base de datos se crea automáticamente al iniciar la aplicación gracias a:
```properties
spring.jpa.hibernate.ddl-auto=update
```
Solo es necesario proporcionar las credenciales en el archivo `.env`.

---

## 🔌 API REST — Endpoints

Base URL: `http://localhost:8080/inventario-app`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/productos` | Obtener todos los productos |
| GET | `/productos/{id}` | Obtener producto por ID |
| POST | `/productos` | Crear nuevo producto |
| PUT | `/productos/{id}` | Actualizar producto existente |
| DELETE | `/productos/{id}` | Eliminar producto |

---

## ⚙️ Configuración y variables de entorno
### Backend  `.env`
Copia `.env.example` a `.env` y completa los valores:

```properties
# Aplicación
APP_NAME=inventarios

# Base de datos local
DB_USERNAME=your_user
DB_PASSWORD=your_password
DB_URL=jdbc:mysql://localhost:3306/inventario_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

# Base de datos remota (descomenta para usar)
#DB_USERNAME=remote_user
#DB_PASSWORD=remote_password
#DB_URL=jdbc:mysql://remote_host:3306/inventario_db?sslMode=REQUIRED&serverTimezone=UTC

# Servidor
SERVER_PATH=/
PORT=8080

# Pool de conexiones
CONNECTION_TIMEOUT=10000
MAXIMUM_POOL_SIZE=10

# MySQL root (solo si es necesario)
MYSQL_ROOT_PASSWORD=TU_ROOT_PASSWORD

# CORS y URL base
APP_CORS_ORIGINS=http://localhost:4200
APP_BASE_URL=inventario-app
```

> **Nota:** La base de datos `inventario_db` se crea automáticamente si no existe gracias al parámetro `createDatabaseIfNotExist=true` en la URL de conexión.

### Frontend  `environments/`

Configura ambos archivos con la URL de tu backend:

**`environment.ts`** y **`environment.development.ts`:**
```typescript
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080/inventario-app'
};
```

> En desarrollo ambos archivos tienen el mismo contenido. En producción cambia `apiUrl` a la URL real del servidor y `production: true`.
```typescript
export const environment = {
    production: true,
    apiUrl: 'http://localhost:8080/inventario-app'
};
```

> **Nota:** Los archivos `environment*.ts` están en `.gitignore` — cada desarrollador debe configurarlos localmente.

---

## 🚀 Cómo ejecutar el proyecto

### Prerrequisitos

| Herramienta | Versión mínima | Verificar |
|---|---|---|
| Java JDK | 25 | `java -version` |
| Maven | 3.x | `mvn -version` |
| Node.js | 24 | `node -v` |
| Angular CLI | 21 | `ng version` |
| MySQL | 8.x | `mysql --version` |

### 1. Clonar el repositorio

```bash
git clone https://github.com/DiegoRivas1/Inventarios_Angular_spring.git
cd Inventarios_Angular_spring
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Edita .env con tus credenciales de base de datos
```

### 3. Ejecutar el backend

```bash
# Desde la raíz del proyecto
./mvnw spring-boot:run

# O en Windows
mvnw.cmd spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

### 4. Ejecutar el frontend

```bash
cd inventario-app
npm install
ng serve
```

El frontend estará disponible en: `http://localhost:4200`

---

## 🗺️ Rutas del frontend

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | — | Redirige a `/productos` |
| `/productos` | `ProductoLista` | Lista de todos los productos |
| `/productos/nuevo` | `ProductoForm` | Formulario crear producto |
| `/productos/editar/:id` | `ProductoForm` | Formulario editar producto |

---

## 🔒 Seguridad y buenas prácticas

- Variables sensibles en `.env` — nunca subir al repositorio
- `.env` está en `.gitignore`
- CORS configurado para aceptar solo `http://localhost:4200`
- `environments/` de Angular en `.gitignore` — usar `environment.example.ts` como referencia
- Propiedades de configuración externalizadas en `application.properties` con `${VARIABLE}`
- `readonly` en propiedades que no deben reasignarse en Angular

---

## 📦 Dependencias principales

### Backend (`pom.xml`)
- `spring-boot-starter-data-jpa` — JPA + Hibernate
- `spring-boot-starter-webmvc` — REST API + Tomcat embebido
- `mysql-connector-j` — Driver MySQL
- `lombok` — Reducción de boilerplate (getters, setters, constructores)
- `spring-boot-configuration-processor` — Soporte propiedades personalizadas

### Frontend (`package.json`)
- `@angular/core` — Framework principal
- `@angular/forms` — FormsModule para formularios
- `@angular/router` — Enrutamiento SPA
- `@angular/common/http` — HttpClient para llamadas REST
- Bootstrap 5.3.8 — Estilos base (CDN)