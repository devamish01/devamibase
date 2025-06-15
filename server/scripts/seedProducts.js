import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product, User } from "../models/index.js";
import { connectDB, disconnectDB } from "../db.js";

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    // Sample products data
    const products = [
      {
        title: "Premium E-Commerce Platform",
        description:
          "A fully customizable e-commerce solution built with modern web technologies. Features include inventory management, payment processing, and advanced analytics.",
        price: 2999,
        images: [
          {
            url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
            publicId: "ecommerce-1",
          },
          {
            url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
            publicId: "ecommerce-2",
          },
        ],
        thumbnail: {
          url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
          publicId: "ecommerce-thumb",
        },
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
        inventory: 5,
      },
      {
        title: "Business Management System",
        description:
          "Comprehensive business management solution with CRM, project management, and financial tracking capabilities.",
        price: 4599,
        images: [
          {
            url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
            publicId: "business-1",
          },
        ],
        thumbnail: {
          url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80",
          publicId: "business-thumb",
        },
        features: [
          "Customer relationship management",
          "Project tracking and management",
          "Financial reporting and analytics",
          "Team collaboration tools",
          "Automated workflow management",
          "Integration with popular tools",
        ],
        technologies: [
          "Next.js",
          "TypeScript",
          "PostgreSQL",
          "GraphQL",
          "Docker",
        ],
        category: "Business Tools",
        inventory: 3,
      },
      {
        title: "Custom Mobile App",
        description:
          "Cross-platform mobile application with native performance and beautiful user interface design.",
        price: 3299,
        images: [
          {
            url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
            publicId: "mobile-1",
          },
        ],
        thumbnail: {
          url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80",
          publicId: "mobile-thumb",
        },
        features: [
          "Cross-platform compatibility",
          "Push notifications",
          "Offline functionality",
          "Native performance",
          "Beautiful UI/UX design",
          "App store optimization",
        ],
        technologies: [
          "React Native",
          "Firebase",
          "Redux",
          "Expo",
          "TypeScript",
        ],
        category: "Mobile Apps",
        inventory: 8,
      },
      {
        title: "AI-Powered Analytics Dashboard",
        description:
          "Advanced analytics platform with machine learning capabilities for data-driven insights and predictions.",
        price: 5999,
        images: [
          {
            url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
            publicId: "analytics-1",
          },
        ],
        thumbnail: {
          url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
          publicId: "analytics-thumb",
        },
        features: [
          "Machine learning algorithms",
          "Predictive analytics",
          "Real-time data processing",
          "Custom report generation",
          "API integrations",
          "Advanced visualization",
        ],
        technologies: [
          "Python",
          "TensorFlow",
          "React",
          "D3.js",
          "Apache Kafka",
        ],
        category: "Analytics",
        inventory: 2,
      },
      {
        title: "SaaS Startup Platform",
        description:
          "Complete SaaS platform foundation with user management, subscription billing, and multi-tenancy support.",
        price: 7999,
        images: [
          {
            url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
            publicId: "saas-1",
          },
        ],
        thumbnail: {
          url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80",
          publicId: "saas-thumb",
        },
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
        inventory: 1,
      },
      {
        title: "Portfolio Website Template",
        description:
          "Professional portfolio website template with modern design and content management system.",
        price: 899,
        images: [
          {
            url: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
            publicId: "portfolio-1",
          },
        ],
        thumbnail: {
          url: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&q=80",
          publicId: "portfolio-thumb",
        },
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
        inventory: 10,
      },
    ];

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create default admin user
    const existingAdmin = await User.findOne({ email: "admin@davami.com" });

    if (!existingAdmin) {
      const adminUser = new User({
        name: "Davami Admin",
        email: "admin@davami.com",
        password: "admin123", // This will be hashed automatically
        role: "admin",
      });

      await adminUser.save();
      console.log("👤 Created default admin user");
      console.log("📧 Admin email: admin@davami.com");
      console.log("🔑 Admin password: admin123");
    } else {
      console.log("👤 Admin user already exists");
    }

    console.log("🎉 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed error:", error);
  } finally {
    await disconnectDB();
  }
};

seedData();
