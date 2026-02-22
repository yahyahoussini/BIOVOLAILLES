import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Bird, Egg, Package, ShoppingCart } from "lucide-react";

const steps = [
  { icon: Building2, label: "Coopérative", desc: "Réception & enregistrement" },
  { icon: Bird, label: "Élevage", desc: "Suivi du troupeau" },
  { icon: Egg, label: "Ponte", desc: "Collecte des œufs" },
  { icon: Package, label: "Conditionnement", desc: "Emballage & QR Code" },
  { icon: ShoppingCart, label: "Distribution", desc: "Livraison au consommateur" },
];

export function TraceabilityTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="py-2">
      {/* Desktop timeline */}
      <div className="hidden md:block relative">
        {/* Connecting line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-border">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
            className="h-full gradient-gold origin-left"
          />
        </div>

        <div className="flex justify-between relative">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
              className="flex flex-col items-center text-center w-1/5"
            >
              {/* Icon circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.5 + i * 0.2, type: "spring", stiffness: 300 }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 relative z-10 ${
                  i === steps.length - 1 ? "gradient-gold glow-gold" : "glass-card border border-gold"
                }`}
              >
                <step.icon className={`h-6 w-6 ${i === steps.length - 1 ? "text-primary-foreground" : "text-gold"}`} />
              </motion.div>

              {/* Pulse dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                transition={{ delay: 0.7 + i * 0.2, duration: 0.4 }}
                className="w-2 h-2 rounded-full gradient-gold mb-2 -mt-1"
              />

              <p className="text-sm font-semibold text-foreground">{step.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile vertical timeline */}
      <div className="md:hidden relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
            className="h-full gradient-gold origin-top w-full"
          />
        </div>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
              className="flex items-center gap-4 relative"
            >
              {/* Dot on line */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
                className="absolute -left-8 w-[12px] h-[12px] rounded-full gradient-gold border-2 border-background"
              />

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                i === steps.length - 1 ? "gradient-gold glow-gold" : "glass-card border border-gold"
              }`}>
                <step.icon className={`h-4 w-4 ${i === steps.length - 1 ? "text-primary-foreground" : "text-gold"}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
