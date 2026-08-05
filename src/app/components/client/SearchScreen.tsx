import { Clock, Loader2, Search, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { buscarServicios, type Servicio } from "../../lib/api";
import { Footer } from "../Footer";

interface Props {
  isLoggedIn: boolean;
  onNavigate: (screen: string) => void;
  onNavigateToService?: (id: number) => void;
  onBookService: (servicio: Servicio) => void;
  category: string;
  onClearCategory: () => void;
}

export function SearchScreen({ isLoggedIn, onNavigate, onNavigateToService, onBookService, category, onClearCategory }: Props) {
  const initial = sessionStorage.getItem("kairos_busqueda") || "";
  const [draft, setDraft] = useState(initial);
  const [query, setQuery] = useState(initial);
  const [items, setItems] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = (text: string) => {
    setLoading(true);
    setError("");
    buscarServicios(text, category)
      .then(setItems)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "No se pudieron cargar los servicios"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    sessionStorage.removeItem("kairos_busqueda");
    setDraft(initial);
    setQuery(initial);
    load(initial);
  }, [category]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    setQuery(text);
    load(text);
  };

  return <div className="h-full flex flex-col bg-background overflow-hidden">
    <form onSubmit={submit} className="bg-card border-b px-4 sm:px-6 py-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Buscar servicios..." className="w-full pl-12 pr-28 py-3 rounded-lg border" />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-primary text-white">Buscar</button>
      </div>
    </form>
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {loading ? <div className="py-12 flex justify-center gap-2"><Loader2 className="animate-spin" />Cargando servicios...</div>
          : error ? <div className="p-8 border border-destructive/30 rounded-xl text-center text-destructive">{error}</div>
          : <>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <p className="text-muted-foreground">{items.length} servicios {query && `para “${query}”`}</p>
              {category && <button onClick={onClearCategory} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">{category}<X className="h-3.5 w-3.5" /></button>}
            </div>
            {items.length === 0 ? <div className="border rounded-xl p-10 text-center text-muted-foreground">No encontramos servicios activos con esa búsqueda.</div>
              : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">{items.map((servicio) => <article key={servicio.id} className="h-full bg-card border rounded-xl overflow-hidden flex flex-col">
                {servicio.imagenUrl ? <img src={servicio.imagenUrl} alt={servicio.nombre} className="w-full h-44 object-cover" /> : <div aria-label="Servicio sin imagen" className="h-44 bg-muted" />}
                <div className="p-5 flex flex-1 flex-col gap-3">
                  <div><h3 className="line-clamp-1">{servicio.nombre}</h3><p className="text-sm text-muted-foreground line-clamp-1">{servicio.categoria || "Otra"}</p></div>
                  <div className="flex justify-between text-sm"><span className="flex gap-1"><Clock className="h-4 w-4" />{servicio.duracionMinutos} min</span><strong>${Number(servicio.precio).toFixed(2)} MXN</strong></div>
                  <div className="mt-auto pt-2 space-y-2"><button onClick={() => onNavigateToService?.(servicio.id)} className="w-full py-2 border border-primary text-primary rounded-lg">Ver detalles</button>
                  <button onClick={() => isLoggedIn ? onBookService?.(servicio) : onNavigate("login")} className="w-full py-2 bg-primary text-white rounded-lg">Reservar ahora</button></div>
                </div>
              </article>)}</div>}
          </>}
        <Footer />
      </div>
    </main>
  </div>;
}
