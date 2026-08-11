import { ArrowLeft, Building2, Loader2, Store, User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { buscarNegocios, registrar, type Negocio, type Rol, type TipoAcceso } from "../../lib/api";
import { errorTelefono, limpiarTelefono } from "../../lib/validation";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface RegisterScreenProps {
  onRegister: (userType: TipoAcceso) => void;
  onBackToLogin: () => void;
  clientOnly?: boolean;
}

const roleFromType: Record<TipoAcceso, Rol> = {
  client: "CLIENTE",
  "company-client": "CLIENTEEMPRESA",
  service: "NEGOCIO",
};

export function RegisterScreen({ onRegister, onBackToLogin, clientOnly = false }: RegisterScreenProps) {
  const [userType, setUserType] = useState<TipoAcceso>("client");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState(false);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [negocioId, setNegocioId] = useState("");
  const [cargandoNegocios, setCargandoNegocios] = useState(false);
  const [errorNegocios, setErrorNegocios] = useState("");
  const [negociosConsultados, setNegociosConsultados] = useState(false);

  useEffect(() => {
    if (userType !== "company-client" || negociosConsultados) return;
    setNegociosConsultados(true);
    setCargandoNegocios(true);
    setErrorNegocios("");
    buscarNegocios()
      .then((items) => setNegocios(items.sort((a, b) => a.nombre.localeCompare(b.nombre))))
      .catch(() => setErrorNegocios("No se pudieron cargar los negocios. Intenta nuevamente cuando el servicio esté disponible."))
      .finally(() => setCargandoNegocios(false));
  }, [userType, negociosConsultados]);

  const availableTypes: TipoAcceso[] = clientOnly
    ? ["client", "company-client"]
    : ["client", "company-client", "service"];

  const selectType = (type: TipoAcceso) => {
    setUserType(type);
    setError(null);
    setFieldErrors({});
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const nextErrors: Record<string, string> = {};
    if (!nombre.trim()) nextErrors.nombre = userType === "service" ? "El nombre del negocio es obligatorio" : "El nombre es obligatorio";
    if (!email.trim()) nextErrors.email = "El correo es obligatorio";
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Ingresa un correo válido";
    const phoneMessage = errorTelefono(telefono);
    if (phoneMessage) nextErrors.telefono = phoneMessage;
    if (!password) nextErrors.password = "La contraseña es obligatoria";
    else if (password.length < 6) nextErrors.password = "La contraseña debe tener al menos 6 caracteres";
    if (!confirmPassword) nextErrors.confirmPassword = "Confirma tu contraseña";
    else if (password !== confirmPassword) nextErrors.confirmPassword = "Las contraseñas no coinciden";
    if (!acceptedTerms) nextErrors.terms = "Debes aceptar los términos y condiciones";
    if (userType === "company-client" && !negocioId) nextErrors.negocioId = "Selecciona el negocio al que estás asociado";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setCargando(true);
    try {
      await registrar({
        nombre,
        email,
        password,
        telefono,
        rol: roleFromType[userType],
        negocioId: userType === "company-client" ? Number(negocioId) : undefined,
      });
      const description = userType === "company-client"
        ? "Enviamos tu solicitud al negocio. Mientras la revisan navegarás como cliente normal."
        : "Bienvenido a Kairós. Tu cuenta ha sido registrada.";
      toast.success("¡Cuenta creada!", { description });
      onRegister(userType);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo crear la cuenta");
    } finally {
      setCargando(false);
    }
  };

  const subtitle = userType === "service"
    ? "Registra tu negocio en Kairós"
    : userType === "company-client"
      ? "Crea tu cuenta asociada y recibe 10% de descuento"
      : "Únete a Kairós y comienza a agendar";

  return (
    <div className="min-h-[100dvh] w-full flex items-start justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-4 lg:py-8">
      <div className="w-full max-w-lg p-4">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
          <button onClick={onBackToLogin} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Volver al inicio</span>
          </button>

          <div className="text-center mb-6">
            <h2 className="text-xl">Crear cuenta</h2>
            <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
          </div>

          <div className={`grid gap-2 mb-4 ${availableTypes.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
            <button type="button" onClick={() => selectType("client")} className={`min-h-[76px] flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border-2 transition-all ${userType === "client" ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border hover:border-primary/50"}`}>
              <User className="h-5 w-5" />
              <span className="text-xs text-center">Cliente</span>
            </button>
            <button type="button" onClick={() => selectType("company-client")} className={`min-h-[76px] flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border-2 transition-all ${userType === "company-client" ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border hover:border-primary/50"}`}>
              <Building2 className="h-5 w-5" />
              <span className="text-xs text-center leading-tight">Cliente empresarial</span>
            </button>
            {!clientOnly && (
              <button type="button" onClick={() => selectType("service")} className={`min-h-[76px] flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border-2 transition-all ${userType === "service" ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border hover:border-primary/50"}`}>
                <Store className="h-5 w-5" />
                <span className="text-xs text-center">Negocio</span>
              </button>
            )}
          </div>

          {userType === "company-client" && (
            <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
              Selecciona el negocio al que perteneces. El descuento del 10% se activará cuando el negocio apruebe tu solicitud.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-2">{error}</div>}

            {userType === "company-client" && (
              <div className="space-y-1.5">
                <Label htmlFor="business" className="text-sm">Negocio al que estás asociado</Label>
                <div className="relative">
                  <select
                    id="business"
                    value={negocioId}
                    disabled={cargandoNegocios}
                    aria-invalid={!!fieldErrors.negocioId}
                    onChange={(event) => { setNegocioId(event.target.value); setFieldErrors((current) => ({ ...current, negocioId: "" })); }}
                    className={`h-10 w-full appearance-none rounded-md border bg-input-background px-3 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${fieldErrors.negocioId ? "border-destructive" : "border-input"}`}
                  >
                    <option value="">Selecciona un negocio</option>
                    {negocios.map((negocio) => <option key={negocio.id} value={negocio.id}>{negocio.nombre}</option>)}
                  </select>
                  {cargandoNegocios && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
                {fieldErrors.negocioId && <p className="text-xs text-destructive">{fieldErrors.negocioId}</p>}
                {errorNegocios && <p className="text-xs text-destructive">{errorNegocios}</p>}
                {!cargandoNegocios && !errorNegocios && negocios.length === 0 && <p className="text-xs text-muted-foreground">Todavía no hay negocios disponibles para asociación.</p>}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">{userType === "service" ? "Nombre del negocio" : "Nombre completo"}</Label>
              <Input id="name" type="text" placeholder={userType === "service" ? "Spa Belleza" : "Juan Pérez"} aria-invalid={!!fieldErrors.nombre} className={`h-9 text-sm ${fieldErrors.nombre ? "border-destructive" : ""}`} value={nombre} onChange={(event) => { setNombre(event.target.value); setFieldErrors((current) => ({ ...current, nombre: "" })); }} />
              {fieldErrors.nombre && <p className="text-xs text-destructive">{fieldErrors.nombre}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="tu@email.com" aria-invalid={!!fieldErrors.email} className={`h-9 text-sm ${fieldErrors.email ? "border-destructive" : ""}`} value={email} onChange={(event) => { setEmail(event.target.value); setFieldErrors((current) => ({ ...current, email: "" })); }} />
              {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm">Teléfono</Label>
              <Input id="phone" type="tel" inputMode="tel" placeholder="+52 55 1234 5678" aria-invalid={!!fieldErrors.telefono} className={`h-9 text-sm ${fieldErrors.telefono ? "border-destructive" : ""}`} value={telefono} onChange={(event) => { setTelefono(limpiarTelefono(event.target.value)); setFieldErrors((current) => ({ ...current, telefono: "" })); }} />
              {fieldErrors.telefono && <p className="text-xs text-destructive">{fieldErrors.telefono}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">Contraseña</Label>
              <Input id="password" type="password" placeholder="••••••••" aria-invalid={!!fieldErrors.password} className={`h-9 text-sm ${fieldErrors.password ? "border-destructive" : ""}`} value={password} onChange={(event) => { setPassword(event.target.value); setFieldErrors((current) => ({ ...current, password: "" })); }} />
              {fieldErrors.password && <p className="text-xs text-destructive">{fieldErrors.password}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm">Confirmar contraseña</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" aria-invalid={!!fieldErrors.confirmPassword} className={`h-9 text-sm ${fieldErrors.confirmPassword ? "border-destructive" : ""}`} value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); setFieldErrors((current) => ({ ...current, confirmPassword: "" })); }} />
              {fieldErrors.confirmPassword && <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>}
            </div>

            <div className="flex items-start gap-2 text-xs pt-1">
              <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(checked) => { setAcceptedTerms(checked === true); setFieldErrors((current) => ({ ...current, terms: "" })); }} className={`mt-0.5 ${fieldErrors.terms ? "border-destructive" : ""}`} />
              <label htmlFor="terms" className="text-muted-foreground cursor-pointer leading-tight">
                Acepto los <a href="#" className="text-primary hover:underline">términos y condiciones</a> y la <a href="#" className="text-primary hover:underline">política de privacidad</a>
              </label>
            </div>
            {fieldErrors.terms && <p className="text-xs text-destructive">{fieldErrors.terms}</p>}

            <button type="submit" disabled={cargando} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm text-sm">
              <UserPlus className="h-4 w-4" />
              <span>{cargando ? "Creando..." : "Crear cuenta"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
