// DO NOT REMOVE (used for API routes and other baseUrl related stuff)
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Customize the Landing Page Links, using section id or a new page / routes
export const LANDING_PAGE_LINKS = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Features",
    url: "#features",
  },
  {
    title: "Tech Stacks",
    url: "#tech-stacks",
  },
  {
    title: "FAQ",
    url: "#faq",
  },
];

/**
 * Feel free to remove the variables below and customize the layout, content,
 * and logic according to your actual project needs.
 */
export const FEATURES_SECTION = [
  {
    icon: "🧩",
    title: "Modular Architecture",
    description:
      " Route groups for separation between landing, auth, and dashboard views.",
  },
  {
    icon: "🔐",
    title: "Authentication Ready",
    description:
      "Secure sign-in & register flow using NextAuth, with role-based access.",
  },
  {
    icon: "💅",
    title: "Beautiful UI",
    description:
      " Use shadcn/ui components and Tailwind to build fast with consistency.",
  },
  {
    icon: "🗺️",
    title: "Built-in Routing",
    description:
      "Effortlessly navigate your application with Next.js's intuitive file-system routing.",
  },
  {
    icon: "⚙️",
    title: "Optimized Performance",
    description:
      "Built with performance in mind, leveraging Next.js's optimization features.",
  },
  {
    icon: "🧑‍💻",
    title: "Clean Code Structure",
    description:
      "Well-organized and easy-to-understand project structure for maintainability.",
  },
];

export const TECH_STACKS = [
  {
    name: "Next.js",
    icon: "/assets/logo/nextjs.svg",
    description:
      "The fullstack React framework with built-in routing, server actions, and optimized performance for modern web apps.",
    docs: "https://nextjs.org/docs",
  },
  {
    name: "TypeScript",
    icon: "/assets/logo/typescript.svg",
    description:
      "A typed superset of JavaScript that helps you catch errors early and build scalable, maintainable applications with confidence.",
    docs: "https://www.typescriptlang.org/docs/",
  },
  {
    name: "Tailwind CSS",
    icon: "/assets/logo/tailwind.svg",
    description:
      "Utility-first CSS framework that lets you design directly in your markup with speed and consistency.",
    docs: "https://tailwindcss.com/",
  },
  {
    name: "shadcn/ui",
    icon: "/assets/logo/shadcn.svg",
    description:
      "Accessible and beautifully styled components built on Radix UI and Tailwind, made for real-world applications.",
    docs: "https://ui.shadcn.com/docs",
  },
  {
    name: "PostgreSQL",
    icon: "/assets/logo/postgre.svg",
    description:
      "A powerful, open-source relational database system known for reliability, performance, and robust feature support.",
    docs: "https://www.postgresql.org/docs/",
  },
  {
    name: "Prisma ORM",
    icon: "/assets/logo/prisma.svg",
    description:
      "Type-safe ORM for PostgreSQL that makes working with your database feel intuitive, efficient, and secure.",
    docs: "https://www.prisma.io/docs",
  },
  {
    name: "NextAuth.js",
    icon: "/assets/logo/nextauth.png",
    description:
      "Authentication for Next.js made simple, with built-in support for OAuth providers, credentials, and role-based sessions.",
    docs: "https://next-auth.js.org/getting-started/introduction",
  },
  {
    name: "Framer Motion",
    icon: "/assets/logo/framer.svg",
    description:
      "An animation library for React that brings your UI to life with smooth transitions and interactive animations.",
    docs: "https://motion.dev/docs/react-quick-start",
  },
];

export const FAQ_LISTS = [
  {
    question: "What is Emploria and who is it for?",
    answer:
      "Emploria is a Next.js starter template built for developers who want to ship fullstack apps fast. It's perfect for indie hackers, students, and product teams who want scalable structure without spending hours on boilerplate setup.",
  },
  {
    question: "Can I use this template for production apps?",
    answer:
      "Yes! Emploria uses production-ready technologies like Prisma, NextAuth, and PostgreSQL. With proper environment variables and security practices in place, you can deploy right away.",
  },
  {
    question: "How is authentication handled in Emploria?",
    answer:
      "Authentication is powered by NextAuth.js. You can use OAuth providers like GitHub, or add email/password credentials with role-based session control.",
  },
  {
    question: "Can I customize the layout and components?",
    answer:
      "Definitely. The layout uses modular file structures and shadcn/ui components, which makes customization easy and scalable.",
  },
  {
    question: "Is the database setup ready to use?",
    answer:
      "Yes. Emploria is pre-configured with Prisma ORM and connected to a PostgreSQL database (via Supabase or your own). You can start modeling your schemas right away in prisma schema.",
  },
  {
    question: "How do I deploy this template?",
    answer:
      "You can deploy using Vercel, as it integrates seamlessly with Next.js. Just make sure you set your environment variables correctly on your deployment dashboard.",
  },
];
