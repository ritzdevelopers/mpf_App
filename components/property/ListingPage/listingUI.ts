// components/ListingsPage/listingUI.ts

export const styles = {
  container: "bg-slate-50",

  header: "flex-row items-center gap-3",

  circleBtn:
    "h-11 w-11 rounded-2xl border border-slate-200 items-center justify-center bg-white",

  searchBox:
    "flex-1 h-11 border border-slate-200 rounded-2xl px-4 flex-row items-center bg-white",

  filterBtn:
    "px-4 py-2 rounded-full border border-slate-200 mr-2 bg-white",

  filterText: "text-xs font-semibold text-slate-700",

  resultText: "mt-4 text-xs font-bold text-slate-400 tracking-wide uppercase",

  card:
    "mt-4 bg-white rounded-3xl overflow-hidden border border-slate-100",

  image: "w-full h-56",

  badgeRow:
    "absolute top-3 left-3 right-3 flex-row justify-between items-center",

  badgeDark:
    "bg-black/50 text-white px-3 py-1.5 rounded-full text-[11px] font-bold",

  heartBtn:
    "h-9 w-9 rounded-full bg-black/35 items-center justify-center",

  bottomTag:
    "absolute bottom-[155px] left-0 right-0 bg-gradient-to-t from-black/60 px-3 py-2",

  title: "text-lg font-bold text-slate-900 flex-1 mr-2",

  yellowTag:
    "bg-[#FFF8EC] text-[#d89b38] text-[10px] px-2.5 py-1 rounded-full font-bold border border-[#d89b38]/20",

  location: "text-xs text-slate-400 mt-1.5",

  smallText: "text-[10px] text-slate-400 font-medium",

  price: "text-base font-extrabold text-slate-900 mt-0.5",

  areaPrice:
    "text-xs text-slate-500 mt-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100",

  outlineBtn:
    "flex-1 border border-slate-200 rounded-xl py-3 items-center",

  outlineText: "text-slate-700 font-bold text-sm",

  fillBtn:
    "flex-1 bg-[#d89b38] rounded-xl py-3 items-center",

  fillText: "text-white font-bold text-sm",

  // Card internals
  bottomTagText: "text-white text-[11px] font-semibold",
  cardBody: "p-4",
  titleRow: "flex-row justify-between items-start",
  metricsRow:
    "flex-row items-center justify-between mt-3 pt-3 border-t border-slate-100",
  divider: "h-8 w-px bg-slate-100",
  metricEnd: "items-end",
  buttonRow: "flex-row gap-3 mt-4",

  // Search / filter bar
  searchInput: "flex-1 text-sm ml-2",
  filterScroll: "mt-3",
  clearBtn:
    "flex-row items-center px-4 py-2 rounded-full border border-red-200 bg-red-50 mr-2",
  clearBtnText: "text-xs font-semibold text-red-500 ml-1",

  // Empty state
  emptyWrap: "items-center justify-center py-16",
  emptyTitle: "text-slate-400 text-base mt-4 font-semibold",
  emptySubtitle: "text-slate-300 text-sm mt-1",

  // Loading state
  loadingWrap: "flex-1 bg-white items-center justify-center",
  loadingText: "text-slate-400 text-sm mt-3",

  // Page shell
  pageShell: "flex-1 bg-slate-50",
  footerWrap: "py-6 items-center",
};
