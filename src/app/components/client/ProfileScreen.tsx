import { useEffect,useState } from "react";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { obtenerMiPerfil, guardarMiPerfil } from "../../lib/api";

export function ProfileScreen(){
 const [form,setForm]=useState({nombre:"",email:"",telefono:"",direccion:"",fechaNacimiento:"",imagenUrl:""}); const [saving,setSaving]=useState(false);
 useEffect(()=>{obtenerMiPerfil().then(p=>setForm({nombre:p.nombre||"",email:p.email||"",telefono:p.telefono||"",direccion:p.direccion||"",fechaNacimiento:p.fechaNacimiento||"",imagenUrl:p.imagenUrl||""})).catch(e=>toast.error(e.message))},[]);
 const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));
 const file=(e:React.ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(!f)return;if(f.size>2_000_000){toast.error("La imagen debe pesar menos de 2 MB");return}const r=new FileReader();r.onload=()=>set("imagenUrl",String(r.result));r.readAsDataURL(f)};
 const save=async()=>{setSaving(true);try{await guardarMiPerfil(form);toast.success("Perfil guardado")}catch(e){toast.error(e instanceof Error?e.message:"No se pudo guardar")}finally{setSaving(false)}};
 return <div className="h-full overflow-auto bg-background p-6"><div className="max-w-3xl mx-auto space-y-6"><div><h1>Mi Perfil</h1><p className="text-muted-foreground">Tus datos se guardan en MySQL</p></div><div className="bg-card border border-border rounded-xl p-6 space-y-5">
  <div className="flex items-center gap-5">{form.imagenUrl?<img src={form.imagenUrl} className="w-24 h-24 rounded-full object-cover"/>:<div className="w-24 h-24 rounded-full bg-primary/10"/>}<label className="cursor-pointer flex gap-2 text-primary"><Upload className="h-4 w-4"/>Subir imagen<input type="file" accept="image/*" onChange={file} className="hidden"/></label></div>
  <div className="space-y-2"><label>O pega un enlace de imagen</label><input value={form.imagenUrl} onChange={e=>set("imagenUrl",e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background"/></div>
  <div className="grid md:grid-cols-2 gap-5">{[["nombre","Nombre completo","text"],["email","Correo","email"],["telefono","Teléfono","tel"],["fechaNacimiento","Fecha de nacimiento","date"]].map(([k,l,t])=><div className="space-y-2" key={k}><label>{l}{k==="nombre"||k==="telefono"?<span className="text-destructive"> *</span>:null}</label><input type={t} value={(form as any)[k]} onChange={e=>set(k,e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background"/></div>)}</div>
  <div className="space-y-2"><label>Dirección <span className="text-muted-foreground text-sm">(solo necesaria para servicios a domicilio)</span></label><input value={form.direccion} onChange={e=>set("direccion",e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border bg-input-background"/></div>
  <button disabled={saving} onClick={save} className="flex gap-2 ml-auto px-6 py-3 rounded-lg bg-primary text-primary-foreground"><Save className="h-5 w-5"/>{saving?"Guardando...":"Guardar cambios"}</button>
 </div></div></div>
}
