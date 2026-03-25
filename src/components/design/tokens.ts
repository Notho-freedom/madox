export const facetClipPaths = {
  panel: 'polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)',
  panelWide:
    'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
  card: 'polygon(10% 0, 100% 0, 100% 85%, 90% 100%, 0 100%, 0 15%)',
  mediaTile:
    'polygon(16% 0, 100% 0, 100% 84%, 84% 100%, 0 100%, 0 16%)',
  continueTile:
    'polygon(8% 0, 100% 0, 100% 88%, 92% 100%, 0 100%, 0 12%)',
  buttonFacet:
    'polygon(15% 0, 100% 0, 100% 70%, 85% 100%, 0 100%, 0 30%)',
  buttonCut8:
    'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
  buttonCut10:
    'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
  buttonCut14:
    'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)',
  navRow:
    'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
  navIcon:
    'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
  heroFrame:
    'polygon(20% 0%, 90% 0%, 100% 30%, 100% 85%, 80% 100%, 10% 100%, 0% 70%, 0% 15%)',
  seriesHero:
    'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 5% 100%, 0 85%)',
  listItem:
    'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)'
} as const;

export type FacetClipPathName = keyof typeof facetClipPaths;

export const facetPanelToneClasses = {
  default: {
    background: 'bg-[#0b0d16]/86 backdrop-blur-xl',
    wash:
      'bg-[linear-gradient(135deg,rgba(34,211,238,0.08),transparent_30%,transparent_72%,rgba(249,115,22,0.08))]',
    borderOpacity: 'opacity-35'
  },
  subtle: {
    background: 'bg-white/[0.04] backdrop-blur-lg',
    wash:
      'bg-[linear-gradient(135deg,rgba(34,211,238,0.05),transparent_34%,transparent_70%,rgba(249,115,22,0.05))]',
    borderOpacity: 'opacity-28'
  }
} as const;

export type FacetPanelTone = keyof typeof facetPanelToneClasses;

export const facetGlowClasses = {
  primary: 'absolute -left-10 top-0 h-28 w-28 bg-cyan-500/12 blur-3xl',
  secondary: 'absolute -bottom-12 right-0 h-32 w-32 bg-orange-500/10 blur-3xl'
} as const;
