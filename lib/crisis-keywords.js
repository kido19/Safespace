// /lib/crisis-keywords.js
// Single source of truth for crisis detection.
// Used by: frontend (instant modal), backend (defense-in-depth), DB trigger seed.
//
// ⚠️ STATUS: STARTER LIST — NOT REVIEWED BY A CLINICIAN.
// Before the pilot launch, have a native Amharic speaker + a counselor
// review and expand this list. Under-detection = missed help.
// Over-detection = an unneeded resource screen (harmless by design).

export const CRISIS_KEYWORDS = [
  // ---------- English ----------
  "suicide",
  "kill myself",
  "killing myself",
  "end my life",
  "want to die",
  "self-harm",
  "self harm",
  "hurt myself",
  "cutting myself",
  "no reason to live",
  "better off dead",
  "can't go on",
  "cant go on",
  "don't want to live",
  "dont want to live",

  // ---------- Amharic (Ethiopic script) ----------
  "ራሴን ማጥፋት",
  "ራሴን መግደል",
  "ራሴን መጉዳት",
  "ራሴን መቁረስ",
  "መሞት እፈልጋለሁ",
  "ልሞት እፈልጋለሁ",
  "መኖር አልፈልግም",
  "ሕይወቴን ማጥፋት",
  "ሕይወቴ ትርጉም የለውም",
  "መሞት ነው የሚሻለኝ",
  "ከመኖር መሞት ይሻለኛል",
  "ተስፋ ቆርጬያለሁ",

  // ---------- Amharic transliteration (Latin letters) ----------
  // Many youth type Amharic phonetically on social apps.
  "raseen matfat",
  "raseen megdel",
  "raseen megudat",
  "memot efelegalehu",
  "memot ifelegalhu",
  "menor alfeligim",
  "haywete tirgum yelewum",
  "tesfa qorchyalew",
];

// Case-insensitive substring match.
// Note: Amharic has no uppercase, so toLowerCase() is a no-op there — safe.
export const isCrisis = (text = "") => {
  if (!text) return false;
  const t = text.toLowerCase();
  return CRISIS_KEYWORDS.some((k) => t.includes(k.toLowerCase()));
};

// Optional helper: what matched? Useful for logging/QA (never shown to users).
export const matchedKeywords = (text = "") => {
  const t = text.toLowerCase();
  return CRISIS_KEYWORDS.filter((k) => t.includes(k.toLowerCase()));
};