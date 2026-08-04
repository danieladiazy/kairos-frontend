import { useEffect, useState } from "react";
import { Clock, DollarSign, Edit, ImagePlus, MapPin, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  actualizarServicio,
  crearServicio,
  eliminarServicio,
  guardarMiNegocio,
  listarServiciosDeNegocio,
  obtenerMiNegocio,
  obtenerSesion,
  type DiaSemana,
  type HorarioServicio,
  type Servicio as ServicioBackend,
} from "../../lib/api";
import { SERVICE_CATEGORIES, isPresetCategory } from "../../lib/categories";

const DURATIONS = ["15 min", "30 min", "45 min", "60 min", "75 min", "90 min", "105 min", "120 min"];
const DAYS: Array<{ value: DiaSemana; label: string; short: string }> = [
  { value: "MONDAY", label: "Lunes", short: "Lun" },
  { value: "TUESDAY", label: "Martes", short: "Mar" },
  { value: "WEDNESDAY", label: "Miércoles", short: "Mié" },
  { value: "THURSDAY", label: "Jueves", short: "Jue" },
  { value: "FRIDAY", label: "Viernes", short: "Vie" },
  { value: "SATURDAY", label: "Sábado", short: "Sáb" },
  { value: "SUNDAY", label: "Domingo", short: "Dom" },
];

type DaySchedule = { active: boolean; start: string; end: string };
type ScheduleState = Record<DiaSemana, DaySchedule>;
type Service = {
  id: number;
  name: string;
  price: number;
  duration: string;
  category: string;
  description: string;
  active: boolean;
  imageUrl: string;
  atHome: boolean;
  schedules: ScheduleState;
};

type ServiceFormData = Omit<Service, "id" | "price"> & { price: string };

function defaultSchedules(): ScheduleState {
  return Object.fromEntries(DAYS.map((day) => [
    day.value,
    { active: day.value !== "SUNDAY", start: "09:00", end: day.value === "SATURDAY" ? "14:00" : "18:00" },
  ])) as ScheduleState;
}

const emptyForm = (): ServiceFormData => ({
  name: "",
  price: "",
  duration: "60 min",
  category: "Corte y peinado",
  description: "",
  active: true,
  imageUrl: "",
  atHome: false,
  schedules: defaultSchedules(),
});

const toMinutes = (value: string) => parseInt(value, 10) || 60;
const toDuration = (value: number) => DURATIONS.find((item) => parseInt(item, 10) === value) || `${value} min`;
const shortTime = (value: string) => value.slice(0, 5);

function schedulesFromBackend(items?: HorarioServicio[]): ScheduleState {
  const result = Object.fromEntries(DAYS.map((day) => [day.value, { active: false, start: "09:00", end: "18:00" }])) as ScheduleState;
  (items || []).forEach((item) => {
    result[item.diaSemana] = { active: true, start: shortTime(item.horaInicio), end: shortTime(item.horaFin) };
  });
  return items?.length ? result : defaultSchedules();
}

function mapService(service: ServicioBackend): Service {
  return {
    id: service.id,
    name: service.nombre,
    price: Number(service.precio),
    duration: toDuration(service.duracionMinutos),
    category: service.categoria || "Otra",
    description: service.descripcion || "",
    active: service.activo ?? true,
    imageUrl: service.imagenUrl || "",
    atHome: service.aDomicilio ?? service.adomicilio ?? false,
    schedules: schedulesFromBackend(service.horarios),
  };
}

function schedulesPayload(schedules: ScheduleState): HorarioServicio[] {
  return DAYS.filter((day) => schedules[day.value].active).map((day) => ({
    diaSemana: day.value,
    horaInicio: schedules[day.value].start,
    horaFin: schedules[day.value].end,
  }));
}

