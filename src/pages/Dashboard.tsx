import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CountUp } from "@/components/CountUp";
import { RotatingEgg3D } from "@/components/RotatingEgg3D";
import { TraceabilityTimeline } from "@/components/TraceabilityTimeline";
import { motion } from "framer-motion";
import { Egg, Building2, Bird, Package } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: React.ElementType;
  accentClass: string;
  glowClass: string;
}

function StatCard({ title, value, suffix, icon: Icon, accentClass, glowClass }: StatCardProps) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card glass-card-hover rounded-xl p-6 relative overflow-hidden group cursor-default"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "linear-gradient(105deg, transparent 40%, hsl(43 52% 54% / 0.03) 45%, hsl(43 52% 54% / 0.06) 50%, hsl(43 52% 54% / 0.03) 55%, transparent 60%)", backgroundSize: "200% 100%" }}
      />
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${accentClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className={`h-2 w-2 rounded-full ${glowClass} animate-pulse-gold`} />
      </div>
      <p className="text-3xl font-bold font-display text-foreground tracking-tight">
        <CountUp end={value} duration={2200} suffix={suffix} />
      </p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </motion.div>
  );
}

const Dashboard = () => {
  const [stats, setStats] = useState({ cooperatives: 0, flocks: 0, packaging: 0, slaughter: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [c, f, p, s] = await Promise.all([
        supabase.from("cooperative").select("id", { count: "exact", head: true }),
        supabase.from("flock").select("id", { count: "exact", head: true }),
        supabase.from("packaging_batch").select("id", { count: "exact", head: true }),
        supabase.from("slaughter_batch").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        cooperatives: c.count ?? 0,
        flocks: f.count ?? 0,
        packaging: p.count ?? 0,
        slaughter: s.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero section with 3D egg */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold font-display text-foreground">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble de la traçabilité — <span className="text-gold">BIOVOLAILLES UNION</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="hidden lg:block"
        >
          <RotatingEgg3D />
        </motion.div>
      </div>

      {/* Stat cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard title="Œufs conditionnés" value={stats.packaging * 360} icon={Egg} accentClass="gradient-gold text-primary-foreground" glowClass="bg-primary" />
        <StatCard title="Coopératives actives" value={stats.cooperatives} icon={Building2} accentClass="bg-emerald text-foreground" glowClass="bg-success" />
        <StatCard title="Troupeaux en élevage" value={stats.flocks} icon={Bird} accentClass="bg-secondary text-gold-light" glowClass="bg-emerald-light" />
        <StatCard title="Lots générés" value={stats.packaging + stats.slaughter} icon={Package} accentClass="gradient-gold text-primary-foreground" glowClass="bg-warning" />
      </motion.div>

      {/* Decorative separator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
        className="h-px gradient-gold opacity-20 origin-left"
      />

      {/* Traceability timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="glass-card rounded-xl p-6 lg:p-8"
      >
        <h2 className="text-xl font-display font-semibold text-foreground mb-6">
          Chaîne de traçabilité <span className="text-gold">Farm-to-Fork</span>
        </h2>
        <TraceabilityTimeline />
      </motion.div>
    </div>
  );
};

export default Dashboard;
