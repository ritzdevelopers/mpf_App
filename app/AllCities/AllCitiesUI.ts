export const styles = {
  safe: "flex-1 bg-slate-100",

  /* ── Top bar (lighter, floater feel) ── */
  headerRow:
    "flex-row items-center justify-between px-4 pt-2 pb-3 bg-slate-100",
  backBtn:
    "w-10 h-10 items-center justify-center rounded-2xl bg-white border border-slate-200/80 shadow-sm shadow-slate-300/20",
  title: "text-lg font-extrabold text-slate-900 tracking-tight",

  /* ── Page scroll area ── */
  scroll: "px-4 pt-1",

  /* ── Grid ── */
  grid: "flex-row flex-wrap justify-between mt-7",

  /* ── Card: outer shadow, inner clips blur ── */
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
  image: "w-full h-60",

  /* ── Tag pill ── */
  tagPill:
    "absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/35 border border-white/25",
  tagText: "text-[9px] font-extrabold tracking-widest text-white",

  /* ── Heart ── */
  heartBtn:
    "absolute top-3 right-3 bg-white/20 p-2 rounded-full border border-white/30",

  /* ── Card footer (no native blur — Expo Go safe) ── */
  glassFooter:
    "absolute bottom-0 left-0 right-0 px-3 pt-2.5 pb-2.5 bg-black/50 border-t border-white/10",

  /* ── Text inside glass footer ── */
  city: "text-[15px] font-extrabold text-white",
  metaRow: "flex-row items-center mt-1",
  metaText: "text-[11px] text-white/75 ml-1",
};
