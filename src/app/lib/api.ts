// ============================================================================
// CLIENTE DE API DE KAIROS
// ============================================================================
// Este archivo es el UNICO lugar del frontend que habla directamente con el
// backend de Java (via fetch/HTTP). Todas las pantallas importan funciones
// de aqui en vez de escribir sus propias llamadas fetch(); asi, si algun dia
// cambia como se llama al backend, solo se edita este archivo.
//
// Estructura del archivo:
//   1. Manejo de sesion (guardar/leer el token JWT en localStorage)
//   2. Funcion generica request() que hace el fetch real
//   3. Tipos (interfaces) que describen la forma de los datos del backend
//   4. Funciones especificas: autenticacion, negocios, servicios, citas
// ============================================================================

// URL base del backend. Se puede sobreescribir con la variable de entorno
// VITE_API_URL (ver archivo .env); si no esta definida, usa localhost:8080
// por defecto (para desarrollo local).
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// ---------- Manejo de sesion ----------
// El token JWT y los datos basicos del usuario se guardan en localStorage
// (memoria persistente del navegador) para que la sesion sobreviva aunque
// se recargue la pagina. Esto es equivalente a como Kairos guarda la sesion
// del lado del backend, solo que aqui es del lado del navegador.

function getToken(): string | null {
  return localStorage.getItem("kairos_token");
}

// Se llama automaticamente despues de un login o registro exitoso (ver
// registrar() e iniciarSesion() mas abajo).
function setSesion(token: string, usuarioId: number, nombre: string, rol: string) {
  localStorage.setItem("kairos_token", token);
  localStorage.setItem("kairos_usuario_id", String(usuarioId));
  localStorage.setItem("kairos_nombre", nombre);
  localStorage.setItem("kairos_rol", rol);
}

// Se llama al cerrar sesion (ver App.tsx, handleLogout). Borra todo lo
// relacionado a la sesion actual del navegador.
export function limpiarSesion() {
  localStorage.removeItem("kairos_token");
  localStorage.removeItem("kairos_usuario_id");
  localStorage.removeItem("kairos_nombre");
  localStorage.removeItem("kairos_rol");
}

// Permite que cualquier pantalla consulte quien es el usuario actual sin
// tener que leer localStorage directamente en cada componente.
export function obtenerSesion() {
  return {
    token: getToken(),
    usuarioId: localStorage.getItem("kairos_usuario_id"),
    nombre: localStorage.getItem("kairos_nombre"),
    rol: localStorage.getItem("kairos_rol"),
  };
}

// ---------- Funcion generica de peticiones ----------
// Todas las demas funciones de este archivo (registrar, buscarNegocios,
// reservarCita, etc.) usan esta funcion por dentro. Aqui se centraliza:
//   - Armar la URL completa (API_URL + la ruta que se le pase).
//   - Agregar automaticamente el header "Authorization: Bearer <token>"
//     si hay una sesion iniciada (el backend lo necesita para los
//     endpoints protegidos, ver JwtAuthFilter.java del lado del backend).
//   - Convertir la respuesta de JSON a un objeto de TypeScript.
//   - Si el backend respondio un error, leer su mensaje (ver
//     GlobalExceptionHandler.java del backend) y lanzarlo como una
//     excepcion de JavaScript, para que cada pantalla lo pueda mostrar
//     con un simple try/catch.
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let mensaje = "Ocurrio un error";
    try {
      const data = await response.json();
      mensaje = data.mensaje || mensaje;
    } catch {
      // el cuerpo no era JSON, se usa el mensaje por defecto
    }
    if (response.status === 401) {
      limpiarSesion();
      window.dispatchEvent(new CustomEvent("kairos:sesion-expirada"));
      mensaje = "Tu sesion expiro. Inicia sesion nuevamente.";
    }
    throw new Error(mensaje);
  }

  // 204 No Content: el backend respondio correctamente pero sin cuerpo
  // (por ejemplo, al cancelar una cita o eliminar un servicio). Intentar
  // leer JSON de una respuesta vacia daria error, por eso se corta aqui.
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ---------- Tipos ----------
// Estas interfaces son la version en TypeScript de los DTOs/entidades que
// devuelve el backend en Java. No es el mismo codigo, pero describen la
// misma forma de datos, para que el editor detecte errores (por ejemplo,
// si en una pantalla se intenta leer "servicio.nombree" con doble "e",
// TypeScript avisa antes de siquiera correr la app).

