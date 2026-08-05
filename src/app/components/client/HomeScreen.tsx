import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Clock, Loader2, Search } from "lucide-react";
import { buscarServicios, type Servicio } from "../../lib/api";
import { Footer } from "../Footer";

interface Props {
  onNavigate: (screen:string) => void;
  isLoggedIn: boolean;
  onNavigateToLogin?: () => void;
  onShowHelp?: () => void;
  onNavigateToService?: (id:number) => void;
}

export function HomeScreen({ onNavigate, isLoggedIn, onNavigateToLogin, onShowHelp, onNavigateToService }:Props) {
  const [servicios,setServicios] = useState<Servicio[]>([]);
  const [query,setQuery] = useState("");
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");

  useEffect(() => {
    buscarServicios("")
      .then(items => setServicios(items.filter(item => item.activo !== false).slice(0,6)))
      .catch(err => setError(err instanceof Error ? err.message : "No se pudieron cargar los servicios"))
      .finally(() => setLoading(false));
  }, []);

  const buscar = (event:FormEvent) => {
    event.preventDefault();
    sessionStorage.setItem("kairos_busqueda", query.trim());
    onNavigate("search");
  };

  return <div className="h-full overflow-y-auto bg-background">
    <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-9 sm:px-6 sm:py-14">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <div><h1 className="text-3xl sm:text-4xl">Encuentra servicios cerca de ti</h1><p className="text-muted-foreground mt-3">Descubre opciones para cuidar de ti y aprovechar mejor tu tiempo.</p></div>
        <form onSubmit={buscar} className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="¿Qué servicio buscas?" className="w-full pl-12 pr-28 py-4 rounded-xl border bg-card shadow-sm"/>
          <button className="absolute right-2 top-2 bottom-2 px-5 rounded-lg bg-primary text-primary-foreground">Buscar</button>
        </form>
        {!isLoggedIn && onNavigateToLogin && <button onClick={onNavigateToLogin} className="inline-flex min-h-[44px] items-center justify-center px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm whitespace-nowrap">Iniciar sesión</button>}
      </div>
    </section>

    <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      <div className="flex items-end justify-between gap-4"><div><h2>Servicios disponibles</h2><p className="text-muted-foreground">Encuentra una opción que se adapte a ti</p></div><button onClick={()=>onNavigate("search")} className="shrink-0 flex items-center gap-2 text-primary">Ver todos <ArrowRight className="h-4 w-4"/></button></div>
      {loading && <div className="py-16 flex justify-center gap-2 text-muted-foreground"><Loader2 className="animate-spin"/>Cargando servicios...</div>}
      {error && <div className="border border-destructive/30 bg-destructive/10 rounded-xl p-6 text-center"><p className="text-destructive">{error}</p><button onClick={()=>location.reload()} className="mt-3 underline">Intentar de nuevo</button></div>}
      {!loading && !error && servicios.length === 0 && <div className="border rounded-xl p-12 text-center text-muted-foreground">Todavía no hay servicios activos publicados.</div>}
      {!loading && !error && servicios.length > 0 && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">{servicios.map(servicio=><article key={servicio.id} className="h-full bg-card border rounded-xl overflow-hidden flex flex-col">
        {servicio.imagenUrl ? <img src={servicio.imagenUrl} alt={servicio.nombre} className="h-44 w-full object-cover"/> : <div aria-label="Servicio sin imagen" className="h-44 bg-muted"/>}
        <div className="p-5 flex flex-1 flex-col gap-3"><div><h3 className="line-clamp-1">{servicio.nombre}</h3><p className="text-sm text-muted-foreground line-clamp-1">{servicio.categoria || "Otra"}</p></div><div className="flex justify-between text-sm"><span className="flex gap-1"><Clock className="h-4 w-4"/>{servicio.duracionMinutos} min</span><strong>${Number(servicio.precio).toFixed(2)} MXN</strong></div><button onClick={()=>onNavigateToService?.(servicio.id)} className="mt-auto w-full py-2 rounded-lg bg-primary text-primary-foreground">Ver detalles</button></div>
      </article>)}</div>}
      <div className="text-center"><button onClick={onShowHelp} className="text-sm text-muted-foreground hover:text-primary">¿Necesitas ayuda?</button></div>
      <Footer/>
    </main>
  </div>;
}
