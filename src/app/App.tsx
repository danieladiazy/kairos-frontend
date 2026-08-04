import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { LoginScreen } from "./components/client/LoginScreen";
import { RegisterScreen } from "./components/client/RegisterScreen";
import { ForgotPasswordScreen } from "./components/client/ForgotPasswordScreen";
import { ClientDashboard } from "./components/client/ClientDashboard";
import { ServiceDashboard } from "./components/service/ServiceDashboard";
import { limpiarSesion, obtenerSesion } from "./lib/api";

export default function App() {
  const sesionInicial = obtenerSesion();
  const rolValido = sesionInicial.rol === "CLIENTE" || sesionInicial.rol === "NEGOCIO";
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(sesionInicial.token && rolValido));
  const [userType, setUserType] = useState<'client' | 'service'>(sesionInicial.rol === "NEGOCIO" ? "service" : "client");
  const [currentScreen, setCurrentScreen] = useState(
    sesionInicial.token && rolValido
      ? sesionInicial.rol === "NEGOCIO" ? "service-dashboard" : "home"
      : "login",
  );
  const [loginClientOnly, setLoginClientOnly] = useState(false);

  const handleLogout = () => {
    limpiarSesion();
    setIsLoggedIn(false);
    setUserType('client');
    setLoginClientOnly(false);
    setCurrentScreen("login");
  };

  useEffect(() => {
    const sesionExpirada = () => handleLogout();
    window.addEventListener("kairos:sesion-expirada", sesionExpirada);
    return () => window.removeEventListener("kairos:sesion-expirada", sesionExpirada);
  }, []);

  const handleLogin = (type: 'client' | 'service') => {
    setLoginClientOnly(false);
    setIsLoggedIn(true);
    setUserType(type);
    setCurrentScreen(type === 'service' ? "service-dashboard" : "home");
    setTimeout(() => toast.success(type === 'service' ? "Bienvenido a tu panel" : "¡Bienvenido de vuelta!", {
      description: type === 'service' ? "Accediste como negocio." : "Sesión iniciada correctamente.",
    }), 300);
  };

  if (currentScreen === "forgot-password") {
    return (
      <div className="h-screen overflow-hidden">
        <Toaster position="top-right" richColors closeButton />
        <ForgotPasswordScreen onBack={() => setCurrentScreen("login")} />
      </div>
    );
  }

  if (currentScreen === "login") {
    return (
      <div className="h-screen overflow-hidden">
        <Toaster position="top-right" richColors closeButton />
        <LoginScreen
          onLogin={handleLogin}
          onNavigateToRegister={() => setCurrentScreen("register")}
          onForgotPassword={() => setCurrentScreen("forgot-password")}
          clientOnly={loginClientOnly}
        />
      </div>
    );
  }

  if (currentScreen === "register") {
    return (
      <div className="h-screen overflow-hidden">
        <Toaster position="top-right" richColors closeButton />
        <RegisterScreen
          onRegister={handleLogin}
          onBackToLogin={() => setCurrentScreen("login")}
          clientOnly={loginClientOnly}
        />
      </div>
    );
  }

  // No se muestra ninguna parte de la plataforma sin una sesión válida.
  // Este respaldo también cubre rutas internas o estados restaurados del navegador.
  if (!isLoggedIn) {
    return (
      <div className="h-screen overflow-hidden">
        <Toaster position="top-right" richColors closeButton />
        <LoginScreen
          onLogin={handleLogin}
          onNavigateToRegister={() => setCurrentScreen("register")}
          onForgotPassword={() => setCurrentScreen("forgot-password")}
          clientOnly={loginClientOnly}
        />
      </div>
    );
  }

  if (currentScreen === "service-dashboard" && isLoggedIn && userType === 'service') {
    return (
      <div className="h-screen overflow-hidden">
        <Toaster position="top-right" richColors closeButton />
        <ServiceDashboard onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <Toaster position="top-right" richColors closeButton />
      <ClientDashboard
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onNavigateToLogin={(clientOnly = false) => { setLoginClientOnly(clientOnly); setCurrentScreen("login"); }}
      />
    </div>
  );
}
