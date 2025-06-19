import { IntegrationConfig, defaultConfig } from '@shared/config';
import { AdapterFactory } from './integrations/adapter-factory';
import { BaseAdapter, SyncResult } from './integrations/base-adapter';

export class IntegrationManager {
  private adapter: BaseAdapter;
  private config: IntegrationConfig;
  private syncInterval?: NodeJS.Timeout;

  constructor(config?: Partial<IntegrationConfig>) {
    this.config = { ...defaultConfig, ...config };
    this.adapter = AdapterFactory.createAdapter(this.config);
  }

  async initialize(): Promise<boolean> {
    try {
      // Validate configuration
      const errors = this.validateConfiguration();
      if (errors.length > 0) {
        console.error('Integration configuration errors:', errors);
        return false;
      }

      // Test connection
      const connected = await this.adapter.testConnection();
      if (!connected) {
        console.error('Failed to connect to external system');
        return false;
      }

      // Start auto-sync if enabled
      if (this.config.syncConfig.enabled && this.config.syncConfig.autoSync) {
        this.startAutoSync();
      }

      console.log(`Integration initialized successfully with ${this.config.systemName}`);
      return true;
    } catch (error) {
      console.error('Integration initialization failed:', error);
      return false;
    }
  }

  private validateConfiguration(): string[] {
    return AdapterFactory.validateConfiguration(this.config);
  }

  private startAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    const intervalMs = this.config.syncConfig.interval * 1000;
    
    this.syncInterval = setInterval(async () => {
      console.log('Starting automatic sync...');
      
      try {
        await this.performFullSync();
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    }, intervalMs);

    console.log(`Auto-sync started with ${this.config.syncConfig.interval}s interval`);
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
      console.log('Auto-sync stopped');
    }
  }

  async performFullSync(): Promise<{ [key: string]: SyncResult }> {
    const results: { [key: string]: SyncResult } = {};
    const direction = this.config.syncConfig.direction;

    try {
      // Sync products
      results.products = await this.adapter.syncProducts(direction);
      
      // Sync orders
      results.orders = await this.adapter.syncOrders(direction);
      
      // Sync inventory
      results.inventory = await this.adapter.syncInventory(direction);
      
      // Sync clients
      results.clients = await this.adapter.syncClients(direction);
      
      // Sync suppliers
      results.suppliers = await this.adapter.syncSuppliers(direction);

      // Update last sync timestamp
      this.config.syncConfig.lastSyncTimestamp = new Date().toISOString();

      console.log('Full sync completed:', results);
      return results;
    } catch (error) {
      console.error('Full sync failed:', error);
      throw error;
    }
  }

  async syncEntity(entityType: string, direction?: 'import' | 'export' | 'bidirectional'): Promise<SyncResult> {
    const syncDirection = direction || this.config.syncConfig.direction;

    switch (entityType) {
      case 'products':
        return await this.adapter.syncProducts(syncDirection);
      
      case 'orders':
        return await this.adapter.syncOrders(syncDirection);
      
      case 'inventory':
        return await this.adapter.syncInventory(syncDirection);
      
      case 'clients':
        return await this.adapter.syncClients(syncDirection);
      
      case 'suppliers':
        return await this.adapter.syncSuppliers(syncDirection);
      
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }

  async handleWebhook(event: string, payload: any): Promise<void> {
    try {
      await this.adapter.handleWebhook(event, payload);
    } catch (error) {
      console.error('Webhook handling failed:', error);
      throw error;
    }
  }

  getConfiguration(): IntegrationConfig {
    return { ...this.config };
  }

  async updateConfiguration(newConfig: Partial<IntegrationConfig>): Promise<boolean> {
    try {
      // Stop auto-sync during reconfiguration
      this.stopAutoSync();

      // Update configuration
      this.config = { ...this.config, ...newConfig };

      // Create new adapter with updated config
      this.adapter = AdapterFactory.createAdapter(this.config);

      // Validate and reinitialize
      const initialized = await this.initialize();
      
      if (initialized) {
        console.log('Configuration updated successfully');
        return true;
      } else {
        console.error('Failed to reinitialize with new configuration');
        return false;
      }
    } catch (error) {
      console.error('Configuration update failed:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      return await this.adapter.testConnection();
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  getSyncStatus(): {
    isEnabled: boolean;
    isAutoSyncRunning: boolean;
    lastSyncTime?: string;
    nextSyncTime?: string;
  } {
    const nextSyncTime = this.syncInterval && this.config.syncConfig.lastSyncTimestamp
      ? new Date(Date.parse(this.config.syncConfig.lastSyncTimestamp) + this.config.syncConfig.interval * 1000).toISOString()
      : undefined;

    return {
      isEnabled: this.config.syncConfig.enabled,
      isAutoSyncRunning: !!this.syncInterval,
      lastSyncTime: this.config.syncConfig.lastSyncTimestamp,
      nextSyncTime,
    };
  }

  getSystemInfo(): {
    systemType: string;
    systemName: string;
    version?: string;
    isConnected: boolean;
  } {
    return {
      systemType: this.config.systemType,
      systemName: this.config.systemName,
      version: this.config.version,
      isConnected: true, // You might want to cache connection status
    };
  }

  destroy(): void {
    this.stopAutoSync();
  }
}