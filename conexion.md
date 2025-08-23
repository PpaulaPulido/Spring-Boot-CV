# 🔗 Flujo y conexión entre capas

        ┌──────────────────────────────┐
        │           CLIENTE             │
        │  (FrontEnd, Postman, App)    │
        └─────────────┬────────────────┘
                      │
                      ▼
        ┌──────────────────────────────┐
        │          SECURITY             │
        │  (Autenticación / Autorización) │
        │  Intercepta peticiones HTTP  │
        └─────────────┬────────────────┘
                      │
                      ▼
        ┌──────────────────────────────┐
        │         CONTROLLER            │
        │ @Controller / @RestController│
        │ - Recibe DTO                  │
        │ - Llama al Service            │
        │ - Devuelve respuesta HTTP     │
        └─────────────┬────────────────┘
                      │
                      ▼
        ┌──────────────────────────────┐
        │             DTO               │
        │ - Transporta datos            │
        │ - Aplica validaciones         │
        │   (@Valid, @NotBlank, etc.)  │
        └─────────────┬────────────────┘
                      │
                      ▼
        ┌──────────────────────────────┐
        │          VALIDATION           │
        │ - Valida campos del DTO       │
        │ - Validaciones custom         │
        │   (@ValidEmail, @PasswordMatches) │
        └─────────────┬────────────────┘
                      │
                      ▼
        ┌──────────────────────────────┐
        │           SERVICE             │
        │ - Lógica de negocio           │
        │ - Orquesta llamadas a Repo    │
        │ - Aplica reglas y cálculos   │
        └─────────────┬────────────────┘
                      │
                      ▼
        ┌──────────────────────────────┐
        │          REPOSITORY           │
        │ - Extiende JpaRepository      │
        │ - Acceso a base de datos      │
        │ - Inserta, consulta, actualiza│
        └─────────────┬────────────────┘
                      │
                      ▼
        ┌──────────────────────────────┐
        │             MODEL             │
        │ - Entidad JPA                 │
        │ - Mapeo a tabla BD            │
        │ - Relaciones entre entidades  │
        └─────────────┬────────────────┘
                      │
                      ▼
        ┌──────────────────────────────┐
        │        BASE DE DATOS          │
        │ - Almacena datos permanentes │
        │ - Tablas: users, summaries,  │
        │   technical_skills, soft_skills │
        └──────────────────────────────┘
