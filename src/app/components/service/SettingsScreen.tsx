import { useState } from "react";
import { Bell, Lock, CreditCard, Globe, Palette, Shield, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function SettingsScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    newAppointment: true,
    cancelation: true,
    reminder: true,
    marketing: false,
    reviews: true,
  });
  const [activeSection, setActiveSection] = useState("notifications");

  const sections = [
    { id: "notifications", icon: Bell, label: "Notificaciones" },
    { id: "security", icon: Lock, label: "Seguridad" },
    { id: "billing", icon: CreditCard, label: "Plan & Facturación" },
    { id: "appearance", icon: Palette, label: "Apariencia" },
    { id: "privacy", icon: Shield, label: "Privacidad" },
  ];

  return (
    <div className="h-screen overflow-auto bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1>Configuración</h1>
          <p className="text-muted-foreground">Administra las preferencias de tu cuenta</p>
        </div>

        <div className="flex gap-6">
          {/* Secciones laterales */}
          <div className="w-56 flex-shrink-0">
            <nav className="space-y-1 sticky top-0">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Contenido */}
          <div className="flex-1 space-y-6">
            {activeSection === "notifications" && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <div>
                  <h3>Notificaciones</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Elige cuándo y cómo quieres recibir alertas
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: "newAppointment", label: "Nueva cita agendada", desc: "Cuando un cliente agenda una cita" },
                    { key: "cancelation", label: "Cita cancelada", desc: "Cuando un cliente cancela su cita" },
                    { key: "reminder", label: "Recordatorio de citas", desc: "30 minutos antes de cada cita" },
                    { key: "reviews", label: "Nueva reseña", desc: "Cuando recibes una nueva calificación" },
                    { key: "marketing", label: "Novedades de Kairós", desc: "Actualizaciones y promociones del producto" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key as keyof typeof prev],
                          }))
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications[item.key as keyof typeof notifications]
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications[item.key as keyof typeof notifications]
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => toast.success("Notificaciones guardadas", { description: "Tus preferencias han sido actualizadas." })}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Guardar</span>
                  </button>
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                  <h3>Cambiar Contraseña</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm">Contraseña actual</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 pr-12 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Nueva contraseña</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Confirmar nueva contraseña</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => toast.success("Contraseña actualizada", { description: "Tu contraseña ha sido cambiada exitosamente." })}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>Actualizar contraseña</span>
                    </button>
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                  <div>
                    <h3>Autenticación de Dos Factores</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Agrega una capa extra de seguridad a tu cuenta
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm">2FA por SMS</p>
                        <p className="text-xs text-muted-foreground">No configurado</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm">
                      Activar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "billing" && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3>Plan Actual</h3>
                      <p className="text-sm text-muted-foreground mt-1">Administra tu suscripción</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">Pro</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Servicios", value: "Ilimitados" },
                      { label: "Citas / mes", value: "Ilimitadas" },
                      { label: "Próxima factura", value: "10 Jul 2026" },
                    ].map((item) => (
                      <div key={item.label} className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm">
                      Ver planes
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors text-sm">
                      Cancelar suscripción
                    </button>
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="mb-4">Método de Pago</h3>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm">•••• •••• •••• 4242</p>
                      <p className="text-xs text-muted-foreground">Vence 12/28</p>
                    </div>
                    <button className="text-sm text-primary hover:underline">Cambiar</button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "appearance" && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <div>
                  <h3>Apariencia</h3>
                  <p className="text-sm text-muted-foreground mt-1">Personaliza cómo se ve tu panel</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm mb-3">Tema</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "light", label: "Claro", bg: "bg-white border-2 border-primary" },
                        { id: "dark", label: "Oscuro", bg: "bg-gray-900 border-2 border-border" },
                        { id: "system", label: "Sistema", bg: "bg-gradient-to-r from-white to-gray-900 border-2 border-border" },
                      ].map((theme) => (
                        <button key={theme.id} className={`p-4 rounded-lg ${theme.bg} flex flex-col items-center gap-2`}>
                          <div className={`w-full h-10 rounded ${theme.id === "dark" ? "bg-gray-700" : "bg-gray-100"}`} />
                          <span className={`text-sm ${theme.id === "dark" ? "text-white" : ""}`}>{theme.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm mb-3">Idioma</p>
                    <select className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option>Español (México)</option>
                      <option>Español (España)</option>
                      <option>English</option>
                    </select>
                  </div>

                  <div>
                    <p className="text-sm mb-3">Zona Horaria</p>
                    <select className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option>América/Mexico_City (UTC-6)</option>
                      <option>América/Bogota (UTC-5)</option>
                      <option>América/Buenos_Aires (UTC-3)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => toast.success("Apariencia guardada", { description: "Tus preferencias de idioma y zona horaria fueron actualizadas." })}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Guardar</span>
                  </button>
                </div>
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <div>
                  <h3>Privacidad</h3>
                  <p className="text-sm text-muted-foreground mt-1">Controla cómo se usa tu información</p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Perfil público", desc: "Tu negocio aparece en búsquedas de Kairós" },
                    { label: "Mostrar calificaciones", desc: "Los clientes pueden ver tus reseñas" },
                    { label: "Compartir estadísticas", desc: "Contribuye a mejorar Kairós de forma anónima" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">Zona de peligro</p>
                  <button className="px-4 py-2 rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors text-sm">
                    Eliminar mi cuenta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
