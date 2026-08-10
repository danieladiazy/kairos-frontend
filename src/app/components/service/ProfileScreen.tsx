import { useEffect, useState } from "react";
import { Clock3, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { obtenerMiNegocio, guardarMiNegocio } from "../../lib/api";
import { BUSINESS_CATEGORIES, isPresetCategory } from "../../lib/categories";
import {
  BUSINESS_DAYS,
  errorHorarios,
  horariosDesdeApi,
  horariosParaApi,
  horariosPredeterminados,
  type DaySchedule,
} from "../../lib/businessHours";
import { claseCampo, errorTelefono, limpiarTelefono } from "../../lib/validation";

type FormErrors = Partial<Record<"nombre" | "categoria" | "telefono" | "horarios", string>>;

export function ProfileScreen() {
  const [form, setForm] = useState({ nombre: "", categoria: "", descripcion: "", direccion: "", telefono: "", imagenUrl: "" });
  const [horarios, setHorarios] = useState(horariosPredeterminados());
  const [categoryOption, setCategoryOption] = useState("Belleza y estética");
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    obtenerMiNegocio().then((negocio) => {
      const categoria = negocio.categoria || "";
      setForm({
        nombre: negocio.nombre || "",
        categoria,
        descripcion: negocio.descripcion || "",
        direccion: negocio.direccion || "",
        telefono: negocio.telefono || "",
        imagenUrl: negocio.imagenUrl || "",
      });
      setHorarios(horariosDesdeApi(negocio.horarios));
      setCategoryOption(isPresetCategory(categoria, BUSINESS_CATEGORIES) ? categoria : "Otra");
    }).catch(() => {});
  }, []);

  const set = (key: string, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const updateDay = (day: keyof typeof horarios, changes: Partial<DaySchedule>) => {
    setHorarios((current) => ({ ...current, [day]: { ...current[day], ...changes } }));
    setErrors((current) => ({ ...current, horarios: undefined }));
  };

  const file = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (selected.size > 2_000_000) return toast.error("La imagen debe pesar máximo 2 MB");
    const reader = new FileReader();
    reader.onload = () => set("imagenUrl", String(reader.result));
    reader.readAsDataURL(selected);
  };

  const save = async () => {
    const nextErrors: FormErrors = {};
    if (!form.nombre.trim()) nextErrors.nombre = "El nombre del negocio es obligatorio";
    if (!form.categoria.trim()) nextErrors.categoria = "La categoría es obligatoria";
    const phoneMessage = errorTelefono(form.telefono);
    if (phoneMessage) nextErrors.telefono = phoneMessage;
    const scheduleMessage = errorHorarios(horarios);
    if (scheduleMessage) nextErrors.horarios = scheduleMessage;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      await guardarMiNegocio({ ...form, horarios: horariosParaApi(horarios) });
      toast.success("Perfil y horario del negocio guardados");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return <div className="h-full overflow-auto p-4 sm:p-8 bg-background"><div className="max-w-4xl mx-auto space-y-6">
    <div><h1>Mi perfil</h1><p className="text-muted-foreground">Administra los datos y el horario general de tu negocio.</p></div>
    <div className="bg-card rounded-xl border border-border p-4 sm:p-6 space-y-5">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">{form.imagenUrl ? <img src={form.imagenUrl} alt="Imagen del negocio" className="w-24 h-24 rounded-xl object-cover"/> : <div className="w-24 h-24 bg-primary/10 rounded-xl"/>}<label className="text-primary cursor-pointer flex gap-2"><Upload className="h-4 w-4"/>Subir imagen<input type="file" accept="image/*" onChange={file} className="hidden"/></label></div>
      <div><label>Enlace de imagen</label><input value={form.imagenUrl} onChange={(e) => set("imagenUrl", e.target.value)} className={`${claseCampo()} px-4 py-3`}/></div>
      <div className="grid md:grid-cols-2 gap-5">
        <div><label>Nombre del negocio <span className="text-destructive">*</span></label><input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} aria-invalid={!!errors.nombre} className={`${claseCampo(errors.nombre)} px-4 py-3`}/>{errors.nombre && <p className="mt-1 text-sm text-destructive">{errors.nombre}</p>}</div>
        <div><label>Categoría <span className="text-destructive">*</span></label><select value={categoryOption} onChange={(e) => { const value = e.target.value; setCategoryOption(value); set("categoria", value === "Otra" ? "" : value); }} aria-invalid={!!errors.categoria} className={`${claseCampo(errors.categoria)} px-4 py-3`}>{BUSINESS_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>{categoryOption === "Otra" && <input autoFocus placeholder="Escribe la categoría" value={form.categoria} onChange={(e)=>set("categoria",e.target.value)} className={`${claseCampo(errors.categoria)} mt-2 px-4 py-3`}/>} {errors.categoria && <p className="mt-1 text-sm text-destructive">{errors.categoria}</p>}</div>
        <div><label>Teléfono <span className="text-destructive">*</span></label><input type="tel" inputMode="tel" value={form.telefono} onChange={(e) => set("telefono", limpiarTelefono(e.target.value))} aria-invalid={!!errors.telefono} className={`${claseCampo(errors.telefono)} px-4 py-3`}/>{errors.telefono && <p className="mt-1 text-sm text-destructive">{errors.telefono}</p>}</div>
        <div><label>Dirección</label><input value={form.direccion} onChange={(e) => set("direccion", e.target.value)} className={`${claseCampo()} px-4 py-3`}/></div>
      </div>
      <div><label>Descripción</label><textarea value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} className={`${claseCampo()} px-4 py-3`} rows={4}/></div>

      <section className="border rounded-xl overflow-hidden">
        <div className="p-4 bg-muted/40 border-b"><div className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-primary"/><h2 className="text-lg">Horario general del negocio</h2></div><p className="text-sm text-muted-foreground mt-1">Este horario se aplicará automáticamente a todos tus servicios.</p></div>
        <div className="divide-y">{BUSINESS_DAYS.map((day) => {
          const schedule = horarios[day.value];
          return <div key={day.value} className="flex flex-col items-stretch gap-3 p-3 sm:grid sm:grid-cols-[130px_1fr] sm:items-center"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={schedule.active} onChange={(event) => updateDay(day.value, { active: event.target.checked })}/>{day.label}</label>{schedule.active ? <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-2 items-center"><input aria-label={`Apertura ${day.label}`} type="time" value={schedule.start} onChange={(event) => updateDay(day.value, { start: event.target.value })} className="min-w-0 w-full px-3 py-2 rounded-lg border bg-input-background"/><span className="text-muted-foreground text-sm">a</span><input aria-label={`Cierre ${day.label}`} type="time" value={schedule.end} onChange={(event) => updateDay(day.value, { end: event.target.value })} className="min-w-0 w-full px-3 py-2 rounded-lg border bg-input-background"/></div> : <span className="text-sm text-muted-foreground">Cerrado</span>}</div>;
        })}</div>
      </section>
      {errors.horarios && <p className="text-sm text-destructive">{errors.horarios}</p>}

      <button onClick={save} disabled={saving} className="w-full sm:w-auto sm:ml-auto flex justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground disabled:opacity-60"><Save className="h-5 w-5"/>{saving ? "Guardando..." : "Guardar cambios"}</button>
    </div>
  </div></div>;
}
