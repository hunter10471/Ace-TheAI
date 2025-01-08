import { IconType } from "react-icons";

export interface NavLink {
  route: string;
  name: string;
}

export interface Feature {
  img: string;
  backgroundColor: string;
  heading: string;
  desc: string;
}

export interface ProcessStep {
  image: string;
  title: string;
  description: string;
}

export interface SidebarLink {
  label: string;
  url?: string;
  icon?: IconType;
}
