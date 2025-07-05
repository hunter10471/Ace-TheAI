import { FaRegEdit, FaRegUser } from "react-icons/fa";
import { Feature, NavLink, ProcessStep, SidebarLink } from "./types";
import { RiHistoryLine, RiHomeLine } from "react-icons/ri";
import { GrCopy } from "react-icons/gr";
import { MdBarChart } from "react-icons/md";
import { LuSettings } from "react-icons/lu";
import { IoLogOutOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import { IoStatsChartOutline } from "react-icons/io5";
import { LuPieChart } from "react-icons/lu";

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

export const weeklyData = [
  { day: "Mon", hours: 2.5, bgColor: "bg-[#FFD9D1]", borderColor: "border-[#FEA997]" },
  { day: "Tue", hours: 3.2, bgColor: "bg-[#FFD9D1]", borderColor: "border-[#FEA997]" },
  { day: "Wed", hours: 4.8, bgColor: "bg-[#FFFEAD]", borderColor: "border-[#CBC956]" },
  { day: "Thu", hours: 5.2, bgColor: "bg-[#FFFEAD]", borderColor: "border-[#CBC956]" },
  { day: "Fri", hours: 5.8, bgColor: "bg-[#C9E2FF]", borderColor: "border-[#63A8FD]" },
  { day: "Sat", hours: 4.5, bgColor: "bg-[#C1FAFF]", borderColor: "border-[#77DAE3]" },
  { day: "Sun", hours: 3.0, bgColor: "bg-[#F3DEF1]", borderColor: "border-[#E486E0]" },
]

export const highlightDates = [6, 13, 22];
export const activityStats = [
  {
    value: "256",
    label: "Learning hours",
    icon: <IoTimeOutline size={22} />,
    color: "bg-[#009EFA]",
  },
  {
    value: "90/100",
    label: "Average test result",
    icon: <IoStatsChartOutline size={22} />,
    color: "bg-[#00C9A7]",
  },
  {
    value: "48",
    label: "Interviews participated",
    icon: <LuPieChart size={22} />,
    color: "bg-[#C197FF]",
  },
];

export const skills = [
  // Technology & Software Development
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  
  // Healthcare & Medical
  "Patient Care",
  "Medical Diagnosis",
  "Surgery",
  "Pharmacology",
  "Anatomy",
  "Physiology",
  "Medical Records",
  "CPR",
  "First Aid",
  "Medical Equipment",
  "Nursing",
  "Radiology",
  
  // Legal & Law
  "Legal Research",
  "Contract Law",
  "Criminal Law",
  "Civil Law",
  "Corporate Law",
  "Legal Writing",
  "Litigation",
  "Mediation",
  "Arbitration",
  "Compliance",
  "Legal Analysis",
  "Case Management",
  
  // Finance & Accounting
  "Financial Analysis",
  "Accounting",
  "Bookkeeping",
  "Tax Preparation",
  "Auditing",
  "Financial Planning",
  "Investment Analysis",
  "Risk Management",
  "QuickBooks",
  "SAP",
  "Excel",
  "Financial Modeling",
  
  // Education & Teaching
  "Curriculum Development",
  "Lesson Planning",
  "Classroom Management",
  "Student Assessment",
  "Educational Psychology",
  "Teaching Methods",
  "Learning Disabilities",
  "Special Education",
  "Online Teaching",
  "Educational Technology",
  "Child Development",
  "Academic Counseling",
  
  // Engineering & Construction
  "AutoCAD",
  "Civil Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Structural Design",
  "Project Planning",
  "Construction Management",
  "Blueprint Reading",
  "Quality Control",
  "Safety Protocols",
  "Building Codes",
  "Cost Estimation",
  
  // Business & Management
  "Leadership",
  "Team Management",
  "Strategic Planning",
  "Business Development",
  "Sales Management",
  "Marketing Strategy",
  "Customer Relations",
  "Negotiation",
  "Budget Management",
  "Performance Management",
  "Change Management",
  "Operations Management",
  
  // Creative & Design
  "Graphic Design",
  "Web Design",
  "UX/UI Design",
  "Photoshop",
  "Illustrator",
  "InDesign",
  "Figma",
  "Adobe XD",
  "Typography",
  "Color Theory",
  "Brand Design",
  "Creative Writing",
  
  // Hospitality & Service
  "Customer Service",
  "Food Service",
  "Hotel Management",
  "Event Planning",
  "Catering",
  "Restaurant Management",
  "Hospitality Management",
  "Travel Planning",
  "Guest Relations",
  "Inventory Management",
  "Staff Training",
  "Quality Assurance",
  
  // Manufacturing & Production
  "Quality Control",
  "Process Improvement",
  "Lean Manufacturing",
  "Six Sigma",
  "Production Planning",
  "Supply Chain Management",
  "Inventory Control",
  "Safety Management",
  "Equipment Maintenance",
  "ISO Standards",
  "Manufacturing Processes",
  "Cost Reduction",
  
  // Sales & Marketing
  "Sales Strategy",
  "Lead Generation",
  "Customer Acquisition",
  "Digital Marketing",
  "Content Marketing",
  "Social Media Marketing",
  "Email Marketing",
  "SEO",
  "SEM",
  "Google Analytics",
  "CRM Systems",
  "Market Research",
  
  // Human Resources
  "Recruitment",
  "Employee Relations",
  "Performance Management",
  "Training & Development",
  "Compensation & Benefits",
  "HR Policies",
  "Employment Law",
  "Conflict Resolution",
  "Talent Acquisition",
  "Organizational Development",
  "HRIS",
  "Payroll Management",
  
  // Transportation & Logistics
  "Logistics Planning",
  "Supply Chain Management",
  "Route Optimization",
  "Inventory Management",
  "Warehouse Management",
  "Transportation Management",
  "Fleet Management",
  "Shipping & Receiving",
  "Import/Export",
  "Customs Regulations",
  "Safety Compliance",
  "Cost Analysis"
];

export const jobTitles = [
  // Healthcare & Medical
  "Doctor",
  "Nurse",
  "Surgeon",
  "Dentist",
  "Pharmacist",
  "Veterinarian",
  "Physical Therapist",
  "Radiologist",
  "Psychiatrist",
  "Paramedic",
  "Medical Assistant",
  "Lab Technician",
  
  // Legal & Law
  "Lawyer",
  "Paralegal",
  "Judge",
  "Legal Assistant",
  "Attorney",
  "Legal Advisor",
  "Corporate Counsel",
  "Public Defender",
  "Prosecutor",
  "Legal Secretary",
  "Court Reporter",
  "Mediator",
  
  // Finance & Accounting
  "Accountant",
  "Financial Analyst",
  "Investment Banker",
  "Tax Advisor",
  "Auditor",
  "Financial Planner",
  "Insurance Agent",
  "Loan Officer",
  "Bookkeeper",
  "Budget Analyst",
  "Credit Analyst",
  "Risk Manager",
  
  // Education & Teaching
  "Teacher",
  "Professor",
  "School Principal",
  "Librarian",
  "School Counselor",
  "Educational Coordinator",
  "Tutor",
  "Training Specialist",
  "Curriculum Developer",
  "Academic Advisor",
  "Special Education Teacher",
  "Substitute Teacher",
  
  // Engineering & Construction
  "Civil Engineer",
  "Mechanical Engineer",
  "Electrical Engineer",
  "Construction Manager",
  "Architect",
  "Project Manager",
  "Structural Engineer",
  "Safety Engineer",
  "Quality Engineer",
  "Site Supervisor",
  "Building Inspector",
  "Surveyor",
  
  // Business & Management
  "Business Manager",
  "Operations Manager",
  "General Manager",
  "Executive Assistant",
  "Administrative Assistant",
  "Office Manager",
  "Business Analyst",
  "Management Consultant",
  "Strategy Consultant",
  "Business Development Manager",
  "Product Manager",
  "Project Coordinator",
  
  // Technology & IT
  "Software Engineer",
  "Web Developer",
  "Data Scientist",
  "Cybersecurity Specialist",
  "IT Support Specialist",
  "Network Administrator",
  "Database Administrator",
  "UI/UX Designer",
  "Mobile App Developer",
  "DevOps Engineer",
  "Technical Writer",
  "System Analyst",
  
  // Sales & Marketing
  "Sales Manager",
  "Marketing Manager",
  "Sales Representative",
  "Marketing Specialist",
  "Digital Marketing Manager",
  "Content Manager",
  "Social Media Manager",
  "Brand Manager",
  "Account Manager",
  "Customer Success Manager",
  "Market Research Analyst",
  "Public Relations Specialist",
  
  // Creative & Design
  "Graphic Designer",
  "Web Designer",
  "Interior Designer",
  "Fashion Designer",
  "Photographer",
  "Video Editor",
  "Copywriter",
  "Content Writer",
  "Journalist",
  "Editor",
  "Art Director",
  "Creative Director",
  
  // Hospitality & Service
  "Hotel Manager",
  "Restaurant Manager",
  "Chef",
  "Event Planner",
  "Travel Agent",
  "Concierge",
  "Bartender",
  "Waiter/Waitress",
  "Housekeeper",
  "Tour Guide",
  "Catering Manager",
  "Food Service Manager",
  
  // Human Resources
  "HR Manager",
  "HR Generalist",
  "Recruiter",
  "Training Manager",
  "Compensation Analyst",
  "Employee Relations Specialist",
  "HR Coordinator",
  "Payroll Specialist",
  "Benefits Administrator",
  "Talent Acquisition Manager",
  "Organizational Development Manager",
  "HR Business Partner",
  
  // Manufacturing & Production
  "Production Manager",
  "Quality Control Inspector",
  "Manufacturing Engineer",
  "Plant Manager",
  "Production Supervisor",
  "Assembly Line Worker",
  "Machine Operator",
  "Maintenance Technician",
  "Supply Chain Manager",
  "Inventory Manager",
  "Logistics Coordinator",
  "Warehouse Manager",
  
  // Transportation & Logistics
  "Truck Driver",
  "Delivery Driver",
  "Pilot",
  "Air Traffic Controller",
  "Logistics Manager",
  "Transportation Coordinator",
  "Fleet Manager",
  "Shipping Coordinator",
  "Customs Broker",
  "Freight Forwarder",
  "Route Planner",
  "Dispatch Coordinator",
  
  // Public Service & Safety
  "Police Officer",
  "Firefighter",
  "Emergency Medical Technician",
  "Social Worker",
  "Government Worker",
  "Public Administrator",
  "City Planner",
  "Environmental Specialist",
  "Park Ranger",
  "Military Officer",
  "Security Guard",
  "Immigration Officer",
  
  // Skilled Trades
  "Electrician",
  "Plumber",
  "Carpenter",
  "HVAC Technician",
  "Mechanic",
  "Welder",
  "Painter",
  "Roofer",
  "Locksmith",
  "Appliance Repair Technician",
  "Landscaper",
  "Handyman"
];