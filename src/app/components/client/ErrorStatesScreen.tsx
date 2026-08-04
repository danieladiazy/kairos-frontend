import {
  AlertCircle, AlertTriangle, XCircle, WifiOff, ServerCrash,
  Lock, Clock, Search, Inbox, Ban, RefreshCw, ArrowLeft,
  ShieldAlert, FileX, CreditCard, MapPin, CalendarX, Trash2
} from "lucide-react";

export function ErrorStatesScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <header className="bg-card border-b border-border px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1>Mensajes de Error</h1>
            <p className="text-sm text-muted-foreground">Biblioteca de estados de error para diseño</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-6 max-w-5xl mx-auto space-y-10">

          {/* ── BANNERS INLINE ── */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Banners inline</h2>

            {/* Error */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-900">
              <XCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">No se pudo completar la reserva</p>
                <p className="text-sm text-orange-700 mt-0.5">Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.</p>
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Tu sesión está por expirar</p>
                <p className="text-sm text-amber-700 mt-0.5">Serás desconectado en 5 minutos. Guarda tus cambios.</p>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
              <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Servicio temporalmente no disponible</p>
                <p className="text-sm text-blue-700 mt-0.5">Este establecimiento no acepta citas en línea por el momento.</p>
              </div>
            </div>

            {/* Con acción */}
            <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200">
              <div className="flex items-center gap-3">
                <WifiOff className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <p className="text-sm text-orange-900 font-semibold">Sin conexión a Internet</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 text-sm transition-colors">
                <RefreshCw className="h-3.5 w-3.5" /> Reintentar
              </button>
            </div>
          </section>

          {/* ── TOASTS ── */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Toasts / Notificaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border shadow-md w-full">
                <div className="p-1.5 rounded-lg bg-orange-100"><XCircle className="h-4 w-4 text-orange-500" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">Error al guardar</p>
                  <p className="text-xs text-muted-foreground truncate">No se pudo guardar tu perfil.</p>
                </div>
                <button className="text-muted-foreground hover:text-foreground text-xs">✕</button>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border shadow-md w-full">
                <div className="p-1.5 rounded-lg bg-amber-100"><AlertTriangle className="h-4 w-4 text-amber-500" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">Advertencia de pago</p>
                  <p className="text-xs text-muted-foreground truncate">Tu tarjeta está por vencer.</p>
                </div>
                <button className="text-muted-foreground hover:text-foreground text-xs">✕</button>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-orange-600 text-white shadow-md w-full">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Cita cancelada</p>
                  <p className="text-xs text-white/70">Tu reserva fue eliminada.</p>
                </div>
                <button className="text-white/70 hover:text-white text-xs">✕</button>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500 text-white shadow-md w-full">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Tiempo agotado</p>
                  <p className="text-xs text-white/80">La reserva expiró sin confirmar.</p>
                </div>
                <button className="text-white/70 hover:text-white text-xs">✕</button>
              </div>
            </div>
          </section>

          {/* ── ERRORES DE CAMPO ── */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Errores de campo / Formulario</h2>
            <div className="bg-card border border-border rounded-xl p-6 space-y-5">

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Correo electrónico</label>
                <input
                  readOnly
                  defaultValue="juan@@correo"
                  className="w-full px-4 py-3 rounded-lg bg-orange-50 border-2 border-orange-400 text-foreground focus:outline-none"
                />
                <p className="text-xs text-orange-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> El formato del correo no es válido.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Contraseña</label>
                <input
                  readOnly
                  type="password"
                  defaultValue="123"
                  className="w-full px-4 py-3 rounded-lg bg-orange-50 border-2 border-orange-400 text-foreground focus:outline-none"
                />
                <p className="text-xs text-orange-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Mínimo 8 caracteres, una mayúscula y un número.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Teléfono</label>
                <input
                  readOnly
                  defaultValue=""
                  placeholder="Este campo es obligatorio"
                  className="w-full px-4 py-3 rounded-lg bg-orange-50 border-2 border-orange-400 placeholder:text-orange-400 focus:outline-none"
                />
                <p className="text-xs text-orange-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Campo requerido.</p>
              </div>

              <button className="w-full py-3 rounded-lg bg-muted text-muted-foreground cursor-not-allowed text-sm" disabled>
                Corrige los errores para continuar
              </button>
            </div>
          </section>

          {/* ── ESTADOS VACÍOS ── */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Estados vacíos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold">Sin resultados</p>
                  <p className="text-sm text-muted-foreground mt-1">No encontramos servicios que coincidan con tu búsqueda.</p>
                </div>
                <button className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">Limpiar filtros</button>
              </div>

              <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                  <Inbox className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold">Sin citas agendadas</p>
                  <p className="text-sm text-muted-foreground mt-1">Aún no tienes ninguna reserva. ¡Empieza explorando!</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors">Explorar servicios</button>
              </div>

              <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                  <CalendarX className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold">Cita no disponible</p>
                  <p className="text-sm text-muted-foreground mt-1">El horario seleccionado ya fue ocupado por otro usuario.</p>
                </div>
                <button className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">Ver otros horarios</button>
              </div>

              <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                  <MapPin className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold">Sin servicios cercanos</p>
                  <p className="text-sm text-muted-foreground mt-1">No hay negocios disponibles en tu zona por el momento.</p>
                </div>
                <button className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">Ampliar búsqueda</button>
              </div>
            </div>
          </section>

          {/* ── PANTALLAS COMPLETAS ── */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Pantallas de error completas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* 404 */}
              <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center gap-3 min-h-64">
                <div className="w-16 h-16 rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center">
                  <FileX className="h-8 w-8 text-orange-400" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-orange-400">404</p>
                  <p className="font-semibold mt-1">Página no encontrada</p>
                  <p className="text-sm text-muted-foreground mt-1">El recurso que buscas no existe o fue movido.</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors">Ir al inicio</button>
              </div>

              {/* 500 */}
              <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center gap-3 min-h-64">
                <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                  <ServerCrash className="h-8 w-8 text-amber-400" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-amber-400">500</p>
                  <p className="font-semibold mt-1">Error del servidor</p>
                  <p className="text-sm text-muted-foreground mt-1">Algo salió mal de nuestro lado. Estamos trabajando en ello.</p>
                </div>
                <button className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4" /> Reintentar
                </button>
              </div>

              {/* Sin conexión */}
              <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center gap-3 min-h-64">
                <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center">
                  <WifiOff className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold">Sin conexión</p>
                  <p className="text-sm text-muted-foreground mt-1">Revisa tu conexión a Internet e intenta de nuevo.</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                  <RefreshCw className="h-4 w-4" /> Intentar de nuevo
                </button>
              </div>
            </div>
          </section>

          {/* ── ERRORES CONTEXTUALES ── */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Errores contextuales</h2>
            <div className="space-y-3">

              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Lock className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Acceso restringido</p>
                  <p className="text-xs text-muted-foreground">Necesitas iniciar sesión para ver esta sección.</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors">Entrar</button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Tiempo de reserva expirado</p>
                  <p className="text-xs text-muted-foreground">El tiempo para confirmar tu cita ha vencido. Inicia de nuevo.</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors">Reiniciar</button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Pago rechazado</p>
                  <p className="text-xs text-muted-foreground">Tu método de pago fue declinado. Verifica tus datos.</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors">Actualizar</button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Ban className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Cuenta suspendida</p>
                  <p className="text-xs text-muted-foreground">Tu cuenta ha sido suspendida temporalmente. Contacta soporte.</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors">Soporte</button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Verificación requerida</p>
                  <p className="text-xs text-muted-foreground">Debes verificar tu correo antes de realizar una reserva.</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors">Verificar</button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-orange-900">¿Eliminar tu cuenta?</p>
                  <p className="text-xs text-orange-700">Esta acción es permanente y no se puede deshacer.</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-orange-600 text-white text-sm hover:bg-orange-700 transition-colors">Eliminar</button>
              </div>
            </div>
          </section>

          {/* ── CHIPS / BADGES ── */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Chips & Badges de estado</h2>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold"><XCircle className="h-3.5 w-3.5" /> Error</span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold"><AlertTriangle className="h-3.5 w-3.5" /> Advertencia</span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold"><AlertCircle className="h-3.5 w-3.5" /> Aviso</span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-300 text-orange-700 text-xs font-semibold">Cancelada</span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-600 text-xs font-semibold">Pendiente</span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-600 text-white text-xs font-semibold"><Ban className="h-3.5 w-3.5" /> Bloqueado</span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">No disponible</span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold"><Lock className="h-3.5 w-3.5" /> Restringido</span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-600 text-xs font-semibold"><Clock className="h-3.5 w-3.5" /> Expirado</span>
              </div>
            </div>
          </section>

          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}
