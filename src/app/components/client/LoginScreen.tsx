import {
  BarChart3,
  Building2,
  CheckCircle2,
  LogIn,
  Search,
  Store,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import {
  iniciarSesion,
  limpiarSesion,
  type Rol,
  type TipoAcceso,
} from "../../lib/api";
import { etiquetaRol } from "../../lib/pricing";
import { KairosBrand } from "../KairosBrand";

interface Props {
  onLogin: (type: TipoAcceso) => void;
  onNavigateToRegister: () => void;
  onForgotPassword: () => void;
  clientOnly?: boolean;
}

const roleInfo: Record<TipoAcceso, { title: string; description: string; items: string[] }> = {
  client: {
    title: "Reserva servicios con confianza",
    description: "Descubre negocios, compara opciones y organiza tus citas desde un solo lugar.",
    items: [
      "Consulta precios, duración y horarios disponibles",
      "Reserva, cancela o reagenda tus citas",
      "Mantén actualizados tus datos de contacto",
    ],
  },
  "company-client": {
    title: "Beneficios para clientes asociados",
    description: "Ingresa con tu cuenta vinculada a una empresa y aprovecha beneficios especiales.",
    items: [
      "Recibe 10% de descuento en los servicios",
      "Consulta siempre el precio original y el precio con beneficio",
      "Administra tus reservaciones como cualquier cliente",
    ],
  },
  service: {
    title: "Gestiona tu operación en un solo lugar",
    description: "Administra la presencia de tu negocio, tus servicios y tu agenda.",
    items: [
      "Publica servicios, precios y disponibilidad",
      "Confirma, completa, cancela o reagenda citas",
      "Consulta tu actividad, clientes e ingresos",
    ],
  },
};

const roleFromAccess: Record<TipoAcceso, Rol> = {
  client: "CLIENTE",
  "company-client": "CLIENTEEMPRESA",
  service: "NEGOCIO",
};

const accessFromRole = (rol: Rol): TipoAcceso => {
  if (rol === "NEGOCIO") return "service";
  if (rol === "CLIENTEEMPRESA") return "company-client";
  return "client";
};

export function LoginScreen({
  onLogin,
  onNavigateToRegister,
  onForgotPassword,
  clientOnly = false,
}: Props) {
  const [userType, setUserType] = useState<TipoAcceso>("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const availableTypes: TipoAcceso[] = clientOnly
    ? ["client", "company-client"]
    : ["client", "company-client", "service"];
  const selected = availableTypes.includes(userType) ? userType : "client";
  const info = roleInfo[selected];

  const selectType = (type: TipoAcceso) => {
    setUserType(type);
    setError(null);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const nextErrors: Record<string, string> = {};
    if (!email.trim()) nextErrors.email = "El correo es obligatorio";
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Ingresa un correo válido";
    if (!password) nextErrors.password = "La contraseña es obligatoria";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);

    try {
      const result = await iniciarSesion(email, password);
      const actual = accessFromRole(result.rol);

      if (result.rol !== roleFromAccess[selected]) {
        limpiarSesion();
        setError(`Esta cuenta está registrada como ${etiquetaRol(result.rol)}. Selecciona esa opción para continuar.`);
        return;
      }

      onLogin(actual);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const accessLabel = selected === "service"
    ? "Acceso para negocios"
    : selected === "company-client"
      ? "Cliente asociado a empresa"
      : "Acceso para clientes";

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-start lg:items-center justify-center p-3 sm:p-8">
      <div className="w-full max-w-5xl grid lg:grid-cols-[0.9fr_1.1fr] bg-card border rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
        <aside className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 sm:p-10 flex flex-col justify-between lg:min-h-[650px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              {accessLabel}
            </div>
            <h1 className="mt-5 sm:mt-8 text-3xl sm:text-4xl text-white">{info.title}</h1>
            <p className="mt-3 sm:mt-4 text-white/80 leading-relaxed">{info.description}</p>
            <div className="mt-5 sm:mt-8 space-y-3 sm:space-y-4">
              {info.items.map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
                  <span className="text-sm sm:text-base text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex mt-10 items-center gap-3 text-white/80">
            {selected === "service"
              ? <BarChart3 className="h-8 w-8" />
              : selected === "company-client"
                ? <Building2 className="h-8 w-8" />
                : <Search className="h-8 w-8" />}
            <span className="text-sm">
              {selected === "company-client"
                ? "Tu beneficio se aplica automáticamente."
                : "Organiza tus citas de forma sencilla y segura."}
            </span>
          </div>
        </aside>

        <section className="p-5 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="mb-6 sm:mb-8">
            <KairosBrand size="lg" />
            <p className="text-muted-foreground mt-3">
              Elige el tipo de cuenta y proporciona tus credenciales.
            </p>
          </div>

          <div className={`grid gap-2 sm:gap-3 mb-6 ${availableTypes.length === 3 ? "grid-cols-3" : "grid-cols-2"}`} role="group" aria-label="Tipo de cuenta">
            {availableTypes.includes("client") && (
              <button type="button" onClick={() => selectType("client")} className={`min-h-[84px] flex flex-col items-center justify-center gap-2 px-2 rounded-xl border-2 transition-all ${selected === "client" ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}>
                <User className="h-5 w-5" />
                <span className="text-xs sm:text-sm text-center leading-tight">Cliente</span>
              </button>
            )}
            {availableTypes.includes("company-client") && (
              <button type="button" onClick={() => selectType("company-client")} className={`min-h-[84px] flex flex-col items-center justify-center gap-2 px-2 rounded-xl border-2 transition-all ${selected === "company-client" ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}>
                <Building2 className="h-5 w-5" />
                <span className="text-xs sm:text-sm text-center leading-tight">Cliente empresarial</span>
              </button>
            )}
            {availableTypes.includes("service") && (
              <button type="button" onClick={() => selectType("service")} className={`min-h-[84px] flex flex-col items-center justify-center gap-2 px-2 rounded-xl border-2 transition-all ${selected === "service" ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}>
                <Store className="h-5 w-5" />
                <span className="text-xs sm:text-sm text-center leading-tight">Negocio</span>
              </button>
            )}
          </div>

          <form onSubmit={submit} noValidate className="space-y-5">
            {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3">{error}</div>}
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm">Correo electrónico</label>
              <input id="login-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setFieldErrors((current) => ({ ...current, email: "" })); }} aria-invalid={!!fieldErrors.email} placeholder="tu@email.com" className={`w-full min-h-[46px] px-4 rounded-xl border bg-input-background focus:outline-none focus:ring-2 ${fieldErrors.email ? "border-destructive focus:ring-destructive/30" : "focus:ring-primary/50"}`} />
              {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm">Contraseña</label>
              <input id="login-password" type="password" value={password} onChange={(event) => { setPassword(event.target.value); setFieldErrors((current) => ({ ...current, password: "" })); }} aria-invalid={!!fieldErrors.password} placeholder="••••••••" className={`w-full min-h-[46px] px-4 rounded-xl border bg-input-background focus:outline-none focus:ring-2 ${fieldErrors.password ? "border-destructive focus:ring-destructive/30" : "focus:ring-primary/50"}`} />
              {fieldErrors.password && <p className="text-xs text-destructive">{fieldErrors.password}</p>}
            </div>
            <button type="submit" disabled={loading} className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 whitespace-nowrap">
              <LogIn className="h-5 w-5" />
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <button type="button" onClick={onNavigateToRegister} className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-xl border hover:bg-muted whitespace-nowrap">
              <UserPlus className="h-4 w-4" />
              Crear cuenta
            </button>
            <button type="button" onClick={onForgotPassword} className="min-h-[44px] inline-flex items-center justify-center px-4 rounded-xl border hover:bg-muted whitespace-nowrap text-sm">
              Olvidé mi contraseña
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
