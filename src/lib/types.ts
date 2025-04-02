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

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
}

export enum DashboardStatsCardType {
  PracticeSessions = "practice-sessions",
  InterviewSuccess = "interview-success",
  InterviewThisWeek = "interview-this-week",
}
