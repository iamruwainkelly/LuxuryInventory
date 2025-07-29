import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertClientSchema, 
  insertSupplierSchema,
  insertStockMovementSchema,
  insertOrderSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/stats/dashboard", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Clients
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid client data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(id, validatedData);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid client data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteClient(id);
      if (!success) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  // Suppliers
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const supplier = await storage.getSupplier(id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid supplier data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create supplier" });
    }
  });

  app.put("/api/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSupplierSchema.partial().parse(req.body);
      const supplier = await storage.updateSupplier(id, validatedData);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid supplier data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update supplier" });
    }
  });

  app.delete("/api/suppliers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSupplier(id);
      if (!success) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete supplier" });
    }
  });

  // Stock movements
  app.get("/api/stock/movements", async (req, res) => {
    try {
      const movements = await storage.getStockMovements();
      res.json(movements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock movements" });
    }
  });

  app.post("/api/stock/movements", async (req, res) => {
    try {
      const validatedData = insertStockMovementSchema.parse(req.body);
      const movement = await storage.createStockMovement(validatedData);
      
      // Update product stock
      if (movement.productId) {
        const product = await storage.getProduct(movement.productId);
        if (product) {
          const currentStock = product.currentStock || 0;
          const newStock = movement.movementType === 'in' 
            ? currentStock + movement.quantity
            : currentStock - movement.quantity;
          await storage.updateProductStock(movement.productId, Math.max(0, newStock));
        }
      }
      
      res.status(201).json(movement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid stock movement data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create stock movement" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertOrderSchema.partial().parse(req.body);
      const order = await storage.updateOrder(id, validatedData);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Reports and AI Analytics
  app.get("/api/reports/financial", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      const products = await storage.getProducts();
      
      // Calculate financial metrics
      const salesRevenue = orders.reduce((sum, order) => {
        const amount = typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : (order.totalAmount || 0);
        return sum + amount;
      }, 0);
      
      const purchaseCosts = products.reduce((sum, product) => {
        const costPrice = typeof product.costPrice === 'string' ? parseFloat(product.costPrice) : (product.costPrice || 0);
        // Estimate sold quantity based on stock levels and simple logic
        const estimatedSold = Math.max(0, 100 - (product.currentStock || 0)); // Assume starting stock was 100
        return sum + (estimatedSold * costPrice);
      }, 0);
      
      const grossProfit = salesRevenue - purchaseCosts;
      const profitMargin = salesRevenue > 0 ? (grossProfit / salesRevenue) * 100 : 0;
      
      res.json({
        salesRevenue,
        purchaseCosts,
        grossProfit,
        totalTransactions: orders.length,
        profitMargin
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate financial report" });
    }
  });

  app.get("/api/reports/ai-projections", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const orders = await storage.getOrders();
      const movements = await storage.getStockMovements();
      
      // Enhanced AI projections with more sophisticated calculations
      const projections = products.map((product, index) => {
        // Calculate historical sales data
        const productMovements = movements.filter(m => m.productId === product.id);
        const outMovements = productMovements.filter(m => m.movementType === 'out');
        const inMovements = productMovements.filter(m => m.movementType === 'in');
        
        // Calculate velocity (items sold per week)
        const totalSalesQuantity = outMovements.reduce((sum, m) => sum + m.quantity, 0);
        const totalInboundQuantity = inMovements.reduce((sum, m) => sum + m.quantity, 0);
        
        // Assume 3 months of historical data for velocity calculation
        const avgWeeklySales = totalSalesQuantity > 0 ? totalSalesQuantity / 12 : Math.max(1, index + 1); // 12 weeks
        
        // Apply seasonal and trend adjustments
        const seasonalFactor = 1 + (Math.sin((Date.now() / (1000 * 60 * 60 * 24 * 30)) * Math.PI) * 0.15); // Monthly seasonality
        const trendFactor = 1 + ((Math.random() - 0.5) * 0.1); // Random trend variation ±5%
        const marketGrowthFactor = 1.05; // Assume 5% market growth
        
        // Calculate 30-day projection
        const projectedSales = Math.round(avgWeeklySales * 4.3 * seasonalFactor * trendFactor * marketGrowthFactor); // 4.3 weeks per month
        
        // Calculate revenue projection
        const sellingPrice = typeof product.sellingPrice === 'string' ? 
          parseFloat(product.sellingPrice) : (product.sellingPrice || 100);
        const projectedRevenue = projectedSales * sellingPrice;
        
        // Enhanced confidence calculation
        const dataPoints = productMovements.length;
        
        // Estimate order frequency based on out movements (simplified approach)
        // In a real implementation, you'd query order_items table
        const orderFrequency = outMovements.length; // Approximate order frequency from stock movements
        
        // Base confidence on data availability and consistency
        let confidence = 65; // Base confidence
        confidence += Math.min(20, dataPoints * 2); // More data = higher confidence
        confidence += Math.min(10, orderFrequency); // Order frequency adds confidence
        
        // Reduce confidence for products with erratic sales patterns
        if (outMovements.length > 0) {
          const salesVariance = outMovements.reduce((variance, movement, idx, arr) => {
            const mean = totalSalesQuantity / arr.length;
            return variance + Math.pow(movement.quantity - mean, 2);
          }, 0) / outMovements.length;
          
          if (salesVariance > avgWeeklySales * 2) {
            confidence -= 10; // High variance reduces confidence
          }
        }
        
        confidence = Math.min(95, Math.max(60, Math.round(confidence)));
        
        // Smart reorder recommendation
        const currentStock = product.currentStock || 0;
        const minStockLevel = product.minStockLevel || 10;
        const leadTimeWeeks = 2; // Assume 2-week lead time
        const safetyStock = Math.round(avgWeeklySales * 1.5); // 1.5 weeks safety stock
        
        const projectedStockOut = currentStock - (avgWeeklySales * leadTimeWeeks);
        const reorderRecommendation = projectedStockOut < minStockLevel ? 
          Math.round(avgWeeklySales * 8 + safetyStock) : 0; // 8 weeks of stock
        
        // Add risk assessment
        const riskLevel = currentStock <= minStockLevel ? 'High' : 
                         currentStock <= minStockLevel * 2 ? 'Medium' : 'Low';
        
        return {
          productId: product.id,
          productName: product.name,
          projectionPeriod: "Next 30 days",
          projectedSales,
          projectedRevenue,
          confidence,
          reorderRecommendation,
          currentStock,
          avgWeeklySales: Math.round(avgWeeklySales * 10) / 10, // Round to 1 decimal
          riskLevel,
          stockOutRisk: projectedStockOut < 0 ? 'High' : projectedStockOut < minStockLevel ? 'Medium' : 'Low',
          trend: trendFactor > 1.02 ? 'up' : trendFactor < 0.98 ? 'down' : 'stable'
        };
      });
      
      // Sort by confidence and projected revenue for better insights
      const sortedProjections = projections.sort((a, b) => {
        // Prioritize high-confidence, high-revenue products
        const scoreA = (a.confidence / 100) * a.projectedRevenue;
        const scoreB = (b.confidence / 100) * b.projectedRevenue;
        return scoreB - scoreA;
      });
      
      res.json(sortedProjections);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate AI projections" });
    }
  });

  app.get("/api/reports/stock-summary", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const movements = await storage.getStockMovements();
      
      const stockSummary = products.map(product => {
        // Calculate turnover based on movement history
        const productMovements = movements.filter(m => m.productId === product.id);
        const outMovements = productMovements.filter(m => m.movementType === 'out');
        const totalOut = outMovements.reduce((sum, m) => sum + m.quantity, 0);
        
        const costPrice = typeof product.costPrice === 'string' ? 
          parseFloat(product.costPrice) : (product.costPrice || 0);
        const stockValue = (product.currentStock || 0) * costPrice;
        const stockTurnover = (product.currentStock || 0) > 0 ? totalOut / (product.currentStock || 1) : 0;
        
        return {
          id: product.id,
          sku: product.sku,
          name: product.name,
          currentStock: product.currentStock || 0,
          costPrice,
          stockValue,
          stockTurnover: Math.max(0, stockTurnover),
          reorderPoint: product.minStockLevel || 10
        };
      });
      
      res.json(stockSummary);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate stock summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
