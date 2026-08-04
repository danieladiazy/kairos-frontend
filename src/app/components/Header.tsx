import { Search, Calendar, LogIn } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">
              kairós
            </h1>
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar servicios..."
                className="w-64 pl-10 pr-4 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <Calendar className="h-4 w-4" />
              <span>Mi Agenda</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <LogIn className="h-4 w-4" />
              <span>Iniciar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
