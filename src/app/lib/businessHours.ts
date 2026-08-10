import type { DiaSemana, HorarioServicio } from "./api";

export const BUSINESS_DAYS: Array<{ value: DiaSemana; label: string; short: string }> = [
  { value: "MONDAY", label: "Lunes", short: "Lun" },
  { value: "TUESDAY", label: "Martes", short: "Mar" },
  { value: "WEDNESDAY", label: "Miércoles", short: "Mié" },
  { value: "THURSDAY", label: "Jueves", short: "Jue" },
  { value: "FRIDAY", label: "Viernes", short: "Vie" },
  { value: "SATURDAY", label: "Sábado", short: "Sáb" },
  { value: "SUNDAY", label: "Domingo", short: "Dom" },
];

export type DaySchedule = { active: boolean; start: string; end: string };
export type ScheduleState = Record<DiaSemana, DaySchedule>;

export function horariosPredeterminados(): ScheduleState {
  return Object.fromEntries(BUSINESS_DAYS.map((day) => [
    day.value,
    { active: day.value !== "SUNDAY", start: "09:00", end: day.value === "SATURDAY" ? "14:00" : "18:00" },
  ])) as ScheduleState;
}

export function horariosDesdeApi(items?: HorarioServicio[]): ScheduleState {
  const result = Object.fromEntries(BUSINESS_DAYS.map((day) => [day.value, { active: false, start: "09:00", end: "18:00" }])) as ScheduleState;
  (items || []).forEach((item) => {
    result[item.diaSemana] = { active: true, start: item.horaInicio.slice(0, 5), end: item.horaFin.slice(0, 5) };
  });
  return items?.length ? result : horariosPredeterminados();
}

export function horariosParaApi(schedules: ScheduleState): HorarioServicio[] {
  return BUSINESS_DAYS.filter((day) => schedules[day.value].active).map((day) => ({
    diaSemana: day.value,
    horaInicio: schedules[day.value].start,
    horaFin: schedules[day.value].end,
  }));
}

export function errorHorarios(schedules: ScheduleState): string {
  const activos = BUSINESS_DAYS.filter((day) => schedules[day.value].active);
  if (!activos.length) return "Activa al menos un día de atención";
  if (activos.some((day) => schedules[day.value].start >= schedules[day.value].end)) {
    return "La hora de apertura debe ser anterior a la de cierre";
  }
  return "";
}