export type Rol = "CLIENTE" | "NEGOCIO" | "CLIENTEEMPRESA";
export type TipoAcceso = "client" | "company-client" | "service";
export type EstadoCita = "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | "COMPLETADA";

export interface AuthResponse {
  token: string;
  usuarioId: number;
  nombre: string;
  rol: Rol;
}

export interface Negocio {
  id: number;
  nombre: string;
  categoria: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  imagenUrl?: string;
  horarios?: HorarioServicio[];
}

export type DiaSemana = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface HorarioServicio {
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionMinutos: number;
  categoria?: string;
  activo?: boolean;
  imagenUrl?: string;
  adomicilio?: boolean;
  aDomicilio?: boolean;
  horarios?: HorarioServicio[];
  negocio?: Negocio;
}

export interface Cita {
  id: number;
  fecha: string;
  hora: string;
  estado: EstadoCita;
  notas?: string;
  servicio?: Servicio;
  cliente?: { id: number; nombre: string; rol?: Rol; descuentoEmpresarialActivo?: boolean };
}

export type EstadoAsociacionEmpresa = "PENDIENTE" | "APROBADA" | "RECHAZADA";

export interface AsociacionEmpresa {
  id: number;
  clienteId: number;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  negocioId: number;
  negocioNombre: string;
  estado: EstadoAsociacionEmpresa;
  descuentoActivo: boolean;
  solicitadoEn: string;
  respondidoEn?: string;
}

// ---------- Autenticacion ----------
// Corresponden a AuthController.java (POST /api/auth/registro y
// POST /api/auth/login) del lado del backend.

export async function registrar(datos: {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  rol: Rol;
  negocioId?: number;
}): Promise<AuthResponse> {
  const resultado = await request<AuthResponse>("/auth/registro", {
    method: "POST",
    body: JSON.stringify(datos),
  });
  // En cuanto el backend confirma el registro, se guarda la sesion de
  // una vez (asi el usuario no tiene que loguearse por separado despues
  // de registrarse).
  setSesion(resultado.token, resultado.usuarioId, resultado.nombre, resultado.rol);
  return resultado;
}

export async function iniciarSesion(email: string, password: string): Promise<AuthResponse> {
  const resultado = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setSesion(resultado.token, resultado.usuarioId, resultado.nombre, resultado.rol);
  return resultado;
}


export interface UsuarioPerfil {
  id: number; nombre: string; email: string; telefono?: string; direccion?: string;
  fechaNacimiento?: string; imagenUrl?: string; rol: Rol; creadoEn?: string;
}

export function obtenerMiPerfil() { return request<UsuarioPerfil>("/usuarios/mi-perfil"); }
export function guardarMiPerfil(datos: Omit<UsuarioPerfil, "id" | "rol" | "creadoEn">) {
  return request<UsuarioPerfil>("/usuarios/mi-perfil", { method: "PUT", body: JSON.stringify(datos) });
}
// ---------- Negocios ----------
// Corresponden a NegocioController.java del backend.

// Busqueda publica de negocios (no requiere sesion iniciada). Se le puede
// pasar una categoria o un texto de busqueda; si no se manda nada,
// regresa todos los negocios.
export function buscarNegocios(params: { categoria?: string; busqueda?: string } = {}) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return request<Negocio[]>(`/negocios${query ? `?${query}` : ""}`);
}

export function obtenerNegocio(id: number) {
  return request<Negocio>(`/negocios/${id}`);
}

