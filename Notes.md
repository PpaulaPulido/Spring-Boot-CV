## 🗂 Repositorio  
**Responsabilidad:** interactuar directamente con la base de datos.  
- Realiza consultas (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).  
- No contiene lógica de negocio, solo persistencia de datos.  

---

## 🛠 Servicio  
**Responsabilidad:** manejar la lógica de negocio y coordinar operaciones.  
- Llama al repositorio para acceder o modificar datos.  
- Contiene validaciones y reglas del negocio.  
- Ejemplo: lógica de registro, comprobaciones, cálculos.  

---

## 🌐 Controlador  
**Responsabilidad:** manejar las peticiones HTTP y generar respuestas.  
- Recibe datos desde el cliente.  
- Usa el servicio para ejecutar operaciones.  
- Devuelve respuestas HTTP (JSON, HTML, redirecciones, etc.).  

---

## 🎨 SweetAlert  
**Responsabilidad:** mostrar alertas elegantes en el frontend.  
- Biblioteca JavaScript para mostrar mensajes reemplazando el alert

## Base de datos
-Name: curriculum_craft
-Por medio de los models usando @Entity crea de forma automatica la tabla con sus respectivos campos, no requiere crear tabla de datos de forma manual

## Security config
Definir cómo se autentican los usuarios (con JpaUserDetailsService).
Configurar qué rutas son públicas y cuáles requieren autenticación.
Definir la lógica de login y logout.
Usar BCrypt para encriptar contraseñas.

# 🏗 Capas de la aplicación y sus relaciones

## 🌐 Cliente
**Responsabilidad:** iniciar la interacción con la aplicación.  
- Puede ser FrontEnd, Postman, App móvil, etc.  
- Envía peticiones HTTP y recibe respuestas.  

---

## 🎨 Controlador
**Responsabilidad:** manejar las peticiones HTTP y generar respuestas.  
- Recibe datos desde el cliente.  
- Usa DTO para mapear la entrada y salida de datos.  
- Llama al servicio para ejecutar la lógica de negocio.  
- Devuelve respuestas HTTP (JSON, HTML, redirecciones, etc.).  

---

## 📦 DTO (Data Transfer Object)
**Responsabilidad:** transportar datos entre capas.  
- Contiene los datos que viajan entre cliente y servidor.  
- Tiene anotaciones de validación como `@ValidEmail` o `@PasswordMatches`.  
- Se combina con `@Valid` para disparar la validación automática.  

---

## ✅ Validation
**Responsabilidad:** validar datos de los DTO antes de llegar al servicio.  
- Validaciones estándar:
  - `@NotBlank`, `@Size`, `@Email`  
- Validaciones personalizadas:
  - `@ValidEmail` → `EmailValidator`  
  - `@PasswordMatches` → `PasswordMatchesValidator`  
- Evita que datos inválidos entren al servicio y la base de datos.

---

## 🛠 Service
**Responsabilidad:** manejar la lógica de negocio y coordinar operaciones.  
- Llama al repositorio para acceder o modificar datos.  
- Contiene validaciones adicionales y reglas del negocio.  
- Ejemplo: lógica de registro, comprobaciones, cálculos, procesamiento de imágenes.  

---

## 🗂 Repository
**Responsabilidad:** interactuar directamente con la base de datos.  
- Extiende `JpaRepository` o similar.  
- Realiza consultas SQL (SELECT, INSERT, UPDATE, DELETE) automáticamente usando JPA/Hibernate.  
- No contiene lógica de negocio, solo persistencia de datos.  

---

## 🧱 Model (Entidad)
**Responsabilidad:** representar las tablas de la base de datos.  
- Se mapean con `@Entity`.  
- Ejemplos: `User`, `Summary`, `TechnicalSkill`, `SoftSkill`.  
- Contienen campos, relaciones (`@OneToMany`, `@ManyToOne`) y reglas de persistencia.  

---

## 💾 Base de datos
**Responsabilidad:** almacenar datos permanentes.  
- Las tablas se crean automáticamente usando las entidades JPA.  
- Ejemplo: tabla `users`, `summaries`, `technical_skills`, etc.  

---

## 🔐 Security (Spring Security)
**Responsabilidad:** interceptar peticiones entre cliente y controlador.  
- Maneja autenticación y autorización.  
- Configura rutas públicas y privadas.  
- Define login y logout.  
- Usa `BCrypt` para encriptar contraseñas.  
- Carga usuarios desde la base de datos mediante `UserDetailsService`.

---

## ⚡ Flash Attributes
**Responsabilidad:** pasar datos entre vistas durante un redireccionamiento HTTP.  
- Se usan cuando se hace `redirect` y se quiere conservar información temporal (mensajes, formularios, errores).  

---

## 🔑 Resumen de responsabilidades por capa

| Capa        | Función principal                                               |
|------------|----------------------------------------------------------------|
| Controller | Recibe peticiones HTTP, usa DTO y devuelve respuestas          |
| DTO        | Transporta datos entre capas, aplica validaciones              |
| Validation | Valida datos del DTO (estándar y personalizado)               |
| Service    | Contiene la lógica de negocio, orquesta llamadas a repositorios |
| Repository | Interactúa con la BD usando JPA/Hibernate                     |
| Model      | Entidad JPA mapeada a la tabla de la base de datos            |
| Security   | Maneja autenticación y autorización                             |
| Base de datos | Almacena los datos permanentes                               |

---
## Recuperacion de datos
Base de Datos → Entidades JPA → Repositories → Services → Controllers → DTOs → JSON → Frontend (JavaScript)