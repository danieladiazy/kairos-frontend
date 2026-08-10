export function limpiarTelefono(value: string): string {
  return value.replace(/[^0-9+ ()-]/g, "");
}

export function errorTelefono(value: string): string {
  if (!value.trim()) return "El teléfono es obligatorio";
  const cantidadDigitos = value.replace(/\D/g, "").length;
  if (cantidadDigitos < 10 || cantidadDigitos > 15) {
    return "Ingresa un teléfono válido de 10 a 15 dígitos";
  }
  return "";
}

export const claseCampo = (error?: string) =>
  `w-full rounded-lg border bg-input-background ${error ? "border-destructive focus:ring-destructive/30" : "border-border focus:ring-primary/30"}`;

