import {
  Bookmark,
  Film,
  Home,
  Settings,
  TrendingUp,
  Tv,
  Users,
  type LucideIcon
} from 'lucide-react';

export type NavPageId =
  | 'home'
  | 'movies'
  | 'series'
  | 'actors'
  | 'trending'
  | 'watchlist'
  | 'settings';

export interface PrimaryNavItem {
  id: NavPageId;
  labelKey: string;
  icon: LucideIcon;
}

export const primaryNavItems: PrimaryNavItem[] = [
  {
    id: 'home',
    labelKey: 'nav.home',
    icon: Home
  },
  {
    id: 'movies',
    labelKey: 'nav.movies',
    icon: Film
  },
  {
    id: 'series',
    labelKey: 'nav.series',
    icon: Tv
  },
  {
    id: 'actors',
    labelKey: 'nav.actors',
    icon: Users
  },
  {
    id: 'trending',
    labelKey: 'nav.trending',
    icon: TrendingUp
  },
  {
    id: 'watchlist',
    labelKey: 'nav.watchlist',
    icon: Bookmark
  },
  {
    id: 'settings',
    labelKey: 'nav.settings',
    icon: Settings
  }
];
