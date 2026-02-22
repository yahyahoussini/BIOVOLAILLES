import { motion } from "framer-motion";
import type { Lang } from "./translations";
import t from "./translations";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface TraceHeroProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  children?: React.ReactNode;
}

/* ---------- tiny inline SVG farm sprites ---------- */

function Chicken({ delay = 0, flip = false, x = 0, y = 0 }: { delay?: number; flip?: boolean; x?: number; y?: number }) {
  return (
    <motion.div
      initial={{ x: flip ? 80 : -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4 + delay, duration: 1.2, ease: "easeOut" }}
      style={{ position: "absolute", left: `${x}%`, bottom: `${y}%`, transform: flip ? "scaleX(-1)" : undefined }}
    >
      <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay }}>
        <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
          {/* body */}
          <ellipse cx="32" cy="40" rx="18" ry="14" fill="#F5E6C8" />
          {/* wing */}
          <ellipse cx="24" cy="38" rx="8" ry="6" fill="#E8D5A8" />
          {/* head */}
          <circle cx="44" cy="26" r="10" fill="#F5E6C8" />
          {/* eye */}
          <circle cx="47" cy="24" r="2" fill="#1a1a1a" />
          <circle cx="48" cy="23.5" r="0.6" fill="#fff" />
          {/* beak */}
          <polygon points="54,26 60,28 54,30" fill="#E8A030" />
          {/* comb */}
          <path d="M40,16 Q42,12 44,16 Q46,12 48,16" fill="#D44" stroke="#C33" strokeWidth="0.5" />
          {/* wattle */}
          <ellipse cx="50" cy="32" rx="2" ry="3" fill="#D44" />
          {/* legs */}
          <line x1="28" y1="52" x2="26" y2="60" stroke="#E8A030" strokeWidth="2" />
          <line x1="36" y1="52" x2="38" y2="60" stroke="#E8A030" strokeWidth="2" />
          {/* feet */}
          <path d="M22,60 L26,60 L28,58" stroke="#E8A030" strokeWidth="1.5" fill="none" />
          <path d="M34,58 L38,60 L42,60" stroke="#E8A030" strokeWidth="1.5" fill="none" />
          {/* tail feathers */}
          <path d="M14,32 Q10,24 16,28" fill="#E0C890" />
          <path d="M14,34 Q8,28 14,30" fill="#D4BC80" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function FarmEgg({ delay = 0, x = 0, y = 0 }: { delay?: number; x?: number; y?: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.8 + delay, type: "spring", stiffness: 200 }}
      style={{ position: "absolute", left: `${x}%`, bottom: `${y}%` }}
    >
      <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity, delay }}>
        <svg width="22" height="28" viewBox="0 0 22 28">
          <ellipse cx="11" cy="15" rx="9" ry="12" fill="#FFF8E7" stroke="#E8D5A8" strokeWidth="1" />
          <ellipse cx="9" cy="12" rx="3" ry="4" fill="#FFFDF5" opacity="0.6" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function Cloud({ x = 0, y = 0, scale = 1, duration = 60 }: { x?: number; y?: number; scale?: number; duration?: number }) {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "calc(100vw + 100%)" }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      style={{ position: "absolute", left: `${x}%`, top: `${y}%`, scale }}
    >
      <svg width="120" height="50" viewBox="0 0 120 50" fill="none">
        <ellipse cx="60" cy="30" rx="50" ry="18" fill="white" opacity="0.12" />
        <ellipse cx="40" cy="25" rx="30" ry="14" fill="white" opacity="0.1" />
        <ellipse cx="80" cy="28" rx="25" ry="12" fill="white" opacity="0.08" />
      </svg>
    </motion.div>
  );
}

function Barn() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="absolute"
      style={{ right: "8%", bottom: "10%" }}
    >
      <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
        {/* barn body */}
        <rect x="10" y="40" width="60" height="50" fill="#8B4513" rx="2" />
        {/* roof */}
        <polygon points="0,42 40,8 80,42" fill="#A0522D" />
        <polygon points="5,42 40,12 75,42" fill="#B5651D" />
        {/* door */}
        <rect x="28" y="55" width="24" height="35" rx="12" fill="#654321" />
        <circle cx="46" cy="75" r="2" fill="#C9A84C" />
        {/* hay loft window */}
        <circle cx="40" cy="30" r="6" fill="#654321" />
        <line x1="40" y1="24" x2="40" y2="36" stroke="#8B4513" strokeWidth="1.5" />
        <line x1="34" y1="30" x2="46" y2="30" stroke="#8B4513" strokeWidth="1.5" />
        {/* roof detail */}
        <line x1="40" y1="8" x2="40" y2="0" stroke="#8B4513" strokeWidth="2" />
        <polygon points="36,-2 40,-6 44,-2" fill="#A0522D" />
      </svg>
    </motion.div>
  );
}

