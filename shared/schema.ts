import { pgTable, text, varchar, serial, integer, decimal, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => categories.id),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  sellingPrice: decimal("selling_price", { precision: 10, scale: 2 }),
  currentStock: integer("current_stock").default(0),
  minStockLevel: integer("min_stock_level").default(0),
  barcode: text("barcode"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  movementType: text("movement_type").notNull(), // 'in' | 'out'
  quantity: integer("quantity").notNull(),
  reason: text("reason"),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  clientId: integer("client_id").references(() => clients.id),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  orderType: text("order_type").notNull(), // 'sale' | 'purchase'
  status: text("status").default("pending"), // 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  orderDate: timestamp("order_date").defaultNow(),
  notes: text("notes"),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertStockMovementSchema = createInsertSchema(stockMovements).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderDate: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type StockMovement = typeof stockMovements.$inferSelect;
export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

// Repairs and Returns
export const repairs = pgTable("repairs", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  clientId: integer("client_id").references(() => clients.id),
  issueDescription: text("issue_description").notNull(),
  repairStatus: varchar("repair_status", { length: 50 }).default("pending"), // pending, in_progress, completed, cancelled
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  technicianNotes: text("technician_notes"),
  warrantyRepair: boolean("warranty_repair").default(false),
  dateReceived: timestamp("date_received").defaultNow(),
  dateCompleted: timestamp("date_completed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const returns = pgTable("returns", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  condition: varchar("condition", { length: 50 }).notNull(), // new, used, damaged, defective
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  restockable: boolean("restockable").default(true),
  processedBy: integer("processed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Device Replacements
export const deviceReplacements = pgTable("device_replacements", {
  id: serial("id").primaryKey(),
  originalProductId: integer("original_product_id").references(() => products.id).notNull(),
  replacementProductId: integer("replacement_product_id").references(() => products.id).notNull(),
  clientId: integer("client_id").references(() => clients.id),
  reason: varchar("reason", { length: 255 }).notNull(),
  replacementType: varchar("replacement_type", { length: 50 }).notNull(), // warranty, upgrade, defective
  costDifference: decimal("cost_difference", { precision: 10, scale: 2 }),
  notes: text("notes"),
  processedBy: integer("processed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Financial Transactions
export const financialTransactions = pgTable("financial_transactions", {
  id: serial("id").primaryKey(),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(), // sale, purchase, return, repair, expense
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: varchar("description", { length: 255 }),
  referenceId: integer("reference_id"), // links to order, repair, etc.
  referenceType: varchar("reference_type", { length: 50 }), // order, repair, return, etc.
  paymentMethod: varchar("payment_method", { length: 50 }),
  transactionDate: timestamp("transaction_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Projections
export const salesProjections = pgTable("sales_projections", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  projectionPeriod: varchar("projection_period", { length: 20 }).notNull(), // weekly, monthly, quarterly
  projectedSales: integer("projected_sales").notNull(),
  projectedRevenue: decimal("projected_revenue", { precision: 10, scale: 2 }),
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // confidence percentage
  baselineData: json("baseline_data"), // historical data used for projection
  createdAt: timestamp("created_at").defaultNow(),
  validUntil: timestamp("valid_until"),
});

// Warehouse Locations
export const warehouseLocations = pgTable("warehouse_locations", {
  id: serial("id").primaryKey(),
  zone: varchar("zone", { length: 50 }).notNull(),
  aisle: varchar("aisle", { length: 20 }).notNull(),
  shelf: varchar("shelf", { length: 20 }).notNull(),
  bin: varchar("bin", { length: 20 }).notNull(),
  capacity: integer("capacity").default(100),
  currentOccupancy: integer("current_occupancy").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertRepairSchema = createInsertSchema(repairs).omit({
  id: true,
  createdAt: true,
});

export const insertReturnSchema = createInsertSchema(returns).omit({
  id: true,
  createdAt: true,
});

export const insertDeviceReplacementSchema = createInsertSchema(deviceReplacements).omit({
  id: true,
  createdAt: true,
});

export const insertFinancialTransactionSchema = createInsertSchema(financialTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertSalesProjectionSchema = createInsertSchema(salesProjections).omit({
  id: true,
  createdAt: true,
});

export const insertWarehouseLocationSchema = createInsertSchema(warehouseLocations).omit({
  id: true,
  createdAt: true,
});

// Types
export type Repair = typeof repairs.$inferSelect;
export type InsertRepair = z.infer<typeof insertRepairSchema>;

export type Return = typeof returns.$inferSelect;
export type InsertReturn = z.infer<typeof insertReturnSchema>;

export type DeviceReplacement = typeof deviceReplacements.$inferSelect;
export type InsertDeviceReplacement = z.infer<typeof insertDeviceReplacementSchema>;

export type FinancialTransaction = typeof financialTransactions.$inferSelect;
export type InsertFinancialTransaction = z.infer<typeof insertFinancialTransactionSchema>;

export type SalesProjection = typeof salesProjections.$inferSelect;
export type InsertSalesProjection = z.infer<typeof insertSalesProjectionSchema>;

export type WarehouseLocation = typeof warehouseLocations.$inferSelect;
export type InsertWarehouseLocation = z.infer<typeof insertWarehouseLocationSchema>;
