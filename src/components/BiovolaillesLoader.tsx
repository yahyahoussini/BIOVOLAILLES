import { motion } from "framer-motion";
import { Egg } from "lucide-react";

export function BiovolaillesLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <div className="relative">
          {/* Outer pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-2xl gradient-gold"
            style={{ margin: -8 }}
          />
          {/* Inner ring */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute inset-0 rounded-2xl gradient-gold"
            style={{ margin: -4 }}
          />
          {/* Main icon */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="gradient-gold p-5 rounded-2xl glow-gold relative z-10"
          >
            <Egg className="h-10 w-10 text-primary-foreground" />
          </motion.div>
        </div>

        {/* Brand text */}
        <div className="text-center space-y-1">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-display font-bold text-foreground tracking-wide"
          >
            BIOVOLAILLES
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold"
          >
            Union Trace
          </motion.p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full gradient-gold"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
