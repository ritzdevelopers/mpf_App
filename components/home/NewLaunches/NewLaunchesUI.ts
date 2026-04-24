export const styles = {
  container: "mt-6",

  /* ── Section heading ───────────────────────────── */
  headerRow: "flex-row items-end justify-between mb-3 px-4",
  titleRow: "flex-row items-center",
  titleIcon:
    "w-7 h-7 rounded-lg bg-green-100 items-center justify-center mr-2",
  title: "text-xl font-extrabold text-slate-400",
  subtitle: "text-xs text-slate-500 mt-1 ml-0.5",
  viewAllBtn:
    "flex-row items-center bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200",
  viewAllText: "text-xs font-bold text-emerald-700 mr-1",

  /* ── Cards list ────────────────────────────────── */
  card:
    "mr-4 w-[252px] bg-white rounded-[28px] overflow-hidden border border-slate-100",
  cardShadow: {
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 6,
  },

  imageWrap: "relative",
  image: "w-full h-52",
  imageInsetGlow: {
    position: "absolute" as const,
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  /* Tag pill — background color set inline per card */
  badge: "absolute top-3 left-3 px-2.5 py-1 rounded-full",
  badgeText: "text-white text-[9px] font-extrabold tracking-widest",
  glassBadge: {
    overflow: "hidden" as const,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    borderRadius: 999,
  },

  heartBtn:
    "absolute top-3 right-3 bg-black/30 p-2 rounded-full border border-white/30",
  glassHeart: {
    overflow: "hidden" as const,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.34)",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  info: "mx-3.5 -mt-4 mb-3 p-4 rounded-[24px] border border-white/75",
  infoGlass: {
    overflow: "hidden" as const,
    backgroundColor: "rgba(255,255,255,0.58)",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  infoTopRow: "flex-row items-start justify-between",
  titleWrap: "flex-1 pr-3",
  projectName: "text-[15px] font-extrabold text-slate-700",
  actionBtn:
    "w-9 h-9 rounded-full items-center justify-center border border-white/70 bg-white/45",
  locationRow: "flex-row items-center mt-1",
  location: "text-[11px] text-slate-500 ml-1 flex-1",

  bottomRow:
    "flex-row items-end justify-between mt-3 pt-3 border-t border-white/60",
  startFrom:
    "text-[9px] text-slate-500 font-semibold tracking-widest uppercase",
  price: "text-[18px] font-extrabold text-slate-700 mt-0.5",

  rightMeta: "items-end",
  bhkChip: "bg-white/70 px-2.5 py-1.5 rounded-xl border border-white/70",
  bhkText: "text-[11px] font-semibold text-slate-700",
  availabilityText: "text-[10px] text-slate-500 mt-1",
};
