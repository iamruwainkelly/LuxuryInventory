import { z } from "zod";

// System Integration Configuration Schema
export const integrationConfigSchema = z.object({
  // System Information
  systemType: z.enum(["sap", "oracle", "netsuite", "dynamics", "odoo", "custom", "standalone"]),
  systemName: z.string(),
  version: z.string().optional(),
  
  // API Configuration
  apiConfig: z.object({
    baseUrl: z.string().url().optional(),
    authType: z.enum(["bearer", "basic", "apikey", "oauth2", "none"]),
    apiKey: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    tokenEndpoint: z.string().url().optional(),
    clientId: z.string().optional(),
    clientSecret: z.string().optional(),
    timeout: z.number().default(30000),
    retryAttempts: z.number().default(3),
  }),

  // Data Mapping Configuration
  dataMapping: z.object({
    // Product field mappings
    products: z.object({
      id: z.string().default("id"),
      sku: z.string().default("sku"),
      name: z.string().default("name"),
      description: z.string().default("description"),
      category: z.string().default("categoryId"),
      supplier: z.string().default("supplierId"),
      costPrice: z.string().default("costPrice"),
      sellingPrice: z.string().default("sellingPrice"),
      currentStock: z.string().default("currentStock"),
      minStockLevel: z.string().default("minStockLevel"),
      maxStockLevel: z.string().default("maxStockLevel"),
      binLocation: z.string().default("binLocation"),
      shelfLocation: z.string().default("shelfLocation"),
      warehouseZone: z.string().default("warehouseZone"),
      barcode: z.string().default("barcode"),
      serialNumber: z.string().default("serialNumber"),
      isActive: z.string().default("isActive"),
    }),

    // Order field mappings
    orders: z.object({
      id: z.string().default("id"),
      orderNumber: z.string().default("orderNumber"),
      clientId: z.string().default("clientId"),
      supplierId: z.string().default("supplierId"),
      orderType: z.string().default("orderType"),
      status: z.string().default("status"),
      totalAmount: z.string().default("totalAmount"),
      orderDate: z.string().default("orderDate"),
      notes: z.string().default("notes"),
    }),

    // Inventory movement mappings
    movements: z.object({
      id: z.string().default("id"),
      productId: z.string().default("productId"),
      movementType: z.string().default("movementType"),
      quantity: z.string().default("quantity"),
      unitCost: z.string().default("unitCost"),
      totalValue: z.string().default("totalValue"),
      reason: z.string().default("reason"),
      referenceNumber: z.string().default("referenceNumber"),
      fromLocation: z.string().default("fromLocation"),
      toLocation: z.string().default("toLocation"),
      createdAt: z.string().default("createdAt"),
    }),

    // Client/Customer mappings
    clients: z.object({
      id: z.string().default("id"),
      name: z.string().default("name"),
      email: z.string().default("email"),
      phone: z.string().default("phone"),
      address: z.string().default("address"),
      notes: z.string().default("notes"),
    }),

    // Supplier mappings
    suppliers: z.object({
      id: z.string().default("id"),
      name: z.string().default("name"),
      contactEmail: z.string().default("contactEmail"),
      contactPhone: z.string().default("contactPhone"),
      address: z.string().default("address"),
      notes: z.string().default("notes"),
    }),
  }),

  // Sync Configuration
  syncConfig: z.object({
    enabled: z.boolean().default(true),
    direction: z.enum(["bidirectional", "import_only", "export_only"]),
    interval: z.number().default(300), // seconds
    batchSize: z.number().default(100),
    autoSync: z.boolean().default(false),
    conflictResolution: z.enum(["local_wins", "remote_wins", "manual"]),
    lastSyncTimestamp: z.string().optional(),
  }),

  // Webhook Configuration
  webhooks: z.object({
    enabled: z.boolean().default(false),
    endpoints: z.array(z.object({
      event: z.string(),
      url: z.string().url(),
      secret: z.string().optional(),
      retries: z.number().default(3),
    })).default([]),
  }),

  // Business Rules
  businessRules: z.object({
    allowNegativeStock: z.boolean().default(false),
    requireApprovalForLowStock: z.boolean().default(true),
    autoCreatePurchaseOrders: z.boolean().default(false),
    enforceMinMaxLevels: z.boolean().default(true),
    enableSerialTracking: z.boolean().default(false),
    enableBatchTracking: z.boolean().default(false),
    enableExpiryTracking: z.boolean().default(false),
  }),

  // UI Customization
  uiConfig: z.object({
    companyName: z.string().default("LuxInventory"),
    companyLogo: z.string().optional(),
    primaryColor: z.string().default("#6366f1"),
    secondaryColor: z.string().default("#8b5cf6"),
    theme: z.enum(["luxury", "minimal", "corporate", "custom"]).default("luxury"),
    showAdvancedFeatures: z.boolean().default(true),
    hiddenModules: z.array(z.string()).default([]),
    customDashboardMetrics: z.array(z.string()).default([]),
  }),
});

