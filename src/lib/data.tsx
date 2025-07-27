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
  { name: "home", route: "#home" },
  { name: "features", route: "#features" },
  { name: "how it works", route: "#how-it-works" },
  { name: "reviews", route: "#reviews" },
  { name: "contact", route: "#contact" },
];

export const footerLinks: NavLink[] = [
  { name: "features", route: "#features" },
  { name: "how it works", route: "#how-it-works" },
  { name: "reviews", route: "#reviews" },
  { name: "contact", route: "#contact" },
  { name: "terms & privacy", route: "#" },
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

export interface Question {
  id: number;
  text: string;
  category: "Technical" | "Behavioral" | "Situational";
  difficulty: "Novice" | "Advanced" | "Hard";
  isBookmarked: boolean;
  explanation: string;
  example: string;
}

export interface FeedbackEntry {
  id: number;
  date: string;
  title: string;
  category: "Technical" | "Behavioral" | "Situational" | "Mock";
  rating: number;
  summary: string;
  explanation?: string;
  example?: string;
}

export const feedbackHistoryData: FeedbackEntry[] = [
  {
    id: 1,
    date: "27 July 2024",
    title: "Developer Interview",
    category: "Technical",
    rating: 3,
    summary: "Strong technical skills, need to work on behavior and how to reply quick.",
    explanation: "Your technical knowledge is solid, but you need to improve your communication speed and behavioral responses.",
    example: "When asked about problem-solving, try to structure your response more clearly and provide specific examples."
  },
  {
    id: 2,
    date: "27 July 2024",
    title: "Web Designer Interview",
    category: "Mock",
    rating: 3,
    summary: "Practice required on web design concepts, answers given were ambiguous.",
    explanation: "Your understanding of design principles needs improvement. Focus on being more specific in your responses.",
    example: "When discussing design decisions, always explain the reasoning behind your choices."
  },
  {
    id: 3,
    date: "26 July 2024",
    title: "Product Manager Interview",
    category: "Behavioral",
    rating: 4,
    summary: "Excellent leadership examples, good communication skills demonstrated.",
    explanation: "You showed strong leadership qualities and communicated effectively throughout the interview.",
    example: "Your STAR method responses were well-structured and impactful."
  },
  {
    id: 4,
    date: "25 July 2024",
    title: "Software Engineer Interview",
    category: "Technical",
    rating: 5,
    summary: "Outstanding technical knowledge, excellent problem-solving approach.",
    explanation: "Your technical skills are exceptional and your problem-solving methodology is sound.",
    example: "Your approach to system design questions was methodical and comprehensive."
  },
  {
    id: 5,
    date: "24 July 2024",
    title: "UX Designer Interview",
    category: "Situational",
    rating: 2,
    summary: "Struggled with user-centered design scenarios, needs more practice.",
    explanation: "You need to focus more on user-centered design thinking and practical application.",
    example: "When presented with design challenges, always start by understanding user needs."
  },
  {
    id: 6,
    date: "23 July 2024",
    title: "Data Scientist Interview",
    category: "Technical",
    rating: 4,
    summary: "Good statistical knowledge, needs improvement in explaining complex concepts.",
    explanation: "Your statistical foundation is strong, but work on simplifying complex explanations for non-technical audiences.",
    example: "When explaining machine learning models, use analogies and real-world examples."
  },
  {
    id: 7,
    date: "22 July 2024",
    title: "Marketing Manager Interview",
    category: "Behavioral",
    rating: 3,
    summary: "Creative thinking demonstrated, but lacked specific metrics and results.",
    explanation: "You showed good creative thinking, but need to provide more concrete examples with measurable outcomes.",
    example: "Always quantify your achievements with specific numbers and percentages."
  },
  {
    id: 8,
    date: "21 July 2024",
    title: "DevOps Engineer Interview",
    category: "Technical",
    rating: 5,
    summary: "Excellent understanding of CI/CD pipelines and cloud infrastructure.",
    explanation: "Your technical knowledge of DevOps practices is comprehensive and well-structured.",
    example: "Your explanation of containerization and orchestration was clear and detailed."
  },
  {
    id: 9,
    date: "20 July 2024",
    title: "Business Analyst Interview",
    category: "Situational",
    rating: 3,
    summary: "Good analytical skills, needs improvement in stakeholder communication.",
    explanation: "Your analytical approach is sound, but focus on better stakeholder engagement techniques.",
    example: "When gathering requirements, use more collaborative techniques and active listening."
  },
  {
    id: 10,
    date: "19 July 2024",
    title: "Frontend Developer Interview",
    category: "Technical",
    rating: 4,
    summary: "Strong React skills, good understanding of modern web development.",
    explanation: "Your frontend development skills are solid, with good knowledge of modern frameworks.",
    example: "Your component architecture and state management explanations were clear and practical."
  },
  {
    id: 11,
    date: "18 July 2024",
    title: "HR Manager Interview",
    category: "Behavioral",
    rating: 4,
    summary: "Excellent people skills, good understanding of HR processes and policies.",
    explanation: "You demonstrated strong interpersonal skills and comprehensive HR knowledge.",
    example: "Your conflict resolution examples were well-structured and showed good judgment."
  },
  {
    id: 12,
    date: "17 July 2024",
    title: "Cybersecurity Analyst Interview",
    category: "Technical",
    rating: 3,
    summary: "Good security awareness, needs more hands-on technical examples.",
    explanation: "Your security knowledge is good, but provide more specific technical implementations.",
    example: "When discussing security measures, include specific tools and methodologies used."
  }
];

export const questionBankData: Question[] = [
  {
    id: 1,
    text: "What is a class in object-oriented programming?",
    category: "Technical",
    difficulty: "Novice",
    isBookmarked: true,
    explanation: "A class in object-oriented programming is a blueprint for creating objects (a particular data structure), providing initial values for state (member variables or properties), and implementations of behavior (member functions or methods).",
    example: "For example, a Car class might have attributes like make, model, and year to describe the car, and methods like start_engine and drive to define its behaviors. An instance of the Car class, such as a specific Toyota Corolla from 2020, would have the attributes set to \"Toyota\", \"Corolla\", and \"2020\", respectively, and could perform the actions defined by its methods."
  },
  {
    id: 2,
    text: "Can you describe a time when you had to handle a difficult team member? How did you manage the situation?",
    category: "Behavioral",
    difficulty: "Advanced",
    isBookmarked: false,
    explanation: "This behavioral question assesses your conflict resolution skills, leadership abilities, and emotional intelligence. It's designed to understand how you handle interpersonal challenges in a professional setting.",
    example: "A strong answer would follow the STAR method: Situation (describe the context), Task (explain your responsibility), Action (detail what you did), and Result (share the outcome). For instance, you might describe a situation where a team member was consistently missing deadlines, how you addressed it through one-on-one meetings and support, and how it ultimately improved team performance."
  },
  {
    id: 3,
    text: "Imagine you are leading a project with a tight deadline, and a key team member unexpectedly falls ill. How would you handle the situation?",
    category: "Situational",
    difficulty: "Novice",
    isBookmarked: false,
    explanation: "This situational question evaluates your problem-solving skills, adaptability, and project management abilities. It tests how you handle unexpected challenges while maintaining project momentum.",
    example: "A comprehensive response would include: assessing the impact on the timeline, redistributing tasks among remaining team members, communicating with stakeholders about potential delays, and implementing contingency plans such as bringing in temporary support or adjusting project scope if necessary."
  },
  {
    id: 4,
    text: "How does a binary search tree work, and what are its advantages?",
    category: "Technical",
    difficulty: "Hard",
    isBookmarked: false,
    explanation: "A binary search tree (BST) is a hierarchical data structure where each node has at most two children, and the left subtree contains only nodes with values less than the parent node, while the right subtree contains only nodes with values greater than the parent node.",
    example: "Consider a BST with values [8, 3, 10, 1, 6, 14, 4, 7, 13]. The root is 8, left subtree contains [3, 1, 6, 4, 7], and right subtree contains [10, 14, 13]. This structure enables efficient search operations with O(log n) time complexity in balanced trees, making it ideal for applications requiring frequent search operations."
  },
  {
    id: 5,
    text: "Describe a project where you had to make a critical decision without having all the necessary information. What was the outcome?",
    category: "Technical",
    difficulty: "Hard",
    isBookmarked: false,
    explanation: "This question assesses your decision-making process under uncertainty, risk management skills, and ability to work with incomplete information. It's common in technical roles where requirements may be unclear or evolving.",
    example: "A good response might involve choosing a technology stack for a new project with limited requirements, explaining how you researched alternatives, consulted with stakeholders, made an informed decision based on available information, and how you adapted when new requirements emerged during development."
  },
  {
    id: 6,
    text: "Explain the concept of dependency injection and its benefits in software development.",
    category: "Technical",
    difficulty: "Advanced",
    isBookmarked: false,
    explanation: "Dependency injection is a design pattern where dependencies (objects that a class needs) are provided to the class from the outside rather than being created within the class itself. This promotes loose coupling and makes code more testable and maintainable.",
    example: "Instead of a UserService creating its own DatabaseConnection, the DatabaseConnection is injected through the constructor. This allows for easy testing by injecting mock objects and makes the code more modular and flexible."
  },
  {
    id: 7,
    text: "Tell me about a time when you had to learn a new technology quickly to complete a project.",
    category: "Behavioral",
    difficulty: "Advanced",
    isBookmarked: false,
    explanation: "This question evaluates your learning ability, adaptability, and how you handle pressure when faced with new challenges. It's particularly relevant in fast-paced technical environments.",
    example: "Describe a situation where you needed to learn a new framework or tool, explain your learning approach (documentation, tutorials, peer learning), how you applied it to the project, and the successful outcome achieved."
  },
  {
    id: 8,
    text: "How would you approach debugging a production issue that's affecting multiple users?",
    category: "Situational",
    difficulty: "Advanced",
    isBookmarked: false,
    explanation: "This situational question tests your problem-solving methodology, prioritization skills, and ability to work under pressure. It assesses how you handle critical issues that impact business operations.",
    example: "A systematic approach would include: immediately assessing the scope and impact, implementing temporary workarounds if possible, gathering logs and error reports, reproducing the issue in a controlled environment, identifying the root cause, implementing a fix, testing thoroughly, and communicating updates to stakeholders."
  },
  {
    id: 9,
    text: "What is the difference between synchronous and asynchronous programming?",
    category: "Technical",
    difficulty: "Novice",
    isBookmarked: false,
    explanation: "Synchronous programming executes code sequentially, where each operation must complete before the next one begins. Asynchronous programming allows operations to run in the background without blocking the execution of subsequent code.",
    example: "In synchronous code, if you're reading a file, the program waits until the file is completely read before moving to the next line. In asynchronous code, you can start reading the file and continue with other operations while the file is being read in the background."
  },
  {
    id: 10,
    text: "Describe a situation where you had to work with a team member who had a different working style than yours.",
    category: "Behavioral",
    difficulty: "Novice",
    isBookmarked: false,
    explanation: "This question assesses your interpersonal skills, adaptability, and ability to work effectively in diverse teams. It evaluates how you handle differences and collaborate with various personality types.",
    example: "You might describe working with someone who prefers detailed planning while you're more spontaneous, how you found common ground, adapted your communication style, and ultimately delivered successful results together."
  }
];