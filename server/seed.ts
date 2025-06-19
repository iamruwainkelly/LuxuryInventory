import { db } from './db';
import { users, categories, suppliers, clients, products, stockMovements, orders, warehouseLocations, financialTransactions, repairs, salesProjections } from '@shared/schema';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed categories first
    await db.insert(categories).values([
      { name: "Electronics", description: "Electronic devices and accessories" },
      { name: "Furniture", description: "Home and office furniture" },
      { name: "Audio", description: "Audio equipment and accessories" },
    ]).onConflictDoNothing();

    // Seed suppliers
    await db.insert(suppliers).values([
      {
        name: "TechCorp Solutions",
        contactEmail: "contact@techcorp.com",
        contactPhone: "+1-555-0101",
        address: "123 Tech Street, Silicon Valley, CA",
        notes: "Premium electronics supplier",
      },
      {
        name: "Global Electronics",
        contactEmail: "sales@globalelectronics.com",
        contactPhone: "+1-555-0102",
        address: "456 Electronic Ave, Austin, TX",
        notes: "Wholesale electronics distributor",
      },
    ]).onConflictDoNothing();

    // Seed clients
    await db.insert(clients).values([
      {
        name: "Premium Retail Co.",
        email: "orders@premiumretail.com",
        phone: "+1-555-0201",
        address: "789 Retail Blvd, New York, NY",
        notes: "High-volume retail customer",
      },
      {
        name: "Tech Solutions Ltd.",
        email: "procurement@techsolutions.com",
        phone: "+1-555-0202",
        address: "321 Business Park, Seattle, WA",
        notes: "B2B technology reseller",
      },
    ]).onConflictDoNothing();

    // Seed products
    await db.insert(products).values([
      {
        sku: "SKU-001",
        name: "iPhone 15 Pro Max",
        description: "256GB, Deep Purple",
        categoryId: 1,
        supplierId: 1,
        costPrice: "999.00",
        sellingPrice: "1199.00",
        currentStock: 47,
        minStockLevel: 10,
        barcode: "123456789001",
        isActive: true,
      },
      {
        sku: "SKU-002",
        name: "MacBook Air M3",
        description: "15-inch, 512GB SSD",
        categoryId: 1,
        supplierId: 1,
        costPrice: "1299.00",
        sellingPrice: "1499.00",
        currentStock: 12,
        minStockLevel: 15,
        barcode: "123456789002",
        isActive: true,
      },
      {
        sku: "SKU-003",
        name: "Samsung Galaxy S24 Ultra",
        description: "512GB, Titanium Black",
        categoryId: 1,
        supplierId: 2,
        costPrice: "1099.00",
        sellingPrice: "1299.00",
        currentStock: 5,
        minStockLevel: 10,
        barcode: "123456789003",
        isActive: true,
      },
      {
        sku: "SKU-004",
        name: "AirPods Pro (3rd Gen)",
        description: "USB-C, Noise Cancellation",
        categoryId: 3,
        supplierId: 1,
        costPrice: "199.00",
        sellingPrice: "249.00",
        currentStock: 89,
        minStockLevel: 20,
        barcode: "123456789004",
        isActive: true,
      },
    ]).onConflictDoNothing();

    // Seed default user
    await db.insert(users).values([
      {
        username: "admin",
        password: "admin123", // In production, this should be hashed
        role: "admin",
      },
    ]).onConflictDoNothing();

    // Seed orders
    await db.insert(orders).values([
      {
        orderNumber: "ORD-001",
        clientId: 1,
        orderType: "sale",
        status: "confirmed",
        totalAmount: "2398.00",
        notes: "Bulk order for corporate client",
      },
      {
        orderNumber: "PO-001",
        supplierId: 1,
        orderType: "purchase",
        status: "pending",
        totalAmount: "15000.00",
        notes: "Quarterly inventory restock",
      },
    ]).onConflictDoNothing();

    // Seed stock movements
    await db.insert(stockMovements).values([
      {
        productId: 1,
        movementType: "in",
        quantity: 50,
        reason: "Initial stock",
        userId: 1,
      },
      {
        productId: 2,
        movementType: "in",
        quantity: 25,
        reason: "Supplier delivery",
        userId: 1,
      },
      {
        productId: 1,
        movementType: "out",
        quantity: 3,
        reason: "Sale to customer",
        userId: 1,
      },
      {
        productId: 3,
        movementType: "out",
        quantity: 5,
        reason: "Quality control issue",
        userId: 1,
      },
    ]).onConflictDoNothing();

    // Seed warehouse locations
    await db.insert(warehouseLocations).values([
      {
        zone: "A",
        aisle: "01",
        shelf: "A",
        bin: "001",
        capacity: 100,
        currentOccupancy: 85,
      },
      {
        zone: "A",
        aisle: "01", 
        shelf: "B",
        bin: "002",
        capacity: 100,
        currentOccupancy: 45,
      },
      {
        zone: "B",
        aisle: "02",
        shelf: "A", 
        bin: "001",
        capacity: 150,
        currentOccupancy: 120,
      },
    ]).onConflictDoNothing();

    // Seed financial transactions
    await db.insert(financialTransactions).values([
      {
        transactionType: "sale",
        amount: "1199.00",
        description: "iPhone 15 Pro Max sale",
        referenceId: 1,
        referenceType: "order",
        paymentMethod: "credit_card",
      },
      {
        transactionType: "purchase",
        amount: "999.00",
        description: "iPhone 15 Pro Max purchase from supplier",
        referenceId: 2,
        referenceType: "order", 
        paymentMethod: "bank_transfer",
      },
    ]).onConflictDoNothing();

    // Seed repairs
    await db.insert(repairs).values([
      {
        productId: 1,
        clientId: 1,
        issueDescription: "Screen replacement needed",
        repairStatus: "in_progress",
        estimatedCost: "299.00",
        warrantyRepair: false,
      },
      {
        productId: 2,
        clientId: 2,
        issueDescription: "Keyboard malfunction",
        repairStatus: "pending",
        estimatedCost: "150.00",
        warrantyRepair: true,
      },
    ]).onConflictDoNothing();

    // Seed sales projections
    await db.insert(salesProjections).values([
      {
        productId: 1,
        projectionPeriod: "monthly",
        projectedSales: 25,
        projectedRevenue: "29975.00",
        confidence: "85.5",
        baselineData: JSON.stringify({ historicalSales: [20, 22, 18, 25, 23] }),
      },
      {
        productId: 2,
        projectionPeriod: "monthly", 
        projectedSales: 15,
        projectedRevenue: "22485.00",
        confidence: "78.2",
        baselineData: JSON.stringify({ historicalSales: [12, 14, 16, 15, 13] }),
      },
    ]).onConflictDoNothing();

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed, exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}