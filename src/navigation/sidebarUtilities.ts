import { LogOut, type LucideIcon } from 'lucide-react';

export interface SidebarUtilityAction {
  id: string;
  labelKey: string;
  icon: LucideIcon;
  hasIndicator?: boolean;
}

export interface SidebarFooterAction {
  id: 'sign-out';
  labelKey: string;
  icon: LucideIcon;
}

export interface SidebarProfile {
  avatarUrl: string;
  membershipKey: string;
  name: string;
}

export const sidebarUtilityActions: SidebarUtilityAction[] = [];

export const sidebarFooterAction: SidebarFooterAction = {
  id: 'sign-out',
  labelKey: 'sidebar.signOut',
  icon: LogOut
};

export const sidebarProfile: SidebarProfile = {
  avatarUrl:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
  membershipKey: 'sidebar.premiumMember',
  name: 'Alex Chen'
};
