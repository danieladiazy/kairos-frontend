const pad = (value: number) => String(value).padStart(2, "0");

/** Devuelve la fecha local de hoy sin convertirla a UTC. */
export function todayDateOnly() {
  const today = new Date();
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
}

/**
 * Convierte yyyy-MM-dd en una fecha local. Usar new Date("yyyy-MM-dd")
 * interpreta el valor como UTC y puede mostrar el día anterior o siguiente.
 */
export function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function formatDateOnly(value: string, options: Intl.DateTimeFormatOptions) {
  return parseDateOnly(value).toLocaleDateString("es-MX", options);
}

export function parseAppointmentDateTime(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes, seconds = 0] = time.slice(0, 8).split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds, 0);
}
