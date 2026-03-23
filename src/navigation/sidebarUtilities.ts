import {
  Bell,
  HelpCircle,
  LogOut,
  User,
  type LucideIcon
} from 'lucide-react';

export interface SidebarUtilityAction {
  id: 'profile' | 'notifications' | 'support';
  label: string;
  icon: LucideIcon;
  hasIndicator?: boolean;
}

export interface SidebarFooterAction {
  id: 'sign-out';
  label: string;
  icon: LucideIcon;
}

export interface SidebarProfile {
  avatarUrl: string;
  membership: string;
  name: string;
}

export const sidebarUtilityActions: SidebarUtilityAction[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    hasIndicator: true
  },
  {
    id: 'support',
    label: 'Help & Support',
    icon: HelpCircle
  }
];

export const sidebarFooterAction: SidebarFooterAction = {
  id: 'sign-out',
  label: 'Sign Out',
  icon: LogOut
};

export const sidebarProfile: SidebarProfile = {
  avatarUrl:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
  membership: 'Premium Member',
  name: 'Alex Chen'
};
