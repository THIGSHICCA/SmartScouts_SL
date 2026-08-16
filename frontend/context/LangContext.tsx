'use client';
/**
 * Language Context — EN / TA / SI toggle
 * Provides { lang, setLang, t(en, ta, si) } throughout the app.
 */
import React, { createContext, useContext, useState } from 'react';

export type Lang = 'en' | 'ta' | 'si';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Pick the right string based on current language */
  t: (en?: string | null, ta?: string | null, si?: string | null) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (en) => en ?? '',
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const t = (en?: string | null, ta?: string | null, si?: string | null): string => {
    if (lang === 'ta' && ta) return ta;
    if (lang === 'si' && si) return si;
    return en ?? '';
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

/** Inline language switcher button group */
export function LangToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang();
  const opts: { key: Lang; label: string }[] = [
    { key: 'en', label: 'EN' },
    { key: 'ta', label: 'தமிழ்' },
    { key: 'si', label: 'සිං' },
  ];
  return (
    <div className={`inline-flex rounded-xl overflow-hidden border border-slate-200 ${className}`}>
      {opts.map(o => (
        <button
          key={o.key}
          onClick={() => setLang(o.key)}
          className={`px-3 py-1.5 text-xs font-black uppercase tracking-widest transition-all ${
            lang === o.key
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-500 hover:bg-slate-50'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
