import { FaRegEdit, FaRegUser } from "react-icons/fa";
import { Feature, NavLink, ProcessStep, SidebarLink } from "./types";
import { RiHistoryLine, RiHomeLine } from "react-icons/ri";
import { GrCopy } from "react-icons/gr";
import { MdBarChart } from "react-icons/md";
import { LuSettings } from "react-icons/lu";
import { IoLogOutOutline } from "react-icons/io5";

export const navLinks: NavLink[] = [
  { name: "home", route: "/" },
  { name: "features", route: "/features" },
  { name: "about", route: "/about" },
  { name: "contact", route: "/contact" },
];

export const footerLinks: NavLink[] = [
  { name: "features", route: "/features" },
  { name: "how it works", route: "/" },
  { name: "reviews", route: "/" },
  { name: "contact", route: "/contact" },
  { name: "terms & privacy", route: "/" },
];

export const features: Feature[] = [
  {
    heading: "Personalized Interview Preparation",
    desc: "Ace the AI Interview Coach analyzes your unique background, strengths, and areas for improvement to create a customized interview preparation plan. Whether you're preparing for a specific role or aiming to improve your overall interview skills, Ace's tailored approach ensures you're focusing on what matters most.",
    img: "/assets/mockup-1.png",
    backgroundColor: "from-[#6F97FF] to-[#597BD4]",
  },
  {
    heading: "Real-Time Feedback and Insights",
    desc: "Get instant feedback on your answers with Ace's real-time performance analysis. Our AI evaluates your responses and tone, providing actionable insights to help you refine your interview techniques. With Ace, you'll know exactly where you stand and what you need to work on.",
    img: "/assets/mockup-2.png",
    backgroundColor: "from-[#8883E5] to-[#6964C9]",
  },
  {
    heading: "Progress Tracking and Analytics",
    desc: "Keep track of your improvement over time with Ace's detailed analytics and progress tracking features. Visualize your journey, identify patterns, and celebrate milestones as you advance. Ace ensures you stay motivated and focused on your goals.",
    img: "/assets/mockup-3.png",
    backgroundColor: "from-[#9570C9] to-[#7A49BF]",
  },
];

export const processSteps: ProcessStep[] = [
  {
    image: "/assets/step-1.png",
    title: "Build Your Professional Profile",
    description:
      "Create a personalized interview preparation plan specific to your industry and career goals.",
  },
  {
    image: "/assets/step-2.png",
    title: "Select Your Practice Mode",
    description:
      "Choose from practice modes including interactive mock interviews, situational scenarios, or behavioral practice.",
  },
  {
    image: "/assets/step-3.png",
    title: "Engage in Interactive Practice",
    description:
      "Participate in realistic interview sessions. Get real-time feedback on your answers.",
  },
  {
    image: "/assets/step-4.png",
    title: "Receive Personalized Feedback",
    description:
      "After each session, receive AI-powered feedback to improve your responses and build confidence.",
  },
  {
    image: "/assets/step-5.png",
    title: "Track Your Progress",
    description:
      "Monitor your improvement over time and track your strengths and areas for growth.",
  },
  {
    image: "/assets/step-6.png",
    title: "Ace Your Interviews!",
    description:
      "Gain the confidence and skills to ace your next interview and land your dream job!",
  },
];

export const sidebarLinks: SidebarLink[] = [
  { label: "Dashboard" },
  { label: "Home", url: "/dashboard", icon: RiHomeLine },
  { label: "Profile", url: "/dashboard/profile", icon: FaRegUser },
  { label: "Preparation" },
  {
    label: "Practice Interviews",
    url: "/dashboard/practice-interviews",
    icon: FaRegEdit,
  },
  { label: "Question Bank", url: "/dashboard/question-bank", icon: GrCopy },
  {
    label: "Feedback History",
    url: "/dashboard/feedback-history",
    icon: RiHistoryLine,
  },
  { label: "Analytics" },
  { label: "Performance", url: "/dashboard/performance", icon: MdBarChart },
  { label: "Account" },
  { label: "Settings", url: "/dashboard/settings", icon: LuSettings },
  { label: "Logout", url: "/dashboard/logout", icon: IoLogOutOutline },
];

export const interviewSuccessRateChartData = [
  {
    date: "2023-10-01",
    score: Math.floor(Math.random() * 101),
    name: "Interview A",
  },
  {
    date: "2023-10-02",
    score: Math.floor(Math.random() * 101),
    name: "Interview B",
  },
  {
    date: "2023-10-03",
    score: Math.floor(Math.random() * 101),
    name: "Interview C",
  },
  {
    date: "2023-10-04",
    score: Math.floor(Math.random() * 101),
    name: "Interview D",
  },
  {
    date: "2023-10-05",
    score: Math.floor(Math.random() * 101),
    name: "Interview E",
  },
  {
    date: "2023-10-06",
    score: Math.floor(Math.random() * 101),
    name: "Interview F",
  },
  {
    date: "2023-10-07",
    score: Math.floor(Math.random() * 101),
    name: "Interview G",
  },
  {
    date: "2023-10-05",
    score: Math.floor(Math.random() * 101),
    name: "Interview H",
  },
  {
    date: "2023-10-06",
    score: Math.floor(Math.random() * 101),
    name: "Interview F",
  },
  {
    date: "2023-10-07",
    score: Math.floor(Math.random() * 101),
    name: "Interview G",
  },
  {
    date: "2023-10-05",
    score: Math.floor(Math.random() * 101),
    name: "Interview E",
  },
  {
    date: "2023-10-06",
    score: Math.floor(Math.random() * 101),
    name: "Interview F",
  },
  {
    date: "2023-10-07",
    score: Math.floor(Math.random() * 101),
    name: "Interview G",
  },
  {
    date: "2023-10-05",
    score: Math.floor(Math.random() * 101),
    name: "Interview E",
  },
  {
    date: "2023-10-06",
    score: Math.floor(Math.random() * 101),
    name: "Interview F",
  },
  {
    date: "2023-10-07",
    score: Math.floor(Math.random() * 101),
    name: "Interview G",
  },
];
