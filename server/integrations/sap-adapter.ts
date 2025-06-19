import { BaseAdapter, SyncResult } from './base-adapter';
import { IntegrationConfig } from '@shared/config';

export class SAPAdapter extends BaseAdapter {
  private accessToken?: string;
  private tokenExpiry?: Date;

  constructor(config: IntegrationConfig) {
    super(config);
  }

  async authenticate(): Promise<boolean> {
    try {
      if (this.config.apiConfig.authType === 'oauth2') {
        return await this.authenticateOAuth2();
      } else if (this.config.apiConfig.authType === 'basic') {
        return await this.authenticateBasic();
      }
      
      throw new Error('Unsupported authentication type for SAP');
    } catch (error) {
      this.logError('Authentication', error as Error);
      return false;
    }
  }

  private async authenticateOAuth2(): Promise<boolean> {
    const { tokenEndpoint, clientId, clientSecret } = this.config.apiConfig;
    
    if (!tokenEndpoint || !clientId || !clientSecret) {
      throw new Error('OAuth2 configuration incomplete');
    }

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`OAuth2 authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
    
    return true;
  }

  private async authenticateBasic(): Promise<boolean> {
    // For basic auth, we just validate credentials exist
    return !!(this.config.apiConfig.username && this.config.apiConfig.password);
  }

  async testConnection(): Promise<boolean> {
    try {
      const authenticated = await this.authenticate();
      if (!authenticated) return false;

      // Test with a simple system info call
      await this.makeRequest('GET', '/sap/opu/odata/sap/API_MATERIAL_SRV/$metadata');
      return true;
    } catch (error) {
      this.logError('Connection Test', error as Error);
      return false;
    }
  }

  async syncProducts(direction: 'import' | 'export' | 'bidirectional'): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      recordsProcessed: 0,
      errors: [],
      lastSyncTime: new Date().toISOString(),
    };

    try {
      if (direction === 'import' || direction === 'bidirectional') {
        await this.importProducts(result);
      }
      
      if (direction === 'export' || direction === 'bidirectional') {
        await this.exportProducts(result);
      }

      result.success = result.errors.length === 0;
    } catch (error) {
      result.errors.push((error as Error).message);
      this.logError('Product Sync', error as Error);
    }

    return result;
  }

  private async importProducts(result: SyncResult): Promise<void> {
    const mapping = this.config.dataMapping.products;
    
    // SAP OData API call for materials
    const response = await this.makeRequest(
      'GET', 
      '/sap/opu/odata/sap/API_MATERIAL_SRV/A_Product',
      undefined,
      { 'Accept': 'application/json' }
    );

    const products = response.d?.results || [];
    
    for (const sapProduct of products) {
      try {
        const mappedProduct = this.mapFields(sapProduct, mapping);
        
        // Additional SAP-specific transformations
        if (sapProduct.Material) mappedProduct.sku = sapProduct.Material;
        if (sapProduct.ProductDescription) mappedProduct.name = sapProduct.ProductDescription;
        
        // Store in local database (implementation depends on your storage layer)
        // await this.storage.createOrUpdateProduct(mappedProduct);
        
        result.recordsProcessed++;
      } catch (error) {
        result.errors.push(`Failed to process product ${sapProduct.Material}: ${(error as Error).message}`);
      }
    }

    this.logInfo('Product Import', `Processed ${result.recordsProcessed} products`);
  }

  private async exportProducts(result: SyncResult): Promise<void> {
    // Implementation for exporting products to SAP
    this.logInfo('Product Export', 'Export to SAP not implemented yet');
  }

  async syncOrders(direction: 'import' | 'export' | 'bidirectional'): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      recordsProcessed: 0,
      errors: [],
      lastSyncTime: new Date().toISOString(),
    };

    try {
      if (direction === 'import' || direction === 'bidirectional') {
        await this.importOrders(result);
      }

      result.success = result.errors.length === 0;
    } catch (error) {
      result.errors.push((error as Error).message);
      this.logError('Order Sync', error as Error);
    }

    return result;
  }

  private async importOrders(result: SyncResult): Promise<void> {
    const mapping = this.config.dataMapping.orders;
    
    // SAP OData API call for sales orders
    const response = await this.makeRequest(
      'GET',
      '/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder',
      undefined,
      { 'Accept': 'application/json' }
    );

    const orders = response.d?.results || [];
    
    for (const sapOrder of orders) {
      try {
        const mappedOrder = this.mapFields(sapOrder, mapping);
        
        // SAP-specific transformations
        if (sapOrder.SalesOrder) mappedOrder.orderNumber = sapOrder.SalesOrder;
        if (sapOrder.SoldToParty) mappedOrder.clientId = sapOrder.SoldToParty;
        
        result.recordsProcessed++;
      } catch (error) {
        result.errors.push(`Failed to process order ${sapOrder.SalesOrder}: ${(error as Error).message}`);
      }
    }

    this.logInfo('Order Import', `Processed ${result.recordsProcessed} orders`);
  }

  async syncInventory(direction: 'import' | 'export' | 'bidirectional'): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      recordsProcessed: 0,
      errors: [],
      lastSyncTime: new Date().toISOString(),
    };

    try {
      if (direction === 'import' || direction === 'bidirectional') {
        await this.importInventory(result);
      }

      result.success = result.errors.length === 0;
    } catch (error) {
      result.errors.push((error as Error).message);
      this.logError('Inventory Sync', error as Error);
    }

    return result;
  }

  private async importInventory(result: SyncResult): Promise<void> {
    // SAP OData API call for stock levels
    const response = await this.makeRequest(
      'GET',
      '/sap/opu/odata/sap/API_MATERIAL_STOCK_SRV/A_MaterialStock',
      undefined,
      { 'Accept': 'application/json' }
    );

    const stockItems = response.d?.results || [];
    
    for (const stockItem of stockItems) {
      try {
        // Update local inventory levels
        result.recordsProcessed++;
      } catch (error) {
        result.errors.push(`Failed to process stock for ${stockItem.Material}: ${(error as Error).message}`);
      }
    }

    this.logInfo('Inventory Import', `Processed ${result.recordsProcessed} stock records`);
  }

  async syncClients(direction: 'import' | 'export' | 'bidirectional'): Promise<SyncResult> {
    return {
      success: true,
      recordsProcessed: 0,
      errors: [],
      lastSyncTime: new Date().toISOString(),
    };
  }

  async syncSuppliers(direction: 'import' | 'export' | 'bidirectional'): Promise<SyncResult> {
    return {
      success: true,
      recordsProcessed: 0,
      errors: [],
      lastSyncTime: new Date().toISOString(),
    };
  }

  async handleWebhook(event: string, payload: any): Promise<void> {
    this.logInfo('Webhook', `Received ${event} event from SAP`);
    
    switch (event) {
      case 'material.changed':
        await this.handleMaterialChange(payload);
        break;
      case 'order.created':
        await this.handleOrderCreated(payload);
        break;
      default:
        this.logInfo('Webhook', `Unhandled event type: ${event}`);
    }
  }

  private async handleMaterialChange(payload: any): Promise<void> {
    // Handle material/product changes from SAP
    this.logInfo('Material Change', `Material ${payload.Material} was updated in SAP`);
  }

  private async handleOrderCreated(payload: any): Promise<void> {
    // Handle new order creation from SAP
    this.logInfo('Order Created', `Order ${payload.SalesOrder} was created in SAP`);
  }

  protected async makeRequest(method: string, endpoint: string, data?: any, headers: Record<string, string> = {}): Promise<any> {
    // Check if token needs refresh for OAuth2
    if (this.config.apiConfig.authType === 'oauth2') {
      if (!this.accessToken || (this.tokenExpiry && new Date() >= this.tokenExpiry)) {
        await this.authenticate();
      }
      
      if (this.accessToken) {
        headers['Authorization'] = `Bearer ${this.accessToken}`;
      }
    }

    return super.makeRequest(method, endpoint, data, headers);
  }
}