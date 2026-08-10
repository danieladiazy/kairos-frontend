import type { Cita, Rol } from "./api";

export const DESCUENTO_CLIENTE_EMPRESA = 0.10;

export function esClienteEmpresa(rol: string | null | undefined): rol is "CLIENTEEMPRESA" {
  return rol === "CLIENTEEMPRESA";
}

export function aplicarDescuentoEmpresa(precio: number, aplica: boolean): number {
  const valor = Number(precio) || 0;
  const total = aplica ? valor * (1 - DESCUENTO_CLIENTE_EMPRESA) : valor;
  return Math.round(total * 100) / 100;
}

export function precioParaCita(cita: Cita): number {
  return aplicarDescuentoEmpresa(
    Number(cita.servicio?.precio || 0),
    esClienteEmpresa(cita.cliente?.rol),
  );
}

export function etiquetaRol(rol: Rol): string {
  if (rol === "NEGOCIO") return "Negocio";
  if (rol === "CLIENTEEMPRESA") return "Cliente asociado a empresa";
  return "Cliente";
}
