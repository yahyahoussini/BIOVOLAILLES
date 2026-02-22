import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Lang } from "./translations";
import t from "./translations";

interface TraceFooterProps {
  lang: Lang;
  cooperative?: {
    name: string;
    photo_url?: string | null;
    certification_number?: string | null;
    location?: string | null;
  } | null;
  scanCount?: number;
}

export function TraceFooter({ lang, cooperative, scanCount }: TraceFooterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const isRtl = lang === "ar";

  return (
    <section ref={ref} className="px-6 pb-12 pt-8" dir={isRtl ? "rtl" : "ltr"}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-lg mx-auto text-center space-y-6"
      >
        {/* Morocco flag divider */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/30" />
          <span className="text-3xl">🇲🇦</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/30" />
        </div>

        <h2 className={`text-2xl md:text-3xl font-display font-bold text-foreground ${isRtl ? "font-sans" : ""}`}>
          {t.proud[lang]}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t.proud_sub[lang]}
        </p>

        {/* Cooperative photo */}
        {cooperative?.photo_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="rounded-2xl overflow-hidden border border-gold/15 mx-auto max-w-sm"
          >
            <img
              src={cooperative.photo_url}
              alt={cooperative.name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="glass-card p-3 text-center">
              <p className="text-sm font-semibold text-foreground">{cooperative.name}</p>
              {cooperative.certification_number && (
                <p className="text-xs font-mono text-gold mt-1">
                  {t.cert_number[lang]}: {cooperative.certification_number}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Scan count badge */}
        {typeof scanCount === "number" && scanCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-gold/15"
          >
            <div className="w-2 h-2 rounded-full gradient-gold animate-pulse-gold" />
            <span className="text-xs text-muted-foreground">{t.scan_count[lang]}:</span>
            <span className="text-sm font-bold text-gold">{scanCount}</span>
          </motion.div>
        )}

        {/* Bottom branding */}
        <div className="pt-6 space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            BIOVOLAILLES UNION TRACE
          </p>
          <p className="text-[10px] text-muted-foreground/50">
            Système de traçabilité certifié — Made in Morocco
          </p>
        </div>
      </motion.div>
    </section>
  );
}
