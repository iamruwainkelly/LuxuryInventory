import {
  users, suppliers, clients, products, categories, stockMovements, orders, orderItems,
  repairs, returns, deviceReplacements, financialTransactions, salesProjections, warehouseLocations,
  type User, type InsertUser,
  type Supplier, type InsertSupplier,
  type Client, type InsertClient,
  type Product, type InsertProduct,
  type Category, type InsertCategory,
  type StockMovement, type InsertStockMovement,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type Repair, type InsertRepair,
  type Return, type InsertReturn,
  type DeviceReplacement, type InsertDeviceReplacement,
  type FinancialTransaction, type InsertFinancialTransaction,
  type SalesProjection, type InsertSalesProjection,
  type WarehouseLocation, type InsertWarehouseLocation
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: number): Promise<boolean>;

  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  updateProductStock(id: number, quantity: number): Promise<Product | undefined>;

  // Stock Movements
  getStockMovements(): Promise<StockMovement[]>;
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Order Items
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Dashboard Stats
  getDashboardStats(): Promise<{
    totalProducts: number;
    totalClients: number;
    lowStockAlerts: number;
    monthlyRevenue: number;
  }>;

  // Repairs
  getRepairs(): Promise<Repair[]>;
  getRepair(id: number): Promise<Repair | undefined>;
  createRepair(repair: InsertRepair): Promise<Repair>;
  updateRepair(id: number, repair: Partial<InsertRepair>): Promise<Repair | undefined>;

  // Returns
  getReturns(): Promise<Return[]>;
  getReturn(id: number): Promise<Return | undefined>;
  createReturn(returnItem: InsertReturn): Promise<Return>;

  // Device Replacements
  getDeviceReplacements(): Promise<DeviceReplacement[]>;
  createDeviceReplacement(replacement: InsertDeviceReplacement): Promise<DeviceReplacement>;

  // Financial Transactions
  getFinancialTransactions(): Promise<FinancialTransaction[]>;
  createFinancialTransaction(transaction: InsertFinancialTransaction): Promise<FinancialTransaction>;

  // Sales Projections
  getSalesProjections(): Promise<SalesProjection[]>;
  createSalesProjection(projection: InsertSalesProjection): Promise<SalesProjection>;

  // Warehouse Locations
  getWarehouseLocations(): Promise<WarehouseLocation[]>;
  createWarehouseLocation(location: InsertWarehouseLocation): Promise<WarehouseLocation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private suppliers: Map<number, Supplier>;
  private clients: Map<number, Client>;
  private products: Map<number, Product>;
  private stockMovements: Map<number, StockMovement>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.suppliers = new Map();
    this.clients = new Map();
    this.products = new Map();
    this.stockMovements = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const electronicsCategory: Category = { id: 1, name: "Electronics", description: "Electronic devices and accessories" };
    const furnitureCategory: Category = { id: 2, name: "Furniture", description: "Home and office furniture" };
    const audioCategory: Category = { id: 3, name: "Audio", description: "Audio equipment and accessories" };
    
    this.categories.set(1, electronicsCategory);
    this.categories.set(2, furnitureCategory);
    this.categories.set(3, audioCategory);

    // Seed suppliers
    const supplier1: Supplier = {
      id: 1,
      name: "TechCorp Solutions",
      contactEmail: "contact@techcorp.com",
      contactPhone: "+1-555-0101",
      address: "123 Tech Street, Silicon Valley, CA",
      notes: "Premium electronics supplier",
      createdAt: new Date(),
    };
    
    const supplier2: Supplier = {
      id: 2,
      name: "Global Electronics",
      contactEmail: "sales@globalelectronics.com",
      contactPhone: "+1-555-0102",
      address: "456 Electronic Ave, Austin, TX",
      notes: "Wholesale electronics distributor",
      createdAt: new Date(),
    };

    this.suppliers.set(1, supplier1);
    this.suppliers.set(2, supplier2);

    // Seed clients
    const client1: Client = {
      id: 1,
      name: "Premium Retail Co.",
      email: "orders@premiumretail.com",
      phone: "+1-555-0201",
      address: "789 Retail Blvd, New York, NY",
      notes: "High-volume retail customer",
      createdAt: new Date(),
    };

    const client2: Client = {
      id: 2,
      name: "Tech Solutions Ltd.",
      email: "procurement@techsolutions.com",
      phone: "+1-555-0202",
      address: "321 Business Park, Seattle, WA",
      notes: "B2B technology reseller",
      createdAt: new Date(),
    };

    this.clients.set(1, client1);
    this.clients.set(2, client2);

    // Seed products
    const products: Product[] = [
      {
        id: 1,
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
        createdAt: new Date(),
      },
      {
        id: 2,
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
        createdAt: new Date(),
      },
      {
        id: 3,
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
        createdAt: new Date(),
      },
      {
        id: 4,
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
        createdAt: new Date(),
      },
    ];

    products.forEach(product => {
      this.products.set(product.id, product);
    });

    // Seed orders
    const order1: Order = {
      id: 1,
      orderNumber: "ORD-001",
      clientId: 1,
      supplierId: null,
      orderType: "sale",
      status: "confirmed",
      totalAmount: "2398.00",
      orderDate: new Date(Date.now() - 86400000 * 5), // 5 days ago
      notes: "Bulk order for corporate client",
    };

    const order2: Order = {
      id: 2,
      orderNumber: "PO-001",
      clientId: null,
      supplierId: 1,
      orderType: "purchase",
      status: "pending",
      totalAmount: "15000.00",
      orderDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
      notes: "Quarterly inventory restock",
    };

    this.orders.set(1, order1);
    this.orders.set(2, order2);

    // Seed stock movements
    const movements = [
      {
        id: 1,
        productId: 1,
        movementType: "in" as const,
        quantity: 50,
        reason: "Initial stock",
        userId: 1,
        createdAt: new Date(Date.now() - 86400000 * 10),
      },
      {
        id: 2,
        productId: 2,
        movementType: "in" as const,
        quantity: 25,
        reason: "Supplier delivery",
        userId: 1,
        createdAt: new Date(Date.now() - 86400000 * 8),
      },
      {
        id: 3,
        productId: 1,
        movementType: "out" as const,
        quantity: 3,
        reason: "Sale to customer",
        userId: 1,
        createdAt: new Date(Date.now() - 86400000 * 3),
      },
      {
        id: 4,
        productId: 3,
        movementType: "out" as const,
        quantity: 5,
        reason: "Quality control issue",
        userId: 1,
        createdAt: new Date(Date.now() - 86400000 * 1),
      },
    ];

    movements.forEach(movement => {
      this.stockMovements.set(movement.id, movement as StockMovement);
    });

    this.currentId = 10;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const id = this.currentId++;
    const newSupplier: Supplier = { ...supplier, id, createdAt: new Date() };
    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }

  async updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const existing = this.suppliers.get(id);
    if (!existing) return undefined;

    const updated: Supplier = { ...existing, ...supplier };
    this.suppliers.set(id, updated);
    return updated;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(client: InsertClient): Promise<Client> {
    const id = this.currentId++;
    const newClient: Client = { ...client, id, createdAt: new Date() };
    this.clients.set(id, newClient);
    return newClient;
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined> {
    const existing = this.clients.get(id);
    if (!existing) return undefined;

    const updated: Client = { ...existing, ...client };
    this.clients.set(id, updated);
    return updated;
  }

  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const newProduct: Product = { ...product, id, createdAt: new Date() };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated: Product = { ...existing, ...product };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async updateProductStock(id: number, quantity: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updated: Product = { ...product, currentStock: quantity };
    this.products.set(id, updated);
    return updated;
  }

  async getStockMovements(): Promise<StockMovement[]> {
    return Array.from(this.stockMovements.values());
  }

  async createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    const id = this.currentId++;
    const newMovement: StockMovement = { ...movement, id, createdAt: new Date() };
    this.stockMovements.set(id, newMovement);
    return newMovement;
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentId++;
    const newOrder: Order = { ...order, id, orderDate: new Date() };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined> {
    const existing = this.orders.get(id);
    if (!existing) return undefined;

    const updated: Order = { ...existing, ...orderData };
    this.orders.set(id, updated);
    return updated;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updated: Order = { ...order, status };
    this.orders.set(id, updated);
    return updated;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentId++;
    const newItem: OrderItem = { ...item, id };
    this.orderItems.set(id, newItem);
    return newItem;
  }

  async getDashboardStats(): Promise<{
    totalProducts: number;
    totalClients: number;
    lowStockAlerts: number;
    monthlyRevenue: number;
  }> {
    const products = Array.from(this.products.values());
    const lowStockProducts = products.filter(p => (p.currentStock || 0) <= (p.minStockLevel || 0));
    
    // Calculate monthly revenue from orders
    const orders = Array.from(this.orders.values());
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate!);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });
    
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => {
      return sum + parseFloat(order.totalAmount || "0");
    }, 0);

    return {
      totalProducts: products.length,
      totalClients: this.clients.size,
      lowStockAlerts: lowStockProducts.length,
      monthlyRevenue: Math.round(monthlyRevenue),
    };
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers);
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return supplier || undefined;
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const [newSupplier] = await db
      .insert(suppliers)
      .values(supplier)
      .returning();
    return newSupplier;
  }

  async updateSupplier(id: number, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const [updated] = await db
      .update(suppliers)
      .set(supplier)
      .where(eq(suppliers.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    const result = await db.delete(suppliers).where(eq(suppliers.id, id));
    return result.rowCount > 0;
  }

  async getClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db
      .insert(clients)
      .values(client)
      .returning();
    return newClient;
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined> {
    const [updated] = await db
      .update(clients)
      .set(client)
      .where(eq(clients.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteClient(id: number): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id));
    return result.rowCount > 0;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  async updateProductStock(id: number, quantity: number): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set({ currentStock: quantity })
      .where(eq(products.id, id))
      .returning();
    return updated || undefined;
  }

  async getStockMovements(): Promise<StockMovement[]> {
    return await db.select().from(stockMovements);
  }

  async createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    const [newMovement] = await db
      .insert(stockMovements)
      .values(movement)
      .returning();
    return newMovement;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    return newOrder;
  }

  async updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined> {
    const [updated] = await db
      .update(orders)
      .set(order)
      .where(eq(orders.id, id))
      .returning();
    return updated || undefined;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updated] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updated || undefined;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db
      .insert(orderItems)
      .values(item)
      .returning();
    return newItem;
  }

  async getDashboardStats(): Promise<{
    totalProducts: number;
    totalClients: number;
    lowStockAlerts: number;
    monthlyRevenue: number;
  }> {
    const allProducts = await db.select().from(products);
    const allClients = await db.select().from(clients);
    const allOrders = await db.select().from(orders);
    
    const lowStockProducts = allProducts.filter(p => (p.currentStock || 0) <= (p.minStockLevel || 0));
    
    // Calculate monthly revenue from orders
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyOrders = allOrders.filter(order => {
      const orderDate = new Date(order.orderDate!);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });
    
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => {
      return sum + parseFloat(order.totalAmount || "0");
    }, 0);

    return {
      totalProducts: allProducts.length,
      totalClients: allClients.length,
      lowStockAlerts: lowStockProducts.length,
      monthlyRevenue: Math.round(monthlyRevenue),
    };
  }

  // Repairs
  async getRepairs(): Promise<Repair[]> {
    return await db.select().from(repairs);
  }

  async getRepair(id: number): Promise<Repair | undefined> {
    const [repair] = await db.select().from(repairs).where(eq(repairs.id, id));
    return repair || undefined;
  }

  async createRepair(repair: InsertRepair): Promise<Repair> {
    const [newRepair] = await db
      .insert(repairs)
      .values(repair)
      .returning();
    return newRepair;
  }

  async updateRepair(id: number, repair: Partial<InsertRepair>): Promise<Repair | undefined> {
    const [updated] = await db
      .update(repairs)
      .set(repair)
      .where(eq(repairs.id, id))
      .returning();
    return updated || undefined;
  }

  // Returns
  async getReturns(): Promise<Return[]> {
    return await db.select().from(returns);
  }

  async getReturn(id: number): Promise<Return | undefined> {
    const [returnItem] = await db.select().from(returns).where(eq(returns.id, id));
    return returnItem || undefined;
  }

  async createReturn(returnItem: InsertReturn): Promise<Return> {
    const [newReturn] = await db
      .insert(returns)
      .values(returnItem)
      .returning();
    return newReturn;
  }

  // Device Replacements
  async getDeviceReplacements(): Promise<DeviceReplacement[]> {
    return await db.select().from(deviceReplacements);
  }

  async createDeviceReplacement(replacement: InsertDeviceReplacement): Promise<DeviceReplacement> {
    const [newReplacement] = await db
      .insert(deviceReplacements)
      .values(replacement)
      .returning();
    return newReplacement;
  }

  // Financial Transactions
  async getFinancialTransactions(): Promise<FinancialTransaction[]> {
    return await db.select().from(financialTransactions);
  }

  async createFinancialTransaction(transaction: InsertFinancialTransaction): Promise<FinancialTransaction> {
    const [newTransaction] = await db
      .insert(financialTransactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  // Sales Projections
  async getSalesProjections(): Promise<SalesProjection[]> {
    return await db.select().from(salesProjections);
  }

  async createSalesProjection(projection: InsertSalesProjection): Promise<SalesProjection> {
    const [newProjection] = await db
      .insert(salesProjections)
      .values(projection)
      .returning();
    return newProjection;
  }

  // Warehouse Locations
  async getWarehouseLocations(): Promise<WarehouseLocation[]> {
    return await db.select().from(warehouseLocations);
  }

  async createWarehouseLocation(location: InsertWarehouseLocation): Promise<WarehouseLocation> {
    const [newLocation] = await db
      .insert(warehouseLocations)
      .values(location)
      .returning();
    return newLocation;
  }
}

export const storage = new DatabaseStorage();
