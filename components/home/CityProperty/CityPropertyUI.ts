export const styles = {
  container: "px-4 mt-6",

  /* ── Section heading ── */
  headerRow: "flex-row items-center justify-between mb-4",
  titleRow: "flex-row items-center",
  titleIcon: "w-7 h-7 rounded-lg bg-amber-100 items-center justify-center mr-2",
  heading: "text-xl font-extrabold text-slate-800",
  subtitle: "text-xs text-slate-500 mt-1 ml-0.5",
  seeAllBtn:
    "flex-row items-center bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200",
  seeAllText: "text-xs font-bold text-amber-700 mr-1",

  /* ── Grid ── */
  grid: "flex-row flex-wrap justify-between",

  /* ── Card: outer carries shadow, inner clips blur ── */
  cardOuter: "w-[48%] mb-5 rounded-3xl",
  cardShadow: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 6,
  },
  cardInner: "rounded-3xl overflow-hidden",

  /* ── Full-height image ── */
  image: "w-full h-64",

  /* ── Tag pill — top left on image ── */
  tagPill:
    "absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/35 border border-white/25",
  tagText: "text-[9px] font-extrabold tracking-widest text-white",

  /* ── Heart — top right on image ── */
  heartBtn:
    "absolute top-3 right-3 bg-white/20 p-2 rounded-full border border-white/30",

  /* ── Card footer (opaque glass look — no native blur, works in Expo Go) ── */
  glassFooter:
    "absolute bottom-0 left-0 right-0 px-3 pt-2.5 pb-2.5 bg-black/50 border-t border-white/10",

  /* ── Text inside glass footer ── */
  city: "text-[15px] font-extrabold text-white",
  metaRow: "flex-row items-center mt-1",
  metaText: "text-[11px] text-white/75 ml-1",
};
