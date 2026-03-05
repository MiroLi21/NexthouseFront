// Navigation content for NextHouse — Architecture Website
// This file is kept for future admin panel use.
// The public website uses its own navigation within each view.

export interface linkChild {
  title: string;
  icon?: string;
  routerName: string;
  children?: Array<linkChild>;
}

export interface IconLink {
  title: string;
  icon: string;
  routerName: string;
  tab?: string;
  children?: Array<linkChild>;
  description?: string;
  permissions?: Array<String>;
  isHidden?: boolean;
}

export const links: Array<IconLink> = [];
