// ============================================================================
// PANTALLA DE REGISTRO
// ============================================================================
// Formulario de registro de cuenta nueva, conectado al backend (usa la
// funcion registrar() de lib/api.ts, que hace POST /api/auth/registro).
//
// Flujo:
//   1. El usuario elige si es Cliente o Negocio (variable userType) y
//      llena sus datos.
//   2. Al enviar, se valida que las dos contrasenas coincidan del lado
//      del navegador (antes de gastar una llamada al backend).
//   3. Se llama a registrar({...}), mandando el rol elegido como
//      "CLIENTE" o "NEGOCIO" (asi es como el backend espera el enum Rol,
//      ver Rol.java).
//   4. Si el correo ya estaba registrado, el backend responde error 409
//      y aqui se muestra ese mensaje.
//   5. Si todo sale bien, la sesion queda iniciada automaticamente (ver
//      api.ts) y se llama a onRegister() para mandar al usuario a su
//      dashboard correspondiente.
// ============================================================================
import { UserPlus, ArrowLeft, User, Store } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { registrar } from "../../lib/api";

interface RegisterScreenProps {
  onRegister: (userType: 'client' | 'service') => void;
  onBackToLogin: () => void;
  clientOnly?: boolean;
}

export function RegisterScreen({ onRegister, onBackToLogin, clientOnly = false }: RegisterScreenProps) {
  const [userType, setUserType] = useState<'client' | 'service'>('client');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);
    try {
      await registrar({
        nombre,
        email,
        password,
        telefono,
        rol: userType === 'service' ? 'NEGOCIO' : 'CLIENTE',
      });
      toast.success("¡Cuenta creada!", { description: "Bienvenido a Kairós. Tu cuenta ha sido registrada." });
      onRegister(userType);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-start sm:items-center justify-center overflow-y-auto bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-4">
      <div className="w-full max-w-md p-4">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
          <button
            onClick={onBackToLogin}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Volver al inicio</span>
          </button>

          <div className="text-center mb-6">
            <h2 className="text-xl">Crear Cuenta</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {userType === 'client' ? 'Únete a Kairós y comienza a agendar' : 'Registra tu negocio en Kairós'}
            </p>
          </div>

          {!clientOnly && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setUserType('client')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                  userType === 'client'
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <User className="h-5 w-5" />
                <span className="text-xs">Soy Cliente</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('service')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                  userType === 'service'
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Store className="h-5 w-5" />
                <span className="text-xs">Soy Negocio</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">
                {userType === 'client' ? 'Nombre Completo' : 'Nombre del Negocio'}
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={userType === 'client' ? 'Juan Pérez' : 'Spa Belleza'}
                className="h-9 text-sm"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="h-9 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+52 55 1234 5678"
                className="h-9 text-sm"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-9 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="h-9 text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-start gap-2 text-xs pt-1">
              <Checkbox 
                id="terms" 
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                className="mt-0.5"
              />
              <label htmlFor="terms" className="text-muted-foreground cursor-pointer leading-tight">
                Acepto los <a href="#" className="text-primary hover:underline">términos y condiciones</a> y la <a href="#" className="text-primary hover:underline">política de privacidad</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={!acceptedTerms || cargando}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md text-sm"
            >
              <UserPlus className="h-4 w-4" />
              <span>{cargando ? "Creando..." : "Crear Cuenta"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
