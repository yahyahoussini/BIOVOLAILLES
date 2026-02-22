export type Lang = "fr" | "ar" | "en";

const t = {
  hero_subtitle: {
    fr: "Système de traçabilité certifié",
    ar: "نظام تتبع معتمد",
    en: "Certified Traceability System",
  },
  verified: {
    fr: "Lot vérifié et authentique",
    ar: "دفعة موثقة وأصلية",
    en: "Verified & Authentic Batch",
  },
  verified_sub: {
    fr: "Traçabilité complète de la ferme à votre table",
    ar: "تتبع كامل من المزرعة إلى مائدتك",
    en: "Complete traceability from farm to your table",
  },
  step1_title: {
    fr: "LA POULE",
    ar: "الدجاجة",
    en: "THE HEN",
  },
  step1_icon: "🐔",
  breed: { fr: "Race", ar: "السلالة", en: "Breed" },
  cooperative: { fr: "Coopérative", ar: "التعاونية", en: "Cooperative" },
  location: { fr: "Localisation", ar: "الموقع", en: "Location" },
  arrival: { fr: "Date d'arrivée", ar: "تاريخ الوصول", en: "Arrival Date" },

  step2_title: {
    fr: "L'ŒUF",
    ar: "البيضة",
    en: "THE EGG",
  },
  step2_icon: "🥚",
  collection_date: { fr: "Date de collecte", ar: "تاريخ الجمع", en: "Collection Date" },
  feed_type: { fr: "Type d'alimentation", ar: "نوع العلف", en: "Feed Type" },
  vet_cert: { fr: "Contrôle vétérinaire", ar: "فحص بيطري", en: "Vet Certification" },
  passed: { fr: "Validé ✅", ar: "ناجح ✅", en: "Passed ✅" },
  pending: { fr: "En attente", ar: "قيد الانتظار", en: "Pending" },

  step3_title: {
    fr: "CONDITIONNEMENT",
    ar: "التكييف",
    en: "CONDITIONING",
  },
  step3_icon: "✅",
  grade: { fr: "Grade qualité", ar: "درجة الجودة", en: "Quality Grade" },
  batch_ref: { fr: "Référence lot", ar: "مرجع الدفعة", en: "Batch Reference" },
  onssa: { fr: "Numéro ONSSA", ar: "رقم ONSSA", en: "ONSSA Number" },
  package_date_label: { fr: "Date de conditionnement", ar: "تاريخ التعبئة", en: "Packaging Date" },

  step4_title: {
    fr: "VOTRE PACK",
    ar: "عبوتك",
    en: "YOUR PACK",
  },
  step4_icon: "📦",
  quantity: { fr: "Quantité", ar: "الكمية", en: "Quantity" },
  eggs: { fr: "œufs", ar: "بيضة", en: "eggs" },
  expiry: { fr: "Date d'expiration", ar: "تاريخ الانتهاء", en: "Expiry Date" },

  proud: {
    fr: "Fiers de nourrir le Maroc",
    ar: "فخورون بإطعام المغرب",
    en: "Proud to Feed Morocco",
  },
  proud_sub: {
    fr: "De nos coopératives à votre table — avec amour et traçabilité.",
    ar: "من تعاونياتنا إلى مائدتك — بحب وتتبع.",
    en: "From our cooperatives to your table — with love and traceability.",
  },
  cert_number: { fr: "N° certification", ar: "رقم الشهادة", en: "Certification #" },
  not_found_title: {
    fr: "Lot introuvable",
    ar: "الدفعة غير موجودة",
    en: "Batch Not Found",
  },
  not_found_desc: {
    fr: "La référence que vous avez scannée n'existe pas dans notre système.",
    ar: "المرجع الذي مسحته غير موجود في نظامنا.",
    en: "The reference you scanned does not exist in our system.",
  },
  back: { fr: "Retour à l'accueil", ar: "العودة للرئيسية", en: "Back to Home" },
  scan_count: { fr: "Scans vérifiés", ar: "عمليات مسح موثقة", en: "Verified Scans" },
  na: { fr: "Non renseigné", ar: "غير متوفر", en: "Not available" },
} as const;

export default t;
