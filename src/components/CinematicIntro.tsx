import React, { useState } from 'react';
import { Sparkles, Shield } from 'lucide-react';

export const POSTER_URL = "https://i.postimg.cc/V6gxDzTF/1791731685246.jpg";

interface CinematicIntroProps {
  isOpen: boolean;
  onEnter: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ isOpen, onEnter }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  if (!isOpen) return null;

  const handleEnterClick = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onEnter();
    }, 900);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-1000 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ backgroundColor: '#020e07' }}
    >
      {/* Background Poster Image with Cinematic Slow Zoom */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <div
          className="absolute -inset-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)] bg-cover bg-center bg-no-repeat animate-cinematic-zoom"
          style={{ backgroundImage: `url('${POSTER_URL}')` }}
        />

        {/* Cinematic Multi-layered Dark Vignette & Royal Glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at center, rgba(3, 22, 13, 0.72) 0%, rgba(1, 14, 8, 0.88) 55%, #010804 100%)',
          }}
        />

        {/* Luminous Royal Emerald & Gold Radial Glows */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[450px] rounded-full blur-3xl opacity-45 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(245, 158, 11, 0.3) 40%, transparent 75%)',
          }}
        />
      </div>

      {/* Center Cinematic Card */}
      <div className="relative z-10 max-w-2xl w-full mx-4 text-center px-6 py-12 md:py-16 rounded-3xl bg-slate-950/70 border border-amber-500/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.3),0_0_100px_rgba(245,158,11,0.2)] flex flex-col items-center">
        
        {/* Emblem Shield */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-emerald-900/90 to-emerald-950/90 border-2 border-amber-400/70 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] mb-6">
          <Shield className="w-9 h-9 md:w-11 md:h-11" />
        </div>

        {/* Grand Title: «مبادرة: شكراً حماة الوطن» */}
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-emerald-100 to-amber-300 tracking-tight leading-tight mb-4 font-cairo drop-shadow-[0_2px_15px_rgba(245,158,11,0.4)]">
          مبادرة: شكراً حماة الوطن
        </h1>

        {/* English Subtitle */}
        <p
          className="text-emerald-300 font-en text-sm sm:text-base md:text-lg font-medium tracking-wide max-w-xl mx-auto leading-relaxed mb-10 text-emerald-200/90 drop-shadow-sm"
          dir="ltr"
        >
          Write a message of thank and appreciation to the Soldiers in English
        </p>

        {/* Glowing Central Enter Button: «دخول المبادرة | Enter Initiative» */}
        <button
          onClick={handleEnterClick}
          className="group relative inline-flex items-center justify-center gap-3 px-10 md:px-14 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-black text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400 hover:from-amber-200 hover:to-emerald-300 transition-all duration-300 shadow-[0_0_40px_rgba(245,158,11,0.65),0_0_60px_rgba(16,185,129,0.35)] hover:shadow-[0_0_60px_rgba(245,158,11,0.9),0_0_90px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 cursor-pointer font-cairo tracking-wide"
        >
          <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
          <span>دخول المبادرة | Enter Initiative</span>
        </button>

      </div>
    </div>
  );
};
