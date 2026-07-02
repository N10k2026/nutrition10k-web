'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'n10k-nutrition-cookie-consent';
const CONSENT_EVENT = 'n10k-nutrition-cookie-consent-change';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAction = (action: 'accepted' | 'rejected' | 'dismissed') => {
    localStorage.setItem(COOKIE_CONSENT_KEY, action);
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="glass-nav rounded-2xl p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-[#E30613]/15 flex items-center justify-center">
            <Cookie className="h-5 w-5 text-[#E30613]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground/90 leading-relaxed">
              Usamos cookies para mejorar tu experiencia. Al continuar, aceptas nuestra
              política de cookies.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button
                onClick={() => handleAction('accepted')}
                className="px-4 py-1.5 rounded-full bg-[#E30613] hover:bg-[#c50511] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Aceptar
              </button>
              <button
                onClick={() => handleAction('rejected')}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-foreground text-xs font-bold transition-colors cursor-pointer"
              >
                Rechazar
              </button>
            </div>
          </div>
          <button
            onClick={() => handleAction('dismissed')}
            className="hidden sm:block shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cerrar aviso de cookies"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
