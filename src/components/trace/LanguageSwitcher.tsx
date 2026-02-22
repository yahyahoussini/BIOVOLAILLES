import { motion } from "framer-motion";
import type { Lang } from "./translations";

const flags: Record<Lang, string> = { fr: "🇫🇷", ar: "🇲🇦", en: "🇬🇧" };
const labels: Record<Lang, string> = { fr: "FR", ar: "عر", en: "EN" };

export function LanguageSwitcher({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex gap-1.5 rounded-full glass-card p-1">
      {(Object.keys(flags) as Lang[]).map((l) => (
        <motion.button
          key={l}
          whileTap={{ scale: 0.9 }}
          onClick={() => setLang(l)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            lang === l
              ? "gradient-gold text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>{flags[l]}</span>
          <span>{labels[l]}</span>
        </motion.button>
      ))}
    </div>
  );
}
