import { ArrowLeft, Sparkles } from "lucide-react";

export function ComingSoonScreen({ title, onBack }: { title: string; onBack: () => void }) {
  return <div className="h-full bg-background flex items-center justify-center p-6">
    <div className="w-full max-w-lg bg-card border rounded-2xl p-8 text-center space-y-5">
      <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <div><p className="text-sm text-muted-foreground">{title}</p><h1 className="mt-1">Próximamente</h1><p className="mt-3 text-muted-foreground">Estamos preparando esta sección para ofrecerte una mejor experiencia.</p></div>
      <button onClick={onBack} className="mx-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-primary-foreground"><ArrowLeft className="h-4 w-4" />Volver</button>
    </div>
  </div>;
}
