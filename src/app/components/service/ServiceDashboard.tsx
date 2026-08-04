import { useState } from "react";
import { Calendar, HelpCircle, LayoutDashboard, LogOut, Package, User } from "lucide-react";
import { AgendaScreen } from "./AgendaScreen";
import { DashboardScreen } from "./DashboardScreen";
import { ProfileScreen } from "./ProfileScreen";
import { ServicesScreen } from "./ServicesScreen";
import { ConfirmDialog } from "../ConfirmDialog";
import { FaqDialog } from "../FaqDialog";
import { KairosBrand } from "../KairosBrand";

export function ServiceDashboard({ onLogout }: { onLogout: () => void }) {
  const [panel, setPanel] = useState("dashboard");
  const [showHelp, setShowHelp] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const menu = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "agenda", icon: Calendar, label: "Agenda" },
    { id: "services", icon: Package, label: "Mis servicios" },
    { id: "profile", icon: User, label: "Mi perfil" },
  ];
  const content = panel === "agenda" ? <AgendaScreen /> : panel === "services" ? <ServicesScreen /> : panel === "profile" ? <ProfileScreen /> : <DashboardScreen onOpenAgenda={() => setPanel("agenda")} />;

  return <div className="h-screen flex bg-background overflow-hidden">
    <aside className="w-64 bg-card border-r flex flex-col">
      <div className="p-6 border-b"><KairosBrand size="md" /><p className="mt-2 text-sm text-muted-foreground">Panel de negocio</p></div>
      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {menu.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setPanel(item.id)} className={`w-full min-h-[44px] flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap ${panel === item.id ? "bg-primary text-white" : "hover:bg-muted"}`}><Icon className="h-5 w-5" />{item.label}</button>; })}
        <button onClick={() => setShowHelp(true)} className="w-full min-h-[44px] flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap hover:bg-muted"><HelpCircle className="h-5 w-5" />Preguntas frecuentes</button>
      </nav>
      <div className="p-4 border-t"><button onClick={() => setConfirmLogout(true)} className="w-full min-h-[44px] flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap text-secondary hover:bg-secondary/10"><LogOut className="h-5 w-5" />Cerrar sesión</button></div>
    </aside>
    <main className="flex-1 overflow-auto">{content}</main>
    {showHelp && <FaqDialog audience="negocio" onClose={() => setShowHelp(false)} />}
    <ConfirmDialog open={confirmLogout} title="¿Cerrar sesión?" description="Tendrás que iniciar sesión nuevamente para consultar tu agenda y administrar tus servicios." confirmLabel="Cerrar sesión" destructive onCancel={() => setConfirmLogout(false)} onConfirm={onLogout} />
  </div>;
}
