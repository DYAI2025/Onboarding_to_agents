
import React, { useState } from 'react';
import { BirthData } from '../types';

interface Props {
  onSubmit: (data: BirthData) => void;
  isLoading: boolean;
}

export const InputCard: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<BirthData>({
    date: '',
    time: '',
    location: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-astro-card border border-astro-border rounded-[2rem] p-10 shadow-ambient relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-astro-gold/5 rounded-full blur-3xl group-hover:bg-astro-gold/10 transition-colors duration-700"></div>

      <div className="mb-10 border-b border-astro-border/50 pb-8">
        <h3 className="font-serif text-3xl text-astro-text mb-4">Formale Astrologische Daten</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-8 bg-astro-gold"></div>
            <p className="font-mono text-[10px] text-astro-gold/60 tracking-[0.5em] uppercase font-bold">
              SYSTEM_AUTH
            </p>
          </div>
          <p className="font-mono text-lg text-astro-gold tracking-[0.2em] uppercase font-black drop-shadow-sm">
            FusionEngine <span className="text-astro-text opacity-80">Protocol v1.2</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 font-sans">
        <div className="space-y-3">
          <label htmlFor="date" className="block text-[10px] font-bold uppercase tracking-[0.15em] text-astro-subtext">Geburtsdatum</label>
          <input
            type="date"
            id="date"
            required
            className="w-full bg-white dark:bg-zinc-900/50 border border-astro-border rounded-xl p-4 text-astro-text focus:outline-none focus:border-astro-gold focus:ring-1 focus:ring-astro-gold/20 transition-all shadow-inner"
            onChange={handleChange}
            value={formData.date}
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="time" className="block text-[10px] font-bold uppercase tracking-[0.15em] text-astro-subtext">Geburtszeit (24h)</label>
          <input
            type="time"
            id="time"
            required
            className="w-full bg-white dark:bg-zinc-900/50 border border-astro-border rounded-xl p-4 text-astro-text focus:outline-none focus:border-astro-gold focus:ring-1 focus:ring-astro-gold/20 transition-all shadow-inner"
            onChange={handleChange}
            value={formData.time}
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="location" className="block text-[10px] font-bold uppercase tracking-[0.15em] text-astro-subtext">Geburtsort</label>
          <input
            type="text"
            id="location"
            required
            placeholder="Stadt, Land"
            className="w-full bg-white dark:bg-zinc-900/50 border border-astro-border rounded-xl p-4 text-astro-text focus:outline-none focus:border-astro-gold focus:ring-1 focus:ring-astro-gold/20 transition-all shadow-inner placeholder:text-gray-300"
            onChange={handleChange}
            value={formData.location}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-5 mt-4 rounded-2xl bg-gradient-to-r from-astro-gold to-[#B89628] text-white font-serif text-xl italic tracking-wide shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>Initialisierung...</span>
            </>
          ) : (
            <span>Validierung starten</span>
          )}
        </button>
      </form>
    </div>
  );
};
