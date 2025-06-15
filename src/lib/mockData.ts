export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  thumbnail: string;
  features: string[];
  technologies: string[];
  category: string;
  inStock: boolean;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    title: "Premium E-Commerce Platform",
    description:
      "A fully customizable e-commerce solution built with modern web technologies. Features include inventory management, payment processing, and advanced analytics.",
    price: 2999,
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
    features: [
      "Multi-vendor support",
      "Advanced inventory management",
      "Integrated payment gateway",
      "Real-time analytics dashboard",
      "Mobile-responsive design",
      "SEO optimization",
    ],
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
    category: "E-Commerce",
    inStock: true,
  },
  {
    id: "2",
    title: "Business Management System",
    description:
      "Comprehensive business management solution with CRM, project management, and financial tracking capabilities.",
    price: 4599,
    images: [
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80",
    features: [
      "Customer relationship management",
      "Project tracking and management",
      "Financial reporting and analytics",
      "Team collaboration tools",
      "Automated workflow management",
      "Integration with popular tools",
    ],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "GraphQL", "Docker"],
    category: "Business Tools",
    inStock: true,
  },
  {
    id: "3",
    title: "Custom Mobile App",
    description:
      "Cross-platform mobile application with native performance and beautiful user interface design.",
    price: 3299,
    images: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80",
    features: [
      "Cross-platform compatibility",
      "Push notifications",
      "Offline functionality",
      "Native performance",
      "Beautiful UI/UX design",
      "App store optimization",
    ],
    technologies: ["React Native", "Firebase", "Redux", "Expo", "TypeScript"],
    category: "Mobile Apps",
    inStock: true,
  },
  {
    id: "4",
    title: "AI-Powered Analytics Dashboard",
    description:
      "Advanced analytics platform with machine learning capabilities for data-driven insights and predictions.",
    price: 5999,
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    features: [
      "Machine learning algorithms",
      "Predictive analytics",
      "Real-time data processing",
      "Custom report generation",
      "API integrations",
      "Advanced visualization",
    ],
    technologies: ["Python", "TensorFlow", "React", "D3.js", "Apache Kafka"],
    category: "Analytics",
    inStock: true,
  },
  {
    id: "5",
    title: "SaaS Startup Platform",
    description:
      "Complete SaaS platform foundation with user management, subscription billing, and multi-tenancy support.",
    price: 7999,
    images: [
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80",
    features: [
      "Multi-tenant architecture",
      "Subscription billing system",
      "User authentication and authorization",
      "API rate limiting",
      "Admin dashboard",
      "Scalable infrastructure",
    ],
    technologies: ["Next.js", "Prisma", "Stripe", "Auth0", "Vercel"],
    category: "SaaS",
    inStock: true,
  },
  {
    id: "6",
    title: "Portfolio Website Template",
    description:
      "Professional portfolio website template with modern design and content management system.",
    price: 899,
    images: [
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&q=80",
    features: [
      "Responsive design",
      "Contact form integration",
      "Blog functionality",
      "SEO optimized",
      "Fast loading times",
      "Easy customization",
    ],
    technologies: ["React", "Gatsby", "GraphQL", "Netlify CMS"],
    category: "Websites",
    inStock: true,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((product) => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter((product) => product.category === category);
};

export const getAllCategories = (): string[] => {
  return [...new Set(mockProducts.map((product) => product.category))];
};
