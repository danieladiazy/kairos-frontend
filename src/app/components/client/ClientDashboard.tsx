import { useEffect, useState } from "react";
import { Home, Search, Calendar, User, LogOut, HelpCircle } from "lucide-react";
import { HomeScreen } from "./HomeScreen";
import { SearchScreen } from "./SearchScreen";
import { AppointmentsScreen } from "./AppointmentsScreen";
import { ProfileScreen } from "./ProfileScreen";
import { ServiceDetailScreen } from "./ServiceDetailScreen";
import { BookingScreen } from "./BookingScreen";
import { BookingSuccessScreen } from "./BookingSuccessScreen";
import { ComingSoonScreen } from "./ComingSoonScreen";
import { ConfirmDialog } from "../ConfirmDialog";
import { FaqDialog } from "../FaqDialog";
import { KairosBrand } from "../KairosBrand";
import { MobileBottomNav, MobileTopBar } from "../MobileNavigation";
import type { Negocio, Servicio } from "../../lib/api";
import { obtenerServicio, obtenerSesion } from "../../lib/api";
import { toast } from "sonner";
import { FOOTER_CATEGORY_EVENT, FOOTER_COMING_SOON_EVENT } from "../../lib/navigationEvents";
import { esClienteEmpresa } from "../../lib/pricing";

interface ClientDashboardProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onNavigateToLogin: (clientOnly?: boolean) => void;
}

type ClientPanel = "home" | "search" | "appointments" | "profile" | "service-detail" | "booking" | "booking-success" | "coming-soon";

interface BookingData {
  service: string;
  business: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  address: string;
}

