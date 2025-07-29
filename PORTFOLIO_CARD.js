// Portfolio Project Card - LuxuryInventory
// Copy this structure into your portfolio website

const luxuryInventoryProject = {
  id: "luxury-inventory",
  title: "LuxuryInventory",
  subtitle: "AI-Powered Inventory Management System",
  description: "Enterprise-grade inventory management with machine learning forecasting, real-time analytics, and professional reporting for luxury retail businesses.",
  
  // Main image - you'll need to take a screenshot
  image: "/projects/luxury-inventory-dashboard.png",
  
  // Additional screenshots
  gallery: [
    "/projects/luxury-inventory-dashboard.png",
    "/projects/luxury-inventory-ai-insights.png", 
    "/projects/luxury-inventory-reports.png",
    "/projects/luxury-inventory-analytics.png"
  ],
  
  // Technologies used
  technologies: [
    "React", "TypeScript", "Node.js", "PostgreSQL", 
    "Tailwind CSS", "Vite", "Drizzle ORM", "Express",
    "AI/ML", "Recharts", "Radix UI", "jsPDF"
  ],
  
  // Key features for quick overview
  highlights: [
    "🤖 AI-powered sales forecasting with confidence scoring",
    "📊 Real-time analytics dashboard with 3-year historical data",
    "📋 Professional reporting (PDF/Excel/CSV export)",
    "📦 Comprehensive inventory management system",
    "🔄 ERP integration ready (SAP, Oracle, NetSuite)",
    "📱 Fully responsive design"
  ],
  
  // Links
  links: {
    // live: "https://luxury-inventory.your-domain.com", // When deployed
    github: "https://github.com/yourusername/LuxuryInventory",
    // demo: "https://demo.luxury-inventory.com" // If you create a demo
  },
  
  // Project stats
  stats: {
    codeLines: "15,000+",
    components: "50+",
    features: "9 Report Types",
    timeline: "2 weeks"
  },
  
  // Detailed description for modal/expanded view
  longDescription: `
    LuxuryInventory is a comprehensive, enterprise-grade inventory management system 
    designed specifically for luxury retail businesses. Built with modern web technologies 
    and powered by custom AI algorithms, it provides intelligent forecasting, real-time 
    analytics, and professional reporting capabilities.

    The system features advanced machine learning algorithms that analyze historical 
    sales data to provide accurate demand forecasting with confidence scoring. It includes 
    a complete business intelligence dashboard, comprehensive reporting system with 
    PDF/Excel/CSV export capabilities, and is designed to integrate with major ERP systems.
  `,
  
  // Technical details
  technical: {
    frontend: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "Radix UI"],
    backend: ["Node.js", "Express", "PostgreSQL", "Drizzle ORM"],
    features: ["AI Forecasting", "Real-time Analytics", "Multi-format Reports", "ERP Integration"],
    architecture: "Full-stack TypeScript with modern tooling"
  },
  
  // Category for filtering
  category: ["Full-Stack", "AI/ML", "Enterprise", "Dashboard"],
  
  // Featured project indicator
  featured: true,
  
  // Order/priority for display
  order: 1,
  
  // Date
  date: "2025-01-29",
  
  // Status
  status: "Completed"
};

// Example usage in your portfolio component:
// <ProjectCard project={luxuryInventoryProject} />

export default luxuryInventoryProject;
