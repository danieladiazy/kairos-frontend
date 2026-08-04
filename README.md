# Kairós — frontend

Aplicación React + TypeScript conectada al backend Spring Boot de Kairós.

```bash
npm install
npm run dev
```

El backend se espera en `http://localhost:8080/api`. Para cambiarlo, copia `.env.example` como `.env` y define `VITE_API_URL`.

La compilación de producción se ejecuta con:

```bash
npm run build
```

Inicio y Explorar muestran servicios activos reales y comparten el mismo detalle. Los flujos autenticados incluyen perfiles, reservas, citas, dashboard del negocio y servicios.

Cada servicio puede configurar días y horas de atención. El detalle público muestra esa disponibilidad y la reserva ofrece únicamente horarios válidos. Calificaciones y reseñas aparecen como una sección visual de “Próximamente”; todavía no guardan información.
