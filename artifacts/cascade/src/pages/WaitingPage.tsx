import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import posterPath from '@assets/poster_1782727022446.jpeg';

export default function WaitingPage() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  // Target: July 4, 2026, 06:30:00 UTC (12:00 PM IST)
  const TARGET_DATE = new Date('2026-07-04T06:30:00Z').getTime();

  const [timeLeft, setTimeLeft] = useState(() => {
    return Math.max(0, TARGET_DATE - Date.now());
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, TARGET_DATE - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [TARGET_DATE]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    setLocation('/');
  };

  if (!user) return null;

  const isLive = timeLeft === 0;

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const TimeBlock = ({ value, label, testId }: { value: number; label: string; testId: string }) => (
    <div className="flex flex-col items-center justify-center bg-parchment text-[#2c1a1a] w-20 h-24 md:w-24 md:h-28 border-2 border-dashed border-[#8B1A1A]/40 rounded-sm shadow-md relative transform -rotate-1 hover:rotate-0 transition-transform">
      <div className="absolute top-0 left-0 w-full h-3 bg-[#8B1A1A]/10 border-b border-[#8B1A1A]/20" />
      <span className="font-oswald text-3xl md:text-4xl font-bold" data-testid={testId}>
        {value.toString().padStart(2, '0')}
      </span>
      <span className="font-special-elite text-[10px] md:text-xs tracking-widest mt-2 border-t border-[#2c1a1a]/20 pt-1 w-3/4 text-center">
        {label}
      </span>
    </div>
  );

  return (
    <motion.div 
      className="min-h-[100dvh] w-full relative flex flex-col items-center justify-center bg-background overflow-hidden p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      data-testid="screen-waiting"
    >
      {/* Background Poster Faded */}
      <div 
        className="absolute inset-0 z-0 opacity-5 mix-blend-overlay bg-cover bg-center"
        style={{ backgroundImage: `url(${posterPath})` }}
      />

      {/* CLASSIFIED stamp watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 mix-blend-overlay">
        <span className="font-oswald text-[8rem] md:text-[15rem] font-bold text-[#CC0000] transform -rotate-12 whitespace-nowrap tracking-tighter">
          CLASSIFIED
        </span>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="font-special-elite text-4xl md:text-5xl font-bold text-[#8B1A1A] mb-12 animate-glitch tracking-widest drop-shadow-[0_0_8px_rgba(139,26,26,0.5)] uppercase">
            {isLive ? "CASCADE HAS BEGUN" : "WAIT FOR CASCADE TO BEGIN"}
          </h1>
        </motion.div>

        {!isLive && (
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-3 md:gap-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <TimeBlock value={days} label="DAYS" testId="countdown-days" />
            <span className="text-[#CC0000] font-bold text-2xl hidden md:block animate-pulse">:</span>
            <TimeBlock value={hours} label="HOURS" testId="countdown-hours" />
            <span className="text-[#CC0000] font-bold text-2xl hidden md:block animate-pulse">:</span>
            <TimeBlock value={minutes} label="MINUTES" testId="countdown-minutes" />
            <span className="text-[#CC0000] font-bold text-2xl hidden md:block animate-pulse">:</span>
            <TimeBlock value={seconds} label="SECONDS" testId="countdown-seconds" />
          </motion.div>
        )}

        <motion.div 
          className="border border-[#8B1A1A]/30 bg-[#8B1A1A]/5 p-6 backdrop-blur-sm relative w-full max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#8B1A1A]" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#8B1A1A]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#8B1A1A]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#8B1A1A]" />
          
          <p className="font-space-mono text-[#e8e0d0] text-sm md:text-base mb-2">
            Agent <span className="text-[#CC0000] uppercase font-bold">{user.name}</span>, your mission awaits.
          </p>
          <div className="w-full h-px bg-[#8B1A1A]/20 my-3" />
          <p className="font-special-elite text-xs md:text-sm text-foreground/80 tracking-widest leading-relaxed">
            DATE: 4th July 2026<br/>
            TIME: 12PM onwards<br/>
            VENUE: Online
          </p>
        </motion.div>
      </div>

      <a 
        href="/" 
        onClick={handleLogout}
        className="absolute bottom-6 right-6 font-space-mono text-[10px] text-foreground/50 hover:text-[#CC0000] transition-colors uppercase tracking-widest underline decoration-dotted underline-offset-4 cursor-pointer z-50"
      >
        [ ABORT MISSION ]
      </a>
    </motion.div>
  );
}
