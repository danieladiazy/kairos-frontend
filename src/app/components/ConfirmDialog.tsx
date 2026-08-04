import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
  destructive?: boolean;
}

export function ConfirmDialog({ open, title, description, confirmLabel, onCancel, onConfirm, busy = false, destructive = false }: Props) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4" onClick={busy ? undefined : onCancel}>
    <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${destructive ? "bg-destructive/10 text-destructive" : "bg-yellow-100 text-yellow-700"}`}><AlertTriangle className="h-5 w-5" /></div>
      <h2 id="confirm-title" className="mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button disabled={busy} onClick={onCancel} className="rounded-lg border px-4 py-2.5 disabled:opacity-50">Volver</button>
        <button disabled={busy} onClick={onConfirm} className={`rounded-lg px-4 py-2.5 text-white disabled:opacity-50 ${destructive ? "bg-destructive" : "bg-primary"}`}>{busy ? "Procesando..." : confirmLabel}</button>
      </div>
    </div>
  </div>;
}
