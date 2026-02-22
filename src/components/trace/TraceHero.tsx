import { motion } from "framer-motion";
import { Egg } from "lucide-react";
import type { Lang } from "./translations";
import t from "./translations";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface TraceHeroProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  children?: React.ReactNode;
}

export function TraceHero({ lang, setLang, children }: TraceHeroProps) {
  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated mountain background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(150,55%,3%)] via-[hsl(150,40%,8%)] to-background" />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="absolute inset-0">
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: "60%" }}>
            <motion.path
              initial={{ d: "M0,320 C360,100 720,200 1080,80 C1260,40 1440,120 1440,120 L1440,320 Z" }}
              animate={{ d: ["M0,320 C360,100 720,200 1080,80 C1260,40 1440,120 1440,120 L1440,320 Z", "M0,320 C360,120 720,180 1080,100 C1260,60 1440,100 1440,100 L1440,320 Z", "M0,320 C360,100 720,200 1080,80 C1260,40 1440,120 1440,120 L1440,320 Z"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              fill="hsl(150, 35%, 8%)" opacity={0.5}
            />
          </svg>
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: "45%" }}>
            <motion.path
              initial={{ d: "M0,320 C240,160 480,200 720,140 C960,80 1200,160 1440,100 L1440,320 Z" }}
              animate={{ d: ["M0,320 C240,160 480,200 720,140 C960,80 1200,160 1440,100 L1440,320 Z", "M0,320 C240,140 480,220 720,120 C960,100 1200,140 1440,120 L1440,320 Z", "M0,320 C240,160 480,200 720,140 C960,80 1200,160 1440,100 L1440,320 Z"] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              fill="hsl(150, 40%, 6%)" opacity={0.7}
            />
          </svg>
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: "30%" }}>
            <path d="M0,320 C200,240 400,280 600,220 C800,160 1000,200 1200,180 C1320,170 1440,200 1440,200 L1440,320 Z" fill="hsl(150, 52%, 7%)" />
          </svg>
        </motion.div>

        {/* Stars */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-gold-light"
            style={{ left: `${(i * 37 + 13) % 100}%`, top: `${(i * 23 + 7) % 40}%` }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: (i % 5) * 0.4 }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
        {/* Language switcher */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ position: "fixed", top: 16, right: 16, zIndex: 50 }}
        >
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
          <h1 className="text-2xl md:text-4xl font-display font-bold text-foreground tracking-tight">
            BIOVOLAILLES <span className="text-gold">UNION</span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-xs md:text-sm text-muted-foreground mt-1 uppercase tracking-[0.2em]"
          >
            {t.hero_subtitle[lang]}
          </motion.p>
        </motion.div>

        {/* 3D Egg slot */}
        {children && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full max-w-xs"
          >
            {children}
          </motion.div>
        )}

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-6 h-10 rounded-full border-2 border-gold/30 flex justify-center pt-2">
            <motion.div className="w-1 h-2 rounded-full gradient-gold" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
