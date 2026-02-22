import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import type { Lang } from "./translations";

interface StepCardProps {
  icon: string;
  title: string;
  stepNumber: number;
  lang: Lang;
  children: React.ReactNode;
  isLast?: boolean;
}

export function TraceStepCard({ icon, title, stepNumber, lang, children, isLast }: StepCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [isFlipped, setIsFlipped] = useState(false);

  const isRtl = lang === "ar";

  return (
    <div ref={ref} className="relative">
      {/* Connecting line */}
      {!isLast && (
        <div className="absolute left-6 md:left-8 top-16 bottom-0 w-0.5 z-0">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="h-full gradient-gold origin-top"
          />
        </div>
      )}

      {/* Step indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        className="absolute left-2 md:left-4 top-4 z-10 w-8 h-8 md:w-9 md:h-9 rounded-full gradient-gold flex items-center justify-center glow-gold"
      >
        <span className="text-xs font-bold text-primary-foreground">{stepNumber}</span>
      </motion.div>

      {/* Card with 3D flip */}
      <motion.div
        initial={{ opacity: 0, rotateX: -90, y: 40 }}
        animate={isInView ? { opacity: 1, rotateX: 0, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="ml-14 md:ml-16 perspective-1000"
        style={{ transformStyle: "preserve-3d" }}
        onViewportEnter={() => setIsFlipped(true)}
      >
        <motion.div
          className="glass-card rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/25 transition-colors"
          whileHover={{ scale: 1.01, boxShadow: "0 8px 40px hsl(43 52% 54% / 0.1)" }}
        >
          {/* Card header */}
          <div className="gradient-gold px-5 py-3 flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <h3
              className={`text-base md:text-lg font-display font-bold text-primary-foreground tracking-wide ${isRtl ? "font-sans" : ""}`}
              dir={isRtl ? "rtl" : "ltr"}
            >
              {title}
            </h3>
          </div>

          {/* Card body */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isFlipped ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="p-5"
            dir={isRtl ? "rtl" : "ltr"}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function DataRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value || "—"}</span>
    </div>
  );
}
