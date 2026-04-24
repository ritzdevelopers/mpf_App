// components/PropertyDetail/PropertyDetailsUI.ts
// Tailwind (NativeWind) class map for the property detail page.

export const styles = {
  /* ── PAGE SHELL ── */
  page: "flex-1 bg-slate-100",
  scroll: "",

  /* ── NOT FOUND ── */
  emptyWrap: "flex-1 items-center justify-center bg-slate-50",
  emptyTitle: "text-slate-400 text-base mt-3.5",
  emptyBackBtn: "mt-5 px-7 py-3",
  emptyBackText: "text-slate-800 font-semibold",

  /* ── HERO ── */
  hero: "relative bg-slate-200",
  heroTopRow: "absolute top-[52px] left-4 right-4 flex-row justify-between",
  heroRightGroup: "flex-row gap-2",
  heroBtn:
    "h-[42px] w-[42px] rounded-2xl bg-white/80 border border-white/90 items-center justify-center shadow",
  titleRow: "flex-row items-center justify-between gap-2",
  titleFlex: "flex-1 mr-2",
  badgeRow: "flex-row gap-1 flex-shrink-0 mr-2",
  badgePill:
    "flex-row items-center bg-white/70 border border-white/80 px-2 py-[2px] rounded-full",
  badgeDotBlue: "w-[6px] h-[6px] rounded-full bg-blue-600 mr-1",
  badgeDotGreen: "w-[6px] h-[6px] rounded-full bg-emerald-500 mr-1",
  badgeDotAmber: "w-[6px] h-[6px] rounded-full bg-[#d89b38] mr-1",
  badgeTextBlue: "text-blue-700 text-[9px] font-bold uppercase tracking-[0.5px]",
  badgeTextGreen: "text-emerald-700 text-[9px] font-bold uppercase tracking-[0.5px]",
  badgeTextAmber: "text-[#b97a1f] text-[9px] font-bold uppercase tracking-[0.5px]",
  titleCard: "absolute bottom-4 left-4 right-4",
  title: "text-[20px] font-extrabold text-slate-900",
  locationRow: "flex-row justify-between items-center mt-2",
  locationGroup: "flex-row items-center flex-shrink",
  locationText: "text-slate-500 text-xs ml-1",
  price: "text-[20px] font-extrabold text-[#d89b38] flex-shrink",

  /* ── SHARED CARD ── */
  content: "px-4 mt-4",
  glass:
    "bg-white/90 rounded-[20px] border border-white p-4 shadow-sm",
  cardSpacing: "mt-3",

  /* ── STAT CHIPS ROW ── */
  statRow: "flex-row gap-2",
  statChip: "flex-1 items-center py-3.5 bg-white/90 rounded-[20px] border border-white shadow-sm",
  statIconWrap: "rounded-xl p-1.5 mb-1.5",
  statLabel: "text-[10px] text-slate-400 mb-0.5",
  statValue: "text-[12px] font-bold text-slate-800 text-center",

  /* ── SECTION HEADER ── */
  sectionHeaderRow: "flex-row items-center mb-0.5",
  sectionIconWrap: "w-[38px] h-[38px] rounded-xl items-center justify-center mr-3",
  sectionTextCol: "flex-1",
  sectionTitle: "text-[16px] font-extrabold text-slate-900 tracking-tight",
  sectionSubtitle: "text-[11px] text-slate-400 mt-0.5 font-medium",

  /* ── CONFIGURATIONS ── */
  configRow: "flex-row flex-wrap gap-2 mt-3.5",
  configChip: "bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-2xl",
  configText: "text-blue-700 text-xs font-bold",

  /* ── ABOUT ── */
  aboutBody: "mt-3.5 border-l-[3px] border-indigo-500 pl-3.5 py-0.5",
  aboutText: "text-slate-700 text-[13.5px] leading-[22px]",

  /* ── OVERVIEW GRID ── */
  overviewGrid: "flex-row flex-wrap justify-between mt-3.5",
  overviewItem:
    "w-[48%] mb-2.5 py-3.5 px-3.5 bg-white/90 rounded-[20px] border border-white shadow-sm",
  overviewLabel: "text-[10px] text-slate-400 mt-2",
  overviewValue: "text-[13px] font-bold text-slate-800 mt-1",

  /* ── INTRO BLURB ── */
  sectionBlurb: "text-slate-500 text-[12px] mt-1.5 leading-[18px]",

  /* ── GALLERY ── */
  galleryScroll: "mt-3",

  /* ── FLOOR PLANS ── */
  fpList: "mt-2.5",
  fpRow: "flex-row items-center justify-between py-2.5",
  fpRowDivider: "border-t border-slate-100",
  fpLeft: "flex-row items-center flex-1",
  fpIconWrap: "bg-blue-50 rounded-[10px] p-1.5 mr-2.5",
  fpType: "text-[13px] font-bold text-slate-900",
  fpArea: "text-[12px] font-semibold text-slate-600",

  /* ── AMENITIES ── */
  amList: "flex-row flex-wrap gap-2 mt-2.5",
  amChip:
    "flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5",
  amText: "text-[12px] font-semibold text-slate-700",
  amToggle: "mt-2.5",
  amToggleText: "text-blue-600 text-xs font-bold",

  /* ── LOCATION BENEFITS ── */
  locList: "mt-2.5",
  locRow: "flex-row items-center py-2.5",
  locRowDivider: "border-t border-slate-100",
  locIconWrap: "bg-emerald-50 rounded-[10px] p-1.5 mr-2.5",
  locName: "flex-1 text-[13px] text-slate-700 font-medium",
  locDist: "text-[12px] text-slate-500 font-bold",

  /* ── RERA ── */
  reraRow: "flex-row items-center",
  reraIconWrap: "bg-emerald-100 rounded-xl p-2 mr-3",
  reraLabel: "text-[12px] text-slate-500",
  reraNo: "text-[14px] font-bold text-slate-900 mt-0.5",
  reraBtn: "bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-[10px]",
  reraBtnText: "text-emerald-600 text-[11px] font-bold",

  /* ── WHY INVEST ── */
  whyRow: "flex-row items-center mt-3",
  whyIconWrap: "rounded-xl p-2 mr-3",
  whyText: "text-slate-600 text-[13px] flex-1",

  /* ── BUILDER ── */
  builderRow: "flex-row items-center mt-2.5",
  builderLogoWrap:
    "w-[52px] h-[52px] rounded-2xl overflow-hidden border border-slate-200 mr-3",
  builderName: "font-bold text-[15px] text-slate-900",
  builderMeta: "flex-row items-center mt-1",
  builderMetaText: "text-slate-400 text-[11px] ml-1",
  builderDesc: "text-slate-700 text-[13px] leading-[20px] mt-3",

  /* ── FAQS ── */
  faqList: "mt-1.5",
  faqRow: "",
  faqRowDivider: "border-t border-slate-100",
  faqHead: "flex-row items-center py-3",
  faqQ: "flex-1 text-slate-900 text-[13px] font-semibold",
  faqA: "text-slate-600 text-[12px] leading-[19px] pb-3",

  /* ── EMI TEASER ── */
  emiCard:
    "mt-3 mb-[110px] p-4 rounded-[20px] border border-orange-200 bg-orange-50/90 shadow-sm",
  emiInner: "flex-row items-center justify-between",
  emiCol: "flex-1",
  emiLabel: "text-[13px] text-amber-800 font-semibold",
  emiAmount: "text-[26px] font-extrabold text-[#d89b38] mt-0.5",
  emiUnit: "text-[13px] font-normal text-slate-400",
  emiNote: "text-[11px] text-slate-400 mt-1",
  emiBtn: "bg-[#d89b38] px-4 py-3 rounded-2xl",
  emiBtnText: "text-white text-[13px] font-bold",

  /* ── BOTTOM BAR ── */
  bottomBar:
    "absolute bottom-0 left-0 right-0 flex-row items-center px-4 py-3 pb-7 gap-2.5 bg-white/95 border-t border-slate-200",
  iconActionBtn:
    "w-[50px] h-[50px] rounded-2xl bg-slate-50 border border-slate-200 items-center justify-center",
  ctaBtn:
    "flex-1 h-[50px] rounded-2xl bg-[#d89b38] items-center justify-center shadow",
  ctaText: "text-white font-extrabold text-[15px]",
};