export function ClientDashboard({ isLoggedIn, onLogout, onNavigateToLogin }: ClientDashboardProps) {
  const clienteAsociado = esClienteEmpresa(obtenerSesion().rol);
  const [activePanel, setActivePanel] = useState<ClientPanel>("home");
  const [prevPanel, setPrevPanel] = useState<ClientPanel>("home");
  const [showHelp, setShowHelp] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [selectedServicioId, setSelectedServicioId] = useState(0);
  const [servicioParaReservar, setServicioParaReservar] = useState<Servicio | null>(null);
  const [negocioParaReservar, setNegocioParaReservar] = useState<Negocio | null>(null);
  const [searchCategory, setSearchCategory] = useState("");
  const [comingSoonTitle, setComingSoonTitle] = useState("Esta sección");

  useEffect(() => {
    const openCategory = (event: Event) => {
      const category = (event as CustomEvent<string>).detail;
      sessionStorage.removeItem("kairos_busqueda");
      setSearchCategory(category);
      setActivePanel((current) => { setPrevPanel(current); return "search"; });
    };
    const openComingSoonPage = (event: Event) => {
      setComingSoonTitle((event as CustomEvent<string>).detail || "Esta sección");
      setActivePanel((current) => { setPrevPanel(current); return "coming-soon"; });
    };
    window.addEventListener(FOOTER_CATEGORY_EVENT, openCategory);
    window.addEventListener(FOOTER_COMING_SOON_EVENT, openComingSoonPage);
    return () => {
      window.removeEventListener(FOOTER_CATEGORY_EVENT, openCategory);
      window.removeEventListener(FOOTER_COMING_SOON_EVENT, openComingSoonPage);
    };
  }, []);

  const navigate = (panel: string) => {
    if (panel === "login") {
      onNavigateToLogin(true);
      return;
    }
    if ((panel === "appointments" || panel === "profile" || panel === "booking") && !isLoggedIn) {
      onNavigateToLogin(true);
      return;
    }
    if (panel === "search") setSearchCategory("");
    setPrevPanel(activePanel);
    setActivePanel(panel as ClientPanel);
  };

  const goBack = () => setActivePanel(prevPanel);

  const handleBookingConfirm = (data: BookingData) => {
    setBookingData(data);
    setActivePanel("booking-success");
  };

  const openBooking = async (servicio: Servicio, negocio?: Negocio) => {
    if (!isLoggedIn) { onNavigateToLogin(true); return; }
    try {
      const fullService = await obtenerServicio(servicio.id);
      const selectedBusiness = fullService.negocio || negocio || servicio.negocio;
      if (!selectedBusiness) throw new Error("No se encontró la información del negocio");
      setServicioParaReservar(fullService);
      setNegocioParaReservar(selectedBusiness);
      navigate("booking");
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "No se pudo preparar la reservación");
    }
  };

  const navItems = [
    { id: "home", icon: Home, label: "Inicio" },
    { id: "search", icon: Search, label: "Explorar" },
    { id: "appointments", icon: Calendar, label: "Mis Citas", requiresAuth: true },
    { id: "profile", icon: User, label: "Mi Perfil", requiresAuth: true },
  ];

  const topLevelPanels = ["home", "search", "appointments", "profile"];
  const activeSidebarItem = topLevelPanels.includes(activePanel) ? activePanel : prevPanel;

  const renderContent = () => {
    switch (activePanel) {
      case "search":
        return <SearchScreen isLoggedIn={isLoggedIn} clienteAsociado={clienteAsociado} onNavigate={navigate} onNavigateToService={(id) => { setSelectedServicioId(id); navigate("service-detail"); }} onBookService={(servicio) => openBooking(servicio)} category={searchCategory} onClearCategory={() => setSearchCategory("")} />;
      case "appointments":
        return <AppointmentsScreen onNavigate={navigate} onNavigateToService={(id) => { setSelectedServicioId(id); navigate("service-detail"); }} onBookAgain={(servicio, negocio) => openBooking(servicio, negocio)} />;
      case "profile":
        return <ProfileScreen />;
      case "service-detail":
        return (
          <ServiceDetailScreen
            serviceId={selectedServicioId}
            onBack={goBack}
            onBooking={(servicio, negocio) => { setServicioParaReservar(servicio); setNegocioParaReservar(negocio); navigate("booking"); }}
            isLoggedIn={isLoggedIn}
            clienteAsociado={clienteAsociado}
            onNavigate={navigate}
          />
        );
      case "booking":
        return (
          <BookingScreen
            servicio={servicioParaReservar}
            negocio={negocioParaReservar}
            clienteAsociado={clienteAsociado}
            onBack={goBack}
            onConfirm={handleBookingConfirm}
          />
        );
      case "booking-success":
        return (
          <BookingSuccessScreen
            bookingData={bookingData!}
            onGoHome={() => navigate("home")}
            onViewAppointments={() => navigate("appointments")}
          />
        );
      case "coming-soon":
        return <ComingSoonScreen title={comingSoonTitle} onBack={goBack} />;
      default:
        return <HomeScreen isLoggedIn={isLoggedIn} clienteAsociado={clienteAsociado} onNavigate={navigate} onNavigateToLogin={() => onNavigateToLogin(false)} onShowHelp={() => setShowHelp(true)} onNavigateToService={(id) => { setSelectedServicioId(id); navigate("service-detail"); }} />;
    }
  };

  return (
    <div className="h-[100dvh] lg:h-screen flex flex-col lg:flex-row bg-background overflow-hidden">
      <MobileTopBar
        subtitle={clienteAsociado ? "Cliente empresarial · 10% de descuento" : isLoggedIn ? `Bienvenido, ${obtenerSesion().nombre || ""}` : "Descubre servicios"}
        onHelp={() => setShowHelp(true)}
        onLogout={isLoggedIn ? () => setConfirmLogout(true) : undefined}
      />
      {/* Sidebar estático */}
      <div className="hidden h-full w-56 bg-card border-r border-border lg:flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-border flex-shrink-0">
          <KairosBrand size="md" />
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {clienteAsociado ? "Cuenta empresarial · 10% menos" : isLoggedIn ? `Bienvenido, ${obtenerSesion().nombre || ""}` : "Descubre servicios"}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSidebarItem === item.id;
            const locked = item.requiresAuth && !isLoggedIn;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                } ${locked ? "opacity-60" : ""}`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
                {locked && (
                  <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full flex-shrink-0">
                    Login
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={() => setShowHelp(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-foreground transition-colors"
          >
            <HelpCircle className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">Preguntas frecuentes</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border flex-shrink-0 space-y-1">
          {isLoggedIn && (
            <button
              onClick={() => setConfirmLogout(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/10 text-secondary transition-colors"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">Cerrar Sesión</span>
            </button>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {renderContent()}
      </div>

      <MobileBottomNav items={navItems} active={activeSidebarItem} onNavigate={navigate} />

      {showHelp && <FaqDialog audience="cliente" onClose={() => setShowHelp(false)} />}
      <ConfirmDialog open={confirmLogout} title="¿Cerrar sesión?" description="Tendrás que iniciar sesión nuevamente para consultar y administrar tus citas." confirmLabel="Cerrar sesión" destructive onCancel={() => setConfirmLogout(false)} onConfirm={onLogout} />
    </div>
  );
}
