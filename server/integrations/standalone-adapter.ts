import { BaseAdapter, SyncResult } from './base-adapter';
import { IntegrationConfig } from '@shared/config';

export class StandaloneAdapter extends BaseAdapter {
  constructor(config: IntegrationConfig) {
    super(config);
  }

  async authenticate(): Promise<boolean> {
    // Standalone mode doesn't require authentication
    return true;
  }

  async testConnection(): Promise<boolean> {
    // Always connected in standalone mode
    return true;
  }

  async syncProducts(direction: 'import' | 'export' | 'bidirectional'): Promise<SyncResult> {
    // In standalone mode, no external sync is performed
    return {
      success: true,
      recordsProcessed: 0,
      errors: [],
      lastSyncTime: new Date().toISOString(),
    };
  }

  async syncOrders(direction: 'import' | 'export' | 'bidirectional'): Promise<SyncResult> {
    return {
      success: true,
      recordsProcessed: 0,
      errors: [],
      lastSyncTime: new Date().toISOString(),
    };
  }

  async syncInventory(direction: 'import' | 'export' | 'bidirectional'): Promise<SyncResult> {
    return {
      success: true,
      recordsProcessed: 0,
      errors: [],
      lastSyncTime: new Date().toISOString(),
    };
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
    // No webhook handling in standalone mode
    this.logInfo('Webhook', `Webhook received but ignored in standalone mode: ${event}`);
  }
}