import type { ComponentType } from 'react';
import type { IconKey } from '@/lib/types';
import {
  CtaActivity,
  CtaMessages,
  CtaShop,
  CtaWaitlist,
  CtaWallet,
  NavApplications,
  NavDashboard,
  NavListings,
  NavRequest,
  NavTasks,
  NavUsers,
  type IconProps,
} from './index';

export const ICONS: Record<IconKey, ComponentType<IconProps>> = {
  dashboard: NavDashboard,
  listings: NavListings,
  users: NavUsers,
  request: NavRequest,
  applications: NavApplications,
  tasks: NavTasks,
  messages: CtaMessages,
  activity: CtaActivity,
  waitlist: CtaWaitlist,
  wallet: CtaWallet,
  shop: CtaShop,
};
