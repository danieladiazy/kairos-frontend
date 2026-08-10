import { useEffect, useState } from "react";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { obtenerMiPerfil, guardarMiPerfil } from "../../lib/api";
import { claseCampo, errorTelefono, limpiarTelefono } from "../../lib/validation";

export function ProfileScreen() {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", direccion: "", fechaNacimiento: "", imagenUrl: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    obtenerMiPerfil().then((profile) => setForm({
      nombre: profile.nombre || "",
      email: profile.email || "",
      telefono: profile.telefono || "",
      direccion: profile.direccion || "",
      fechaNacimiento: profile.fechaNacimiento || "",
      imagenUrl: profile.imagenUrl || "",
    })).catch((error) => toast.error(error.message));
  }, []);

  const set = (key: string, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const file = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (selected.size > 2_000_000) return toast.error("La imagen debe pesar menos de 2 MB");
    const reader = new FileReader();
    reader.onload = () => set("imagenUrl", String(reader.result));
    reader.readAsDataURL(selected);
  };

  const save = async () => {
    const nextErrors: Record<string, string> = {};
    if (!form.nombre.trim()) nextErrors.nombre = "El nombre es obligatorio";
    if (!form.email.trim()) nextErrors.email = "El correo es obligatorio";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Ingresa un correo válido";
    const phoneMessage = errorTelefono(form.telefono);
    if (phoneMessage) nextErrors.telefono = phoneMessage;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      await guardarMiPerfil(form);
      toast.success("Perfil guardado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const field = (key: "nombre" | "email" | "telefono" | "fechaNacimiento", label: string, type: string) => <div className="space-y-2" key={key}>
    <label>{label}{key === "nombre" || key === "telefono" ? <span className="text-destructive"> *</span> : null}</label>
    <input type={type} inputMode={key === "telefono" ? "tel" : undefined} value={form[key]} onChange={(event) => set(key, key === "telefono" ? limpiarTelefono(event.target.value) : event.target.value)} aria-invalid={!!errors[key]} className={`${claseCampo(errors[key])} px-4 py-3`}/>
    {errors[key] && <p className="text-sm text-destructive">{errors[key]}</p>}
  </div>;

  return <div className="h-full overflow-auto bg-background p-4 sm:p-6"><div className="max-w-3xl mx-auto space-y-6"><div><h1>Mi perfil</h1><p className="text-muted-foreground">Administra tus datos personales y de contacto.</p></div><div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-5">
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">{form.imagenUrl ? <img src={form.imagenUrl} alt="Imagen de perfil" className="w-24 h-24 rounded-full object-cover"/> : <div className="w-24 h-24 rounded-full bg-primary/10"/>}<label className="cursor-pointer flex gap-2 text-primary"><Upload className="h-4 w-4"/>Subir imagen<input type="file" accept="image/*" onChange={file} className="hidden"/></label></div>
    <div className="space-y-2"><label>O pega un enlace de imagen</label><input value={form.imagenUrl} onChange={(event) => set("imagenUrl", event.target.value)} className={`${claseCampo()} px-4 py-3`}/></div>
    <div className="grid md:grid-cols-2 gap-5">{field("nombre", "Nombre completo", "text")}{field("email", "Correo", "email")}{field("telefono", "Teléfono", "tel")}{field("fechaNacimiento", "Fecha de nacimiento", "date")}</div>
    <div className="space-y-2"><label>Dirección <span className="text-muted-foreground text-sm">(solo necesaria para servicios a domicilio)</span></label><input value={form.direccion} onChange={(event) => set("direccion", event.target.value)} className={`${claseCampo()} px-4 py-3`}/></div>
    <button disabled={saving} onClick={save} className="flex w-full justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground sm:ml-auto sm:w-auto disabled:opacity-60"><Save className="h-5 w-5"/>{saving ? "Guardando..." : "Guardar cambios"}</button>
  </div></div></div>;
}
