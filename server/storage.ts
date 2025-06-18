import {
  users, suppliers, clients, products, categories, stockMovements, orders, orderItems,
  type User, type InsertUser,
  type Supplier, type InsertSupplier,
  type Client, type InsertClient,
  type Product, type InsertProduct,
  type Category, type InsertCategory,
  type StockMovement, type InsertStockMovement,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem
} from "@shared/schema";

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

    this.currentId = 5;
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
    const lowStockProducts = products.filter(p => p.currentStock <= p.minStockLevel);
    
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

export const storage = new MemStorage();