function Fence() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 flex items-end overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.1 * i, duration: 0.5 }}
          className="flex-shrink-0 origin-bottom"
          style={{ marginLeft: i === 0 ? 0 : -2 }}
        >
          <svg width="50" height="48" viewBox="0 0 50 48" fill="none">
            {/* post */}
            <rect x="22" y="0" width="6" height="48" fill="#A0826D" rx="1" />
            <rect x="22" y="0" width="6" height="4" fill="#8B7355" rx="1" />
            {/* rails */}
            <rect x="0" y="12" width="50" height="4" fill="#B5956B" rx="1" />
            <rect x="0" y="30" width="50" height="4" fill="#B5956B" rx="1" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function GrassBlade({ x, delay = 0 }: { x: number; delay?: number }) {
  return (
    <motion.div
      className="absolute bottom-0"
      style={{ left: `${x}%` }}
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 2 + delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="12" height="28" viewBox="0 0 12 28">
        <path d="M6,28 Q4,16 2,6 Q1,0 6,4 Q11,0 10,6 Q8,16 6,28" fill="#3D7A45" opacity={0.6 + delay * 0.1} />
      </svg>
    </motion.div>
  );
}

function Sun() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="absolute top-6 left-8"
    >
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
        <svg width="50" height="50" viewBox="0 0 50 50">
          {/* rays */}
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1="25" y1="25"
              x2={25 + 22 * Math.cos((i * Math.PI) / 4)}
              y2={25 + 22 * Math.sin((i * Math.PI) / 4)}
              stroke="#C9A84C" strokeWidth="2" opacity="0.4"
            />
          ))}
        </svg>
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 shadow-lg shadow-yellow-400/30" />
      </div>
    </motion.div>
  );
}

/* ---------- Main component ---------- */

export function TraceHero({ lang, setLang, children }: TraceHeroProps) {
  return (
    <section className="relative min-h-[55vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a2a] via-[#1e4a32] to-[#2d5a3a]" />

        {/* Clouds */}
        <Cloud x={-10} y={8} scale={1} duration={50} />
        <Cloud x={20} y={15} scale={0.7} duration={65} />
        <Cloud x={60} y={5} scale={0.9} duration={55} />

        {/* Sun */}
        <Sun />

        {/* Rolling hills */}
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 300" preserveAspectRatio="none" style={{ height: "55%" }}>
          <motion.path
            d="M0,300 C200,160 400,200 600,180 C800,160 1000,120 1200,140 C1350,155 1440,180 1440,180 L1440,300 Z"
            fill="#2D5A3A"
            animate={{
              d: [
                "M0,300 C200,160 400,200 600,180 C800,160 1000,120 1200,140 C1350,155 1440,180 1440,180 L1440,300 Z",
                "M0,300 C200,170 400,190 600,170 C800,150 1000,130 1200,150 C1350,145 1440,170 1440,170 L1440,300 Z",
                "M0,300 C200,160 400,200 600,180 C800,160 1000,120 1200,140 C1350,155 1440,180 1440,180 L1440,300 Z",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 300" preserveAspectRatio="none" style={{ height: "45%" }}>
          <path d="M0,300 C300,200 600,240 900,200 C1100,180 1300,220 1440,200 L1440,300 Z" fill="#346B44" />
        </svg>
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 300" preserveAspectRatio="none" style={{ height: "30%" }}>
          <path d="M0,300 C200,240 500,260 720,240 C940,220 1200,250 1440,230 L1440,300 Z" fill="#3D7A45" />
        </svg>

        {/* Grass blades */}
        {[5, 12, 20, 28, 35, 45, 55, 62, 70, 78, 85, 92].map((x, i) => (
          <GrassBlade key={i} x={x} delay={i * 0.3} />
        ))}

        {/* Farm elements */}
        <Barn />
        <Fence />

        {/* Chickens */}
        <Chicken x={10} y={15} delay={0} />
        <Chicken x={25} y={12} delay={0.3} flip />
        <Chicken x={55} y={18} delay={0.6} />
        <Chicken x={72} y={14} delay={0.9} flip />

        {/* Eggs on the ground */}
        <FarmEgg x={18} y={10} delay={0} />
        <FarmEgg x={35} y={8} delay={0.4} />
        <FarmEgg x={48} y={12} delay={0.2} />
        <FarmEgg x={65} y={9} delay={0.6} />
        <FarmEgg x={80} y={11} delay={0.1} />
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
          <h1 className="text-2xl md:text-4xl font-display font-bold text-foreground tracking-tight drop-shadow-lg">
            BIOVOLAILLES <span className="text-gold">UNION</span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-xs md:text-sm text-muted-foreground mt-1 uppercase tracking-[0.2em]"
          >
            {t.hero_subtitle[lang]}
          </motion.p>
        </motion.div>

        {/* 3D Egg / QR code slot */}
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
