import { useEffect, useState, useMemo, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Egg } from "lucide-react";
import QRCode from "qrcode";
import { BiovolaillesLoader } from "@/components/BiovolaillesLoader";
import { TraceHero } from "@/components/trace/TraceHero";
import { TraceStepCard, DataRow } from "@/components/trace/TraceStepCard";
import { TraceFooter } from "@/components/trace/TraceFooter";
import { TraceEgg3D } from "@/components/trace/TraceEgg3D";
import { useTraceSEO } from "@/components/trace/useTraceSEO";
import type { Lang } from "@/components/trace/translations";
import t from "@/components/trace/translations";

const TraceBatch = () => {
  const { batchRef } = useParams<{ batchRef: string }>();
  const [batch, setBatch] = useState<any>(null);
  const [productionLog, setProductionLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lang, setLang] = useState<Lang>("fr");
  const [qrDataUrl, setQrDataUrl] = useState<string>();

  // Generate QR data URL for the 3D egg
  useEffect(() => {
    if (batchRef) {
      const url = `${window.location.origin}/trace/${batchRef}`;
      QRCode.toDataURL(url, {
        width: 256,
        margin: 1,
        color: { dark: "#0a2e1a", light: "#ffffff" },
      }).then(setQrDataUrl).catch(() => {});
    }
  }, [batchRef]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("packaging_batch")
        .select("*, flock(*, cooperative(*))")
        .eq("batch_ref", batchRef || "")
        .maybeSingle();

      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setBatch(data);

      // Increment scan count & log
      supabase.rpc("increment_scan_count", { batch_ref_input: batchRef || "" });
      supabase.from("scan_log").insert({ batch_ref: batchRef || "" });

      if (data.flock_id) {
        const { data: logData } = await supabase
          .from("production_log")
          .select("*")
          .eq("flock_id", data.flock_id)
          .order("collection_date", { ascending: false })
          .limit(1)
          .maybeSingle();
        setProductionLog(logData);
      }

      setLoading(false);
    };
    fetchData();
  }, [batchRef]);

  // SEO
  useTraceSEO({
    batchRef: batchRef || "",
    cooperativeName: batch?.flock?.cooperative?.name,
    breed: batch?.flock?.breed,
    grade: batch?.grade,
    packageDate: batch?.package_date,
  });

  const isRtl = lang === "ar";

  if (loading) return <BiovolaillesLoader />;

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6" dir={isRtl ? "rtl" : "ltr"}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring" }}
            className="gradient-gold p-5 rounded-3xl inline-flex glow-gold"
          >
            <Egg className="h-10 w-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-display font-bold text-foreground">{t.not_found_title[lang]}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">{t.not_found_desc[lang]}</p>
          <p className="text-xs font-mono text-gold/60 bg-gold/5 rounded-lg px-4 py-2 inline-block">{batchRef}</p>
          <div>
            <Link to="/" className="text-gold underline text-sm hover:text-gold-light transition-colors">
              {t.back[lang]}
            </Link>
          </div>
          <div className="pt-4 flex justify-center">
            <div className="flex gap-2">
              {(["fr", "ar", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    lang === l ? "gradient-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l === "fr" ? "🇫🇷 FR" : l === "ar" ? "🇲🇦 عر" : "🇬🇧 EN"}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const coop = batch.flock?.cooperative;
  const flock = batch.flock;

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero with 3D egg */}
      <TraceHero lang={lang} setLang={setLang}>
        <Suspense fallback={null}>
          <TraceEgg3D qrDataUrl={qrDataUrl} />
        </Suspense>
      </TraceHero>

      {/* Verification badge */}
      <div className="max-w-lg mx-auto px-6 -mt-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 p-4 glass-card rounded-2xl border border-emerald/30"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-emerald-light shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">{t.verified[lang]}</p>
            <p className="text-xs text-muted-foreground">{t.verified_sub[lang]}</p>
          </div>
        </motion.div>
      </div>

      {/* Scan counter */}
      <div className="max-w-lg mx-auto px-6 mt-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2"
        >
          <div className="w-2 h-2 rounded-full gradient-gold animate-pulse-gold" />
          <span className="text-xs text-muted-foreground">{t.scan_count[lang]}:</span>
          <span className="text-sm font-bold text-gold">{batch.scan_count || 0}</span>
        </motion.div>
      </div>

      {/* Journey Timeline */}
      <main className="max-w-lg mx-auto px-6 py-10 space-y-6">
        <TraceStepCard icon={t.step1_icon} title={t.step1_title[lang]} stepNumber={1} lang={lang}>
          {flock?.breed_photo_url && (
            <div className="rounded-xl overflow-hidden mb-4 border border-border/50">
              <img src={flock.breed_photo_url} alt={flock.breed} className="w-full h-36 object-cover" loading="lazy" />
            </div>
          )}
          <DataRow label={t.breed[lang]} value={flock?.breed} />
          <DataRow label={t.cooperative[lang]} value={coop?.name} />
          <DataRow label={t.location[lang]} value={coop?.location || t.na[lang]} />
          <DataRow label={t.arrival[lang]} value={flock?.arrival_date} />
          {coop?.gps_lat && coop?.gps_lng && (
            <div className="mt-3 rounded-xl overflow-hidden border border-border/50">
              <iframe
                title="Cooperative GPS"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coop.gps_lng - 0.02},${coop.gps_lat - 0.015},${coop.gps_lng + 0.02},${coop.gps_lat + 0.015}&layer=mapnik&marker=${coop.gps_lat},${coop.gps_lng}`}
                className="w-full h-36 border-0"
                loading="lazy"
              />
            </div>
          )}
        </TraceStepCard>

        <TraceStepCard icon={t.step2_icon} title={t.step2_title[lang]} stepNumber={2} lang={lang}>
          <DataRow label={t.collection_date[lang]} value={productionLog?.collection_date || batch.package_date} />
          <DataRow label={t.feed_type[lang]} value={productionLog?.feed_type || flock?.feed_type || t.na[lang]} />
          <DataRow label={t.vet_cert[lang]} value={productionLog?.vet_check_passed ? t.passed[lang] : t.pending[lang]} />
        </TraceStepCard>

        <TraceStepCard icon={t.step3_icon} title={t.step3_title[lang]} stepNumber={3} lang={lang}>
          <DataRow label={t.package_date_label[lang]} value={batch.package_date} />
          <DataRow label={t.grade[lang]} value={batch.grade || t.na[lang]} />
          <DataRow label={t.batch_ref[lang]} value={batch.batch_ref} />
          <DataRow label={t.onssa[lang]} value={batch.onssa_number || t.na[lang]} />
        </TraceStepCard>

        <TraceStepCard icon={t.step4_icon} title={t.step4_title[lang]} stepNumber={4} lang={lang} isLast>
          <DataRow label={t.quantity[lang]} value={`${batch.quantity_eggs} ${t.eggs[lang]}`} />
          <DataRow label={t.package_date_label[lang]} value={batch.package_date} />
          <DataRow label={t.expiry[lang]} value={batch.expiry_date || t.na[lang]} />
        </TraceStepCard>
      </main>

      <TraceFooter lang={lang} cooperative={coop} scanCount={batch.scan_count} />
    </div>
  );
};

export default TraceBatch;
