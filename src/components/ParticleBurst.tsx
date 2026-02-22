import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  delay: number;
}

const COLORS = [
  "hsl(43 52% 54%)",   // gold
  "hsl(43 60% 68%)",   // gold-light
  "hsl(152 60% 38%)",  // emerald
  "hsl(43 52% 54%)",   // gold
  "hsl(0 0% 100%)",    // white
];

export function useParticleBurst() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const triggerBurst = useCallback(() => {
    const newParticles: Particle[] = Array.from({ length: 24 }, (_, i) => ({
      id: Date.now() + i,
      x: 0,
      y: 0,
      angle: (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.3,
      distance: 60 + Math.random() * 80,
      size: 3 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.15,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1200);
  }, []);

  return { particles, triggerBurst };
}

export function ParticleBurst({ particles }: { particles: { id: number; angle: number; distance: number; size: number; color: string; delay: number }[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{
              opacity: 0,
              scale: 0.2,
              x: Math.cos(p.angle) * p.distance,
              y: Math.sin(p.angle) * p.distance,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: p.delay, ease: "easeOut" }}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Central flash */}
      <AnimatePresence>
        {particles.length > 0 && (
          <motion.div
            initial={{ opacity: 0.8, scale: 0.5 }}
            animate={{ opacity: 0, scale: 3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute w-8 h-8 rounded-full"
            style={{ background: "radial-gradient(circle, hsl(43 52% 54% / 0.6), transparent)" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