function ServiceModal({ title, initial, onSave, onClose }: {
  title: string;
  initial: ServiceFormData;
  onSave: (data: ServiceFormData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [categoryOption, setCategoryOption] = useState(isPresetCategory(initial.category, SERVICE_CATEGORIES) ? initial.category : "Otra");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateDay = (day: DiaSemana, changes: Partial<DaySchedule>) => {
    setForm((current) => ({
      ...current,
      schedules: { ...current.schedules, [day]: { ...current.schedules[day], ...changes } },
    }));
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) return toast.error("La imagen debe pesar máximo 2 MB");
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, imageUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const submit = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "El nombre es requerido";
    if (!form.category.trim()) nextErrors.category = "La categoría es requerida";
    if (!form.price || Number(form.price) <= 0) nextErrors.price = "Ingresa un precio válido";
    const enabled = DAYS.filter((day) => form.schedules[day.value].active);
    if (!enabled.length) nextErrors.schedule = "Activa al menos un día de atención";
    if (enabled.some((day) => form.schedules[day.value].start >= form.schedules[day.value].end)) {
      nextErrors.schedule = "La hora de apertura debe ser anterior a la de cierre";
    }
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-2xl border w-full max-w-3xl max-h-[94vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b"><div><h3>{title}</h3><p className="text-sm text-muted-foreground">Configura la información y disponibilidad semanal.</p></div><button onClick={onClose} className="p-2 rounded-lg hover:bg-muted"><X /></button></div>
        <div className="overflow-y-auto p-6 space-y-5">
          <div className="flex items-center gap-4">{form.imageUrl ? <img src={form.imageUrl} alt="Vista previa" className="w-20 h-20 rounded-xl object-cover" /> : <div className="w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center"><ImagePlus /></div>}<label className="text-primary cursor-pointer">Subir desde dispositivo<input type="file" accept="image/*" onChange={handleFile} className="hidden" /></label></div>
          <input placeholder="Enlace de imagen (opcional)" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} className="w-full px-4 py-3 rounded-lg border bg-input-background" />
          <div><label>Nombre del servicio *</label><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full px-4 py-3 rounded-lg border bg-input-background" />{errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}</div>
          <div><label>Categoría *</label><select value={categoryOption} onChange={(event) => { const value = event.target.value; setCategoryOption(value); setForm({ ...form, category: value === "Otra" ? "" : value }); }} className="w-full px-4 py-3 rounded-lg border bg-input-background">{SERVICE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>{categoryOption === "Otra" && <input placeholder="Escribe la categoría" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-2 w-full px-4 py-3 rounded-lg border bg-input-background" />}{errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}</div>
          <div className="grid sm:grid-cols-2 gap-4"><div><label>Precio *</label><input type="number" min="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="w-full px-4 py-3 rounded-lg border bg-input-background" />{errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}</div><div><label>Duración</label><select value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} className="w-full px-4 py-3 rounded-lg border bg-input-background">{DURATIONS.map((duration) => <option key={duration}>{duration}</option>)}</select></div></div>
          <div><label>Descripción</label><textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full px-4 py-3 rounded-lg border bg-input-background" /></div>

          <section className="border rounded-xl overflow-hidden">
            <div className="p-4 bg-muted/40 border-b"><h4>Horario de atención</h4><p className="text-sm text-muted-foreground">Estos horarios se mostrarán al cliente y definirán cuándo puede reservar.</p></div>
            <div className="divide-y">
              {DAYS.map((day) => {
                const schedule = form.schedules[day.value];
                return <div key={day.value} className="grid grid-cols-[100px_1fr] sm:grid-cols-[130px_1fr] items-center gap-3 p-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={schedule.active} onChange={(event) => updateDay(day.value, { active: event.target.checked })} />{day.label}</label>{schedule.active ? <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center"><input aria-label={`Apertura ${day.label}`} type="time" value={schedule.start} onChange={(event) => updateDay(day.value, { start: event.target.value })} className="px-3 py-2 rounded-lg border bg-input-background" /><span className="text-muted-foreground text-sm">a</span><input aria-label={`Cierre ${day.label}`} type="time" value={schedule.end} onChange={(event) => updateDay(day.value, { end: event.target.value })} className="px-3 py-2 rounded-lg border bg-input-background" /></div> : <span className="text-sm text-muted-foreground">Cerrado</span>}</div>;
              })}
            </div>
          </section>
          {errors.schedule && <p className="text-sm text-destructive">{errors.schedule}</p>}

          <label className="flex items-center justify-between p-4 rounded-lg bg-muted/50"><span><b>Servicio a domicilio</b><small className="block text-muted-foreground">El cliente deberá tener una dirección registrada.</small></span><input type="checkbox" checked={form.atHome} onChange={(event) => setForm({ ...form, atHome: event.target.checked })} /></label>
          <label className="flex items-center justify-between p-4 rounded-lg bg-muted/50"><span><b>Servicio activo</b><small className="block text-muted-foreground">Visible y disponible para reservar.</small></span><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /></label>
        </div>
        <div className="flex gap-3 p-6 border-t"><button onClick={onClose} className="flex-1 py-3 rounded-lg border">Cancelar</button><button onClick={submit} className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground flex justify-center items-center gap-2"><Save className="h-4 w-4" />Guardar servicio</button></div>
      </div>
    </div>
  );
}

export function ServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [negocioId, setNegocioId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | { mode: "add" } | { mode: "edit"; service: Service }>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => { (async () => {
    try {
      let business;
      try { business = await obtenerMiNegocio(); } catch { business = await guardarMiNegocio({ nombre: obtenerSesion().nombre || "Mi Negocio", categoria: "Otra" }); }
      setNegocioId(business.id);
      setServices((await listarServiciosDeNegocio(business.id)).map(mapService));
    } catch (error) { toast.error(error instanceof Error ? error.message : "No se pudieron cargar los servicios"); }
    finally { setLoading(false); }
  })(); }, []);

  const save = async (data: ServiceFormData) => {
    if (!negocioId) return;
    try {
      const payload = { nombre: data.name, descripcion: data.description, precio: Number(data.price), duracionMinutos: toMinutes(data.duration), categoria: data.category, activo: data.active, imagenUrl: data.imageUrl, aDomicilio: data.atHome, horarios: schedulesPayload(data.schedules) };
      if (modal?.mode === "edit") {
        const saved = await actualizarServicio(modal.service.id, payload);
        setServices((current) => current.map((service) => service.id === saved.id ? mapService(saved) : service));
      } else {
        const saved = await crearServicio(payload);
        setServices((current) => [mapService(saved), ...current]);
      }
      toast.success("Servicio y horarios guardados");
      setModal(null);
    } catch (error) { toast.error(error instanceof Error ? error.message : "No se pudo guardar"); }
  };

  const remove = async (id: number) => {
    try { await eliminarServicio(id); setServices((current) => current.filter((service) => service.id !== id)); setDeleteId(null); toast.success("Servicio eliminado"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "No se pudo eliminar"); }
  };

  const formFor = (service: Service): ServiceFormData => ({ ...service, price: String(service.price), schedules: structuredClone(service.schedules) });
  return <div className="h-screen overflow-auto bg-background p-5 sm:p-8">
    {modal && <ServiceModal title={modal.mode === "add" ? "Agregar servicio" : "Editar servicio"} initial={modal.mode === "edit" ? formFor(modal.service) : emptyForm()} onSave={save} onClose={() => setModal(null)} />}
    {deleteId !== null && <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"><div className="bg-card p-6 rounded-xl space-y-4"><h3>¿Eliminar servicio?</h3><p className="text-sm text-muted-foreground">Esta acción también eliminará su disponibilidad configurada.</p><div className="flex gap-3"><button onClick={() => setDeleteId(null)} className="px-4 py-2 border rounded-lg">Cancelar</button><button onClick={() => remove(deleteId)} className="px-4 py-2 bg-destructive text-white rounded-lg">Eliminar</button></div></div></div>}
    <div className="max-w-7xl mx-auto space-y-6"><div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"><div><h1>Mis servicios</h1><p className="text-muted-foreground">Administra tus servicios, horarios y disponibilidad.</p></div><button onClick={() => setModal({ mode: "add" })} className="self-start inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground"><Plus className="h-4 w-4" />Agregar servicio</button></div>
      {loading ? <p>Cargando...</p> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">{services.map((service) => <article key={service.id} className="h-full bg-card rounded-xl border overflow-hidden flex flex-col">{service.imageUrl ? <img src={service.imageUrl} alt={service.name} className="w-full h-40 object-cover" /> : <div aria-label="Servicio sin imagen" className="w-full h-40 bg-muted" />}<div className="p-5 flex flex-1 flex-col gap-3"><div className="flex justify-between gap-3"><div className="min-w-0"><h3 className="truncate">{service.name}</h3><p className="text-sm text-muted-foreground truncate">{service.category}</p></div><span className={`shrink-0 h-fit px-3 py-1 rounded-full text-xs ${service.active ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>{service.active ? "Activo" : "Inactivo"}</span></div><p className="min-h-10 text-sm text-muted-foreground line-clamp-2">{service.description || "Sin descripción"}</p><div className="flex gap-4 text-sm"><span className="flex gap-1"><DollarSign className="h-4 w-4" />{service.price}</span><span className="flex gap-1"><Clock className="h-4 w-4" />{service.duration}</span></div><div className="min-h-7 flex flex-wrap content-start gap-1">{DAYS.filter((day) => service.schedules[day.value].active).map((day) => <span key={day.value} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">{day.short}</span>)}</div>{service.atHome && <span className="flex gap-1 text-sm text-primary"><MapPin className="h-4 w-4" />A domicilio</span>}<div className="mt-auto pt-2 flex gap-2"><button onClick={() => setModal({ mode: "edit", service })} className="flex-1 py-2 rounded-lg bg-primary/10 text-primary flex justify-center items-center gap-2"><Edit className="h-4 w-4" />Editar</button><button aria-label={`Eliminar ${service.name}`} onClick={() => setDeleteId(service.id)} className="px-4 rounded-lg bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button></div></div></article>)}</div>}
    </div>
  </div>;
}
