import { BarChart3, CheckCircle2, LogIn, Search, Store, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { iniciarSesion, limpiarSesion } from "../../lib/api";
import { KairosBrand } from "../KairosBrand";

interface Props {
  onLogin:(type:"client"|"service")=>void;
  onNavigateToRegister:()=>void;
  onForgotPassword:()=>void;
  clientOnly?:boolean;
}

const roleInfo={
  client:{title:"Reserva servicios con confianza",description:"Accede a una experiencia sencilla para descubrir negocios, comparar opciones y organizar tus citas.",items:["Consulta servicios, precios, duración y horarios disponibles","Reserva, revisa, cancela o reagenda tus citas desde un solo lugar","Mantén tus datos de contacto y dirección siempre actualizados"]},
  service:{title:"Gestiona tu operación en un solo lugar",description:"Administra la presencia de tu negocio, tus servicios y tu agenda con información clara y actualizada.",items:["Publica servicios con precio, duración, imagen y disponibilidad","Confirma, completa, cancela o reagenda las citas recibidas","Consulta tu actividad, clientes e ingresos registrados"]},
};

export function LoginScreen({onLogin,onNavigateToRegister,onForgotPassword,clientOnly=false}:Props){
  const [userType,setUserType]=useState<"client"|"service">("client");
  const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState<string|null>(null),[loading,setLoading]=useState(false);
  const selected=clientOnly?"client":userType;
  const info=roleInfo[selected];
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError(null);setLoading(true);try{const result=await iniciarSesion(email,password);const actual=result.rol==="NEGOCIO"?"service":"client";if(actual!==selected){limpiarSesion();setError(`Esta cuenta está registrada como ${actual==="service"?"Negocio":"Cliente"}. Selecciona ese rol para continuar.`);return}onLogin(actual)}catch(err){setError(err instanceof Error?err.message:"No se pudo iniciar sesión")}finally{setLoading(false)}};
  return <div className="min-h-[100dvh] w-full bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-start lg:items-center justify-center p-3 sm:p-8"><div className="w-full max-w-5xl grid lg:grid-cols-[0.9fr_1.1fr] bg-card border rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
    <aside className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 sm:p-10 flex flex-col justify-between lg:min-h-[650px]"><div><div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm"><CheckCircle2 className="h-4 w-4"/>{selected==="client"?"Acceso para clientes":"Acceso para negocios"}</div><h1 className="mt-5 sm:mt-8 text-3xl sm:text-4xl text-white">{info.title}</h1><p className="mt-3 sm:mt-4 text-white/80 leading-relaxed">{info.description}</p><div className="mt-5 sm:mt-8 space-y-3 sm:space-y-4">{info.items.map(item=><div key={item} className="flex gap-3 items-start"><CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0"/><span className="text-sm sm:text-base text-white/90">{item}</span></div>)}</div></div><div className="hidden lg:flex mt-10 items-center gap-3 text-white/80">{selected==="client"?<Search className="h-8 w-8"/>:<BarChart3 className="h-8 w-8"/>}<span className="text-sm">Organiza tus citas de forma sencilla y segura.</span></div></aside>
    <section className="p-5 sm:p-10 lg:p-12 flex flex-col justify-center"><div className="mb-6 sm:mb-8"><KairosBrand size="lg" /><p className="text-muted-foreground mt-3">Elige el perfil con el que deseas ingresar y proporciona tus credenciales.</p></div>
      {!clientOnly&&<div className="grid grid-cols-2 gap-3 mb-6" role="group" aria-label="Tipo de cuenta"><button type="button" onClick={()=>{setUserType("client");setError(null)}} className={`min-h-[76px] flex flex-col sm:flex-row items-center justify-center gap-2 px-3 rounded-xl border-2 whitespace-nowrap transition-all ${selected==="client"?"border-primary bg-primary/10 text-primary":"border-border hover:border-primary/50"}`}><User className="h-5 w-5 shrink-0"/><span className="text-sm">Soy Cliente</span></button><button type="button" onClick={()=>{setUserType("service");setError(null)}} className={`min-h-[76px] flex flex-col sm:flex-row items-center justify-center gap-2 px-3 rounded-xl border-2 whitespace-nowrap transition-all ${selected==="service"?"border-primary bg-primary/10 text-primary":"border-border hover:border-primary/50"}`}><Store className="h-5 w-5 shrink-0"/><span className="text-sm">Soy Negocio</span></button></div>}
      <form onSubmit={submit} className="space-y-5">{error&&<div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3">{error}</div>}<div className="space-y-2"><label htmlFor="login-email" className="text-sm">Correo electrónico</label><input id="login-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="tu@email.com" className="w-full min-h-[46px] px-4 rounded-xl border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50"/></div><div className="space-y-2"><label htmlFor="login-password" className="text-sm">Contraseña</label><input id="login-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" className="w-full min-h-[46px] px-4 rounded-xl border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50"/></div><button type="submit" disabled={loading} className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 whitespace-nowrap"><LogIn className="h-5 w-5 shrink-0"/>{loading?"Ingresando...":"Iniciar sesión"}</button></form>
      <div className="grid sm:grid-cols-2 gap-3 mt-4"><button type="button" onClick={onNavigateToRegister} className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-xl border hover:bg-muted whitespace-nowrap"><UserPlus className="h-4 w-4 shrink-0"/>Crear cuenta</button><button type="button" onClick={onForgotPassword} className="min-h-[44px] inline-flex items-center justify-center px-4 rounded-xl border hover:bg-muted whitespace-nowrap text-sm">Olvidé mi contraseña</button></div>
    </section>
  </div></div>;
}