// Crea o actualiza el negocio del usuario con sesion iniciada (debe ser
// de rol NEGOCIO). El backend identifica de quien es el negocio a partir
// del token, no de ningun id que se mande aqui.
export function guardarMiNegocio(datos: {
  nombre: string;
  categoria: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  imagenUrl?: string;
  horarios?: HorarioServicio[];
}) {
  return request<Negocio>("/negocios/mi-negocio", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function obtenerMiNegocio() {
  return request<Negocio>("/negocios/mi-negocio");
}

export async function obtenerEstadoAsociacionEmpresa() {
  const resultado = await request<AsociacionEmpresa | undefined>("/asociaciones-empresa/mi-estado");
  return resultado || null;
}

export function listarSolicitudesAsociacionEmpresa() {
  return request<AsociacionEmpresa[]>("/asociaciones-empresa/solicitudes-negocio");
}

export function responderSolicitudAsociacionEmpresa(id: number, estado: "APROBADA" | "RECHAZADA") {
  return request<AsociacionEmpresa>(`/asociaciones-empresa/${id}/estado?estado=${estado}`, {
    method: "PATCH",
  });
}

// ---------- Servicios ----------
// Corresponden a ServicioController.java del backend.

export function listarServiciosDeNegocio(negocioId: number) {
  return request<Servicio[]>(`/servicios?negocioId=${negocioId}`);
}

export function obtenerServicio(id: number) {
  return request<Servicio>(`/servicios/${id}`);
}

export function buscarServicios(busqueda: string, categoria = "") {
  const params = new URLSearchParams();
  if (busqueda.trim()) params.set("busqueda", busqueda.trim());
  if (categoria.trim()) params.set("categoria", categoria.trim());
  const query = params.toString();
  return request<Servicio[]>(`/servicios${query ? `?${query}` : ""}`);
}

// Solo funciona si hay sesion iniciada con rol NEGOCIO (el backend lo
// valida; si un CLIENTE intenta llamar esto, el backend responde error).
export function crearServicio(datos: {
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionMinutos: number;
  categoria?: string;
  activo?: boolean;
  imagenUrl?: string;
  aDomicilio?: boolean;
}) {
  return request<Servicio>("/servicios", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

export function actualizarServicio(id: number, datos: {
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionMinutos: number;
  categoria?: string;
  activo?: boolean;
  imagenUrl?: string;
  aDomicilio?: boolean;
}) {
  return request<Servicio>(`/servicios/${id}`, {
    method: "PUT",
    body: JSON.stringify(datos),
  });
}

export function eliminarServicio(id: number) {
  return request<void>(`/servicios/${id}`, { method: "DELETE" });
}

// ---------- Citas ----------
// Corresponden a CitaController.java del backend. Todos estos endpoints
// requieren sesion iniciada (cliente o negocio, segun el caso).

// Usado por el cliente al reservar (ver BookingScreen.tsx).
export function reservarCita(datos: {
  servicioId: number;
  fecha: string; // formato yyyy-MM-dd
  hora: string;  // formato HH:mm
  notas?: string;
}) {
  return request<Cita>("/citas", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

// Citas del cliente con sesion iniciada (ver AppointmentsScreen.tsx).
export function misCitas() {
  return request<Cita[]>("/citas/mis-citas");
}

export function cancelarCita(id: number) {
  return request<void>(`/citas/${id}/cancelar`, { method: "PATCH" });
}

// Citas del negocio con sesion iniciada, opcionalmente filtradas por
// fecha (ver AgendaScreen.tsx del lado negocio).
export function agendaDelNegocio(fecha?: string) {
  return request<Cita[]>(`/citas/agenda${fecha ? `?fecha=${fecha}` : ""}`);
}

// Usado por el negocio para confirmar, rechazar o completar una cita.
export function cambiarEstadoCita(id: number, estado: EstadoCita) {
  return request<Cita>(`/citas/${id}/estado?estado=${estado}`, { method: "PATCH" });
}

export function reagendarCita(id: number, fecha: string, hora: string) { return request<Cita>(`/citas/${id}/reagendar`, { method: "PATCH", body: JSON.stringify({ fecha, hora }) }); }
