import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { openComingSoon, openFooterCategory } from "../lib/navigationEvents";
import { KairosBrand } from "./KairosBrand";

const categories = ["Masajes y spa", "Belleza y estética", "Salud y bienestar", "Entrenamiento y deporte"];
const companyLinks = ["Sobre nosotros", "Blog", "Carreras", "Prensa"];
const legalLinks = ["Términos de servicio", "Política de privacidad", "Cookies"];

export function Footer() {
  return <footer className="w-full bg-card border-t border-border mt-auto">
    <div className="container mx-auto px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <KairosBrand size="sm" className="mb-3" />
          <p className="text-xs text-muted-foreground mb-3">El momento perfecto para tu bienestar</p>
          <div className="flex gap-2">
            <button onClick={() => openComingSoon("Facebook")} aria-label="Facebook" className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Facebook className="h-4 w-4 text-muted-foreground" /></button>
            <button onClick={() => openComingSoon("Instagram")} aria-label="Instagram" className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Instagram className="h-4 w-4 text-muted-foreground" /></button>
            <button onClick={() => openComingSoon("X / Twitter")} aria-label="X / Twitter" className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Twitter className="h-4 w-4 text-muted-foreground" /></button>
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm">Categorías</h4>
          <ul className="space-y-1.5 text-xs">{categories.map((category) => <li key={category}><button onClick={() => openFooterCategory(category)} className="text-left text-muted-foreground hover:text-foreground transition-colors">{category}</button></li>)}</ul>
        </div>

        <div>
          <h4 className="mb-2 text-sm">Empresa</h4>
          <ul className="space-y-1.5 text-xs">{companyLinks.map((link) => <li key={link}><button onClick={() => openComingSoon(link)} className="text-left text-muted-foreground hover:text-foreground transition-colors">{link}</button></li>)}</ul>
        </div>

        <div>
          <h4 className="mb-2 text-sm">Contacto</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /><a href="mailto:hola@kairos.com" className="hover:text-foreground transition-colors">hola@kairos.com</a></li>
            <li className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /><a href="tel:+525512345678" className="hover:text-foreground transition-colors">+52 55 1234 5678</a></li>
            <li className="flex items-start gap-2 text-muted-foreground"><MapPin className="h-4 w-4 mt-0.5" /><span>Mazatlán, Sinaloa, México</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border mt-6 pt-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">© 2026 Kairós. Todos los derechos reservados.</p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">{legalLinks.map((link) => <button key={link} onClick={() => openComingSoon(link)} className="hover:text-foreground transition-colors">{link}</button>)}</div>
      </div>
    </div>
  </footer>;
}
