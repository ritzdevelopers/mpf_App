export const styles = {
  container: "mx-4 mt-6",

  /* ── Section heading ───────────────────────────── */
  headerRow: "flex-row items-end justify-between mb-3",
  titleRow: "flex-row items-center",
  titleIcon: "w-7 h-7 rounded-lg bg-amber-100 items-center justify-center mr-2",
  title: "text-xl font-extrabold text-slate-900",
  subtitle: "text-xs text-slate-500 mt-1 ml-0.5",
  seeAllBtn:
    "flex-row items-center bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200",
  seeAllText: "text-xs font-bold text-amber-700 mr-1",

  /* ── The card shell ────────────────────────────── */
  card:
    "bg-white rounded-3xl overflow-hidden border border-slate-100",
  cardShadow: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 6,
  },

  /* ── Hero image ────────────────────────────────── */
  imageWrap: "relative",
  image: "w-full h-96",

  /* Top-of-image dark veil for legibility of badges */
  topVeil: "absolute inset-x-0 top-0 h-24 bg-black/25",
  /* Bottom-of-image dark gradient for title area */
  bottomVeil: "absolute inset-x-0 bottom-0 h-36 bg-black/55",

  badge:
    "absolute top-3 left-3 flex-row items-center bg-amber-500 px-3 py-1.5 rounded-full",
  badgeIconWrap: "mr-1",
  badgeText: "text-white text-[10px] font-extrabold tracking-widest",

  heartBtn:
    "absolute top-3 right-3 bg-white/20 p-2.5 rounded-full border border-white/50",

  galleryChip:
    "absolute bottom-3 right-3 flex-row items-center bg-black/55 px-2.5 py-1 rounded-full",
  galleryText: "text-white text-[11px] font-semibold ml-1",

  overlayContent: "absolute left-4 right-4 bottom-3",
  propertyName: "text-white text-[22px] font-extrabold leading-tight",
  locationRow: "flex-row items-center mt-1.5",
  location: "text-amber-100 text-[12px] font-medium ml-1",

  /* ── Info block under image ────────────────────── */
  infoWrap: "p-4",

  builderRow: "flex-row items-center",
  logoWrap:
    "w-11 h-11 rounded-2xl bg-slate-900 items-center justify-center",
  logoLetter: "text-white text-lg font-extrabold",
  builderTextWrap: "ml-3 flex-1",
  builderNameRow: "flex-row items-center",
  builderName: "text-[15px] font-bold text-slate-900 mr-1",
  verifiedPill:
    "flex-row items-center bg-blue-50 px-1.5 py-0.5 rounded-full",
  verifiedText: "text-[10px] font-bold text-blue-700 ml-0.5",
  viewProject: "text-[11px] text-slate-500 mt-0.5",
  ratingChip:
    "flex-row items-center bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200",
  ratingText: "text-xs font-bold text-amber-700 ml-1",

  /* ── Price card ────────────────────────────────── */
  priceBox:
    "flex-row items-center bg-emerald-50 rounded-2xl p-3.5 mt-4 border border-emerald-100",
  priceColLeft: "flex-1",
  priceDivider: "w-px h-10 bg-emerald-200 mx-4",
  startFrom:
    "text-[10px] text-slate-500 font-semibold tracking-widest uppercase",
  price: "text-[20px] font-extrabold text-emerald-700 mt-0.5",
  emi: "text-[15px] font-bold text-emerald-700 mt-0.5",

  /* ── Feature chips ─────────────────────────────── */
  chipsRow: "flex-row flex-wrap mt-3",
  chipBhk:
    "flex-row items-center bg-slate-100 px-2.5 py-1.5 rounded-lg mr-2 mb-2",
  chipBhkText: "text-xs font-semibold text-slate-700 ml-1",
  chipRera:
    "flex-row items-center bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-200 mr-2 mb-2",
  chipReraText: "text-xs font-bold text-green-700 ml-1",
  chipDate:
    "flex-row items-center bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 mr-2 mb-2",
  chipDateText: "text-xs font-semibold text-amber-700 ml-1",

  /* ── CTAs ──────────────────────────────────────── */
  ctaRow: "flex-row mt-4",
  buttonOutline:
    "flex-row items-center justify-center border border-slate-300 py-3 px-5 rounded-2xl mr-2",
  buttonOutlineText: "text-sm font-bold text-slate-900 ml-1.5",
  button:
    "flex-1 flex-row items-center justify-center bg-slate-900 py-3 rounded-2xl",
  buttonText: "text-white text-sm font-bold mr-1.5",
};
