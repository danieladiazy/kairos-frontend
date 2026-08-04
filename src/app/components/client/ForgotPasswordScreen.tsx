import { ArrowLeft, MailWarning } from "lucide-react";

export function ForgotPasswordScreen({ onBack }: { onBack: () => void }) {
  return <div className="h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
    <div className="bg-card border rounded-2xl p-8 max-w-md text-center space-y-5">
      <MailWarning className="h-12 w-12 text-primary mx-auto" />
      <div><h1>Recuperación de acceso</h1><p className="text-muted-foreground mt-2">Por el momento, la recuperación automática no está disponible. Ponte en contacto con el negocio para solicitar ayuda.</p></div>
      <button onClick={onBack} className="w-full py-3 bg-primary text-white rounded-lg flex justify-center gap-2"><ArrowLeft className="h-5 w-5" />Volver al inicio de sesión</button>
    </div>
  </div>;
}
