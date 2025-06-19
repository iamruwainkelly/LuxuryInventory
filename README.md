# LuxuryInventory - Advanced Inventory Management System

A comprehensive luxury-themed inventory management system built with React, TypeScript, and PostgreSQL, featuring 3-year historical analytics, ERP/WMS integration, and professional reporting capabilities.

## Features

### 📊 Advanced Analytics
- **3-Year Historical Data**: Complete analytics from 2022-2024 with monthly, quarterly, and yearly views
- **Real-time Metrics**: Live revenue, profit, orders, and stock movement tracking
- **Period Comparisons**: Automatic calculation of period-over-period growth rates
- **Interactive Charts**: Professional data visualization with Recharts

### 👥 Client Management
- **Client History Modals**: Interactive modals with complete transaction history
- **Spending Patterns**: Monthly spending trends with interactive charts
- **Order Analytics**: Completion rates, average order values, and recent activity tracking
- **Comprehensive Profiles**: Contact information, order history, and transaction details

### 📦 Stock Management
- **Real-time Adjustments**: User-controlled stock add/remove operations
- **Movement Tracking**: Automatic logging of all stock movements with reasons
- **Validation Rules**: Prevents negative stock and tracks inventory changes
- **Predefined Reasons**: Quick selection for common stock adjustment scenarios

### 🏭 ERP/WMS Integration
- **Multi-system Support**: SAP, Oracle, NetSuite, Microsoft Dynamics 365, and custom APIs
- **Flexible Authentication**: Bearer tokens, Basic auth, API keys, OAuth2
- **Bidirectional Sync**: Import/export with configurable intervals and batch processing
- **Field Mapping**: Customizable data mapping between systems
- **Webhook Support**: Real-time integration with external system events

### 📈 Reporting & Business Intelligence
- **PDF/Excel Export**: Professional report generation with actual export functionality
- **AI Projections**: Machine learning-based sales forecasting with confidence levels
- **Financial Analytics**: Revenue, costs, profit margins, and transaction analysis
- **Warehouse Management**: Location tracking, occupancy monitoring, and capacity planning

### 🔧 Operations Management
- **Returns & Repairs**: Complete tracking with warranty management
- **Device Replacements**: Warranty and upgrade tracking with cost analysis
- **Business Rules Engine**: Configurable inventory rules and approval workflows
- **Multi-location Support**: Warehouse zones, aisles, shelves, and bin management

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: Shadcn/ui with luxury glassmorphism theme
- **State Management**: TanStack Query for server state
- **Build Tools**: Vite for fast development and building

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ruwainkelly/LuxuryInventory.git
cd LuxuryInventory
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Database connection will be configured automatically
# Additional secrets can be added via the Integration settings
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Database Features

- **3-Year Seed Data**: Automatically generates realistic historical data from 2022-2024
- **PostgreSQL Integration**: Full ACID compliance with relationship management
- **Migration Support**: Schema versioning with Drizzle Kit
- **Performance Optimized**: Indexed queries and efficient data structures

## Integration Capabilities

### Supported ERP Systems
- **SAP ERP**: Full OData API integration with materials and sales orders
- **Oracle ERP Cloud**: REST API integration with inventory and financial data
- **NetSuite**: SuiteTalk API integration with real-time sync
- **Microsoft Dynamics 365**: Power Platform integration with CRM/ERP data
- **Custom APIs**: Flexible adapter pattern for any REST API system

### Integration Features
- Real-time bidirectional synchronization
- Configurable field mapping and data transformation
- Automatic conflict resolution with multiple strategies
- Comprehensive error handling and retry mechanisms
- Webhook support for real-time updates

## Deployment

The system is designed for deployment on Replit with automatic scaling and built-in database support. The application can also be deployed to any Node.js hosting platform.

### Production Considerations
- Environment variables for database and API configurations
- SSL/TLS encryption for data transmission
- Role-based access control (configurable)
- Audit logging for compliance requirements

## License

MIT License - see LICENSE file for details

## Support

For technical support or feature requests, please open an issue on GitHub.

---

**LuxuryInventory** - Professional inventory management for modern businesses