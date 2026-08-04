import { useEffect, useState } from "react";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { obtenerMiNegocio, guardarMiNegocio } from "../../lib/api";
import { BUSINESS_CATEGORIES, isPresetCategory } from "../../lib/categories";

export function ProfileScreen() {
  const [f, setF] = useState({ nombre: "", categoria: "", descripcion: "", direccion: "", telefono: "", imagenUrl: "" });
  const [categoryOption, setCategoryOption] = useState("Belleza y estética");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    obtenerMiNegocio().then((n) => {
      const categoria = n.categoria || "";
      setF({ nombre: n.nombre || "", categoria, descripcion: n.descripcion || "", direccion: n.direccion || "", telefono: n.telefono || "", imagenUrl: n.imagenUrl || "" });
      setCategoryOption(isPresetCategory(categoria, BUSINESS_CATEGORIES) ? categoria : "Otra");
    }).catch(() => {});
  }, []);

  const set = (k: string, v: string) => setF((x) => ({ ...x, [k]: v }));
  const file = (e: React.ChangeEvent<HTMLInputElement>) => {
    const x = e.target.files?.[0];
    if (!x) return;
    if (x.size > 2_000_000) return toast.error("La imagen debe pesar máximo 2 MB");
    const r = new FileReader();
    r.onload = () => set("imagenUrl", String(r.result));
    r.readAsDataURL(x);
  };
  const save = async () => {
    if (!f.nombre.trim() || !f.categoria.trim() || !f.telefono.trim()) return toast.error("Completa nombre, categoría y teléfono");
    setSaving(true);
    try { await guardarMiNegocio(f); toast.success("Perfil del negocio guardado"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "No se pudo guardar"); }
    finally { setSaving(false); }
  };

  return <div className="h-screen overflow-auto p-8 bg-background"><div className="max-w-4xl mx-auto space-y-6">
    <div><h1>Mi Perfil</h1><p className="text-muted-foreground">Completa nombre, categoría y teléfono para activar servicios.</p></div>
    <div className="bg-card rounded-xl border border-border p-6 space-y-5">
      <div className="flex gap-5 items-center">{f.imagenUrl ? <img src={f.imagenUrl} className="w-24 h-24 rounded-xl object-cover"/> : <div className="w-24 h-24 bg-primary/10 rounded-xl"/>}<label className="text-primary cursor-pointer flex gap-2"><Upload className="h-4 w-4"/>Subir imagen<input type="file" accept="image/*" onChange={file} className="hidden"/></label></div>
      <div><label>Enlace de imagen</label><input value={f.imagenUrl} onChange={(e) => set("imagenUrl", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background"/></div>
      <div className="grid md:grid-cols-2 gap-5">
        <div><label>Nombre del negocio <span className="text-destructive">*</span></label><input value={f.nombre} onChange={(e) => set("nombre", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background"/></div>
        <div><label>Categoría <span className="text-destructive">*</span></label><select value={categoryOption} onChange={(e) => { const v=e.target.value; setCategoryOption(v); set("categoria", v === "Otra" ? "" : v); }} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background">{BUSINESS_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>{categoryOption === "Otra" && <input autoFocus placeholder="Escribe la categoría" value={f.categoria} onChange={(e)=>set("categoria",e.target.value)} className="mt-2 w-full px-4 py-3 rounded-lg border border-border bg-input-background"/>}</div>
        <div><label>Teléfono <span className="text-destructive">*</span></label><input value={f.telefono} onChange={(e) => set("telefono", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background"/></div>
        <div><label>Dirección</label><input value={f.direccion} onChange={(e) => set("direccion", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background"/></div>
      </div>
      <div><label>Descripción</label><textarea value={f.descripcion} onChange={(e) => set("descripcion", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background" rows={4}/></div>
      <button onClick={save} disabled={saving} className="ml-auto flex gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground"><Save className="h-5 w-5"/>{saving ? "Guardando..." : "Guardar cambios"}</button>
    </div>
  </div></div>;
}
