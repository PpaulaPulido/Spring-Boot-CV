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
