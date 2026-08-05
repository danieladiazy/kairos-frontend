import type { LucideIcon } from "lucide-react";
import { HelpCircle, LogOut } from "lucide-react";
import { KairosBrand } from "./KairosBrand";

export interface MobileNavItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

export function MobileTopBar({
  subtitle,
  onHelp,
  onLogout,
}: {
  subtitle: string;
  onHelp: () => void;
  onLogout?: () => void;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 lg:hidden">
      <div className="min-w-0">
        <KairosBrand size="sm" />
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={onHelp} aria-label="Preguntas frecuentes" className="rounded-lg p-2.5 hover:bg-muted">
          <HelpCircle className="h-5 w-5" />
        </button>
        {onLogout && (
          <button onClick={onLogout} aria-label="Cerrar sesión" className="rounded-lg p-2.5 text-secondary hover:bg-secondary/10">
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  );
}

export function MobileBottomNav({
  items,
  active,
  onNavigate,
}: {
  items: MobileNavItem[];
  active: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <nav aria-label="Navegación principal" className="grid shrink-0 border-t bg-card pb-[env(safe-area-inset-bottom)] lg:hidden" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((item) => {
        const Icon = item.icon;
        const selected = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-current={selected ? "page" : undefined}
            className={`flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 px-1 text-[11px] transition-colors ${selected ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Icon className={`h-5 w-5 ${selected ? "stroke-[2.5]" : ""}`} />
            <span className="max-w-full truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