export type IntegrationConfig = z.infer<typeof integrationConfigSchema>;

// Default configuration for standalone mode
export const defaultConfig: IntegrationConfig = {
  systemType: "standalone",
  systemName: "LuxInventory Standalone",
  version: "1.0.0",
  
  apiConfig: {
    authType: "none",
    timeout: 30000,
    retryAttempts: 3,
  },

  dataMapping: {
    products: {
      id: "id",
      sku: "sku",
      name: "name",
      description: "description",
      category: "categoryId",
      supplier: "supplierId",
      costPrice: "costPrice",
      sellingPrice: "sellingPrice",
      currentStock: "currentStock",
      minStockLevel: "minStockLevel",
      maxStockLevel: "maxStockLevel",
      binLocation: "binLocation",
      shelfLocation: "shelfLocation",
      warehouseZone: "warehouseZone",
      barcode: "barcode",
      serialNumber: "serialNumber",
      isActive: "isActive",
    },
    orders: {
      id: "id",
      orderNumber: "orderNumber",
      clientId: "clientId",
      supplierId: "supplierId",
      orderType: "orderType",
      status: "status",
      totalAmount: "totalAmount",
      orderDate: "orderDate",
      notes: "notes",
    },
    movements: {
      id: "id",
      productId: "productId",
      movementType: "movementType",
      quantity: "quantity",
      unitCost: "unitCost",
      totalValue: "totalValue",
      reason: "reason",
      referenceNumber: "referenceNumber",
      fromLocation: "fromLocation",
      toLocation: "toLocation",
      createdAt: "createdAt",
    },
    clients: {
      id: "id",
      name: "name",
      email: "email",
      phone: "phone",
      address: "address",
      notes: "notes",
    },
    suppliers: {
      id: "id",
      name: "name",
      contactEmail: "contactEmail",
      contactPhone: "contactPhone",
      address: "address",
      notes: "notes",
    },
  },

  syncConfig: {
    enabled: false,
    direction: "bidirectional",
    interval: 300,
    batchSize: 100,
    autoSync: false,
    conflictResolution: "local_wins",
  },

  webhooks: {
    enabled: false,
    endpoints: [],
  },

  businessRules: {
    allowNegativeStock: false,
    requireApprovalForLowStock: true,
    autoCreatePurchaseOrders: false,
    enforceMinMaxLevels: true,
    enableSerialTracking: false,
    enableBatchTracking: false,
    enableExpiryTracking: false,
  },

  uiConfig: {
    companyName: "LuxInventory",
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
    theme: "luxury",
    showAdvancedFeatures: true,
    hiddenModules: [],
    customDashboardMetrics: [],
  },
};

// Predefined configurations for popular ERP systems
export const erpConfigurations = {
  sap: {
    systemType: "sap" as const,
    systemName: "SAP ERP",
    dataMapping: {
      products: {
        id: "MATNR",
        sku: "MATNR", 
        name: "MAKTX",
        description: "MAKTG",
        currentStock: "LABST",
        costPrice: "STPRS",
        sellingPrice: "KBETR",
        binLocation: "LGPLA",
      },
      orders: {
        id: "VBELN",
        orderNumber: "VBELN",
        clientId: "KUNNR",
        status: "VBSTA",
        totalAmount: "NETWR",
        orderDate: "AUDAT",
      },
    },
  },
  
  oracle: {
    systemType: "oracle" as const,
    systemName: "Oracle ERP Cloud",
    dataMapping: {
      products: {
        id: "INVENTORY_ITEM_ID",
        sku: "SEGMENT1",
        name: "DESCRIPTION",
        currentStock: "ON_HAND_QTY",
        costPrice: "ITEM_COST",
        binLocation: "LOCATOR",
      },
    },
  },

  netsuite: {
    systemType: "netsuite" as const,
    systemName: "NetSuite ERP",
    dataMapping: {
      products: {
        id: "internalid",
        sku: "itemid",
        name: "displayname",
        currentStock: "quantityavailable",
        costPrice: "cost",
        sellingPrice: "baseprice",
      },
    },
  },

  dynamics: {
    systemType: "dynamics" as const,
    systemName: "Microsoft Dynamics 365",
    dataMapping: {
      products: {
        id: "ProductNumber",
        sku: "ProductNumber",
        name: "Name",
        currentStock: "QtyOnHand",
        costPrice: "StandardCost",
        sellingPrice: "ListPrice",
      },
    },
  },
};