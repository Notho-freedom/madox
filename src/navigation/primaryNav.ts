import {
  Bookmark,
  Film,
  Home,
  Settings,
  TrendingUp,
  Tv,
  type LucideIcon
} from 'lucide-react';

export type NavPageId =
  | 'home'
  | 'movies'
  | 'series'
  | 'trending'
  | 'watchlist'
  | 'settings';

export interface PrimaryNavItem {
  id: NavPageId;
  label: string;
  icon: LucideIcon;
}

export const primaryNavItems: PrimaryNavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home
  },
  {
    id: 'movies',
    label: 'Movies',
    icon: Film
  },
  {
    id: 'series',
    label: 'Series',
    icon: Tv
  },
  {
    id: 'trending',
    label: 'Trending',
    icon: TrendingUp
  },
  {
    id: 'watchlist',
    label: 'Watchlist',
    icon: Bookmark
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings
  }
];
