export const BUSINESS_CATEGORIES = [
  "Belleza y estética",
  "Peluquería y barbería",
  "Uñas",
  "Masajes y spa",
  "Salud y bienestar",
  "Entrenamiento y deporte",
  "Servicios para mascotas",
  "Hogar y mantenimiento",
  "Clases y asesorías",
  "Fotografía y eventos",
  "Tecnología",
  "Otra",
] as const;

export const SERVICE_CATEGORIES = [
  "Corte y peinado",
  "Barbería",
  "Uñas",
  "Maquillaje",
  "Tratamientos faciales",
  "Masajes",
  "Salud y bienestar",
  "Entrenamiento",
  "Mascotas",
  "Hogar",
  "Clases y asesorías",
  "Fotografía y eventos",
  "Tecnología",
  "Otra",
] as const;

export function isPresetCategory(value: string, options: readonly string[]) {
  return options.includes(value);
}
