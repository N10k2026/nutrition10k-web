'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/site-config';

const WHATSAPP_MESSAGE = 'Hola Nutrition 10K, quiero información sobre sus productos';
const COOKIE_CONSENT_KEY = 'n10k-nutrition-cookie-consent';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [cookieVisible, setCookieVisible] = useState(true);

  useEffect(() => {
    const checkCookie = () => {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      setCookieVisible(!consent);
    };
    checkCookie();

    const onStorage = (e: StorageEvent) => {
      if (e.key === COOKIE_CONSENT_KEY || e.key === null) {
        checkCookie();
      }
    };
    const onConsentChange = () => checkCookie();
    window.addEventListener('storage', onStorage);
    window.addEventListener('n10k-nutrition-cookie-consent-change', onConsentChange);
    window.addEventListener('focus', checkCookie);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('n10k-nutrition-cookie-consent-change', onConsentChange);
      window.removeEventListener('focus', checkCookie);
    };
  }, []);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowTooltip(true), 2000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 5000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClick = useCallback(() => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, '_blank');
  }, []);

  const handleMouseEnter = useCallback(() => setShowTooltip(true), []);
  const handleMouseLeave = useCallback(() => setShowTooltip(false), []);

  if (cookieVisible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-24 left-4 sm:left-6 z-40" data-whatsapp-btn>
      <div
        className={`absolute bottom-full left-0 mb-3 px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl shadow-black/50 whitespace-nowrap transition-all duration-500 pointer-events-none ${
          showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <p className="text-white text-xs font-bold">¿Necesitas ayuda?</p>
        <p className="text-white/50 text-[10px]">Escríbenos por WhatsApp</p>
        <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-[#1A1A1A] border-r border-b border-white/10 rotate-45" />
      </div>

      <div className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping" style={{ animationDuration: '2s' }} />

      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 cursor-pointer"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="h-6 w-6 text-white fill-white" />
      </button>
    </div>
  );
}
