import { IntegrationConfig } from '@shared/config';

export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  errors: string[];
  lastSyncTime: string;
}

export interface DataMapping {
  [key: string]: string;
}

export abstract class BaseAdapter {
  protected config: IntegrationConfig;

  constructor(config: IntegrationConfig) {
    this.config = config;
  }

  // Abstract methods that each adapter must implement
  abstract authenticate(): Promise<boolean>;
  abstract testConnection(): Promise<boolean>;
  
  // Data operations
  abstract syncProducts(direction: 'import' | 'export' | 'bidirectional'): Promise<SyncResult>;
  abstract syncOrders(direction: 'import' | 'export' | 'bidirectional'): Promise<SyncResult>;
  abstract syncInventory(direction: 'import' | 'export' | 'bidirectional'): Promise<SyncResult>;
  abstract syncClients(direction: 'import' | 'export' | 'bidirectional'): Promise<SyncResult>;
  abstract syncSuppliers(direction: 'import' | 'export' | 'bidirectional'): Promise<SyncResult>;

  // Webhook handling
  abstract handleWebhook(event: string, payload: any): Promise<void>;

  // Data transformation utilities
  protected mapFields(data: any, mapping: DataMapping): any {
    const mapped: any = {};
    
    for (const [localField, remoteField] of Object.entries(mapping)) {
      if (data[remoteField] !== undefined) {
        mapped[localField] = data[remoteField];
      }
    }
    
    return mapped;
  }

  protected reverseMapFields(data: any, mapping: DataMapping): any {
    const reversed: any = {};
    
    for (const [localField, remoteField] of Object.entries(mapping)) {
      if (data[localField] !== undefined) {
        reversed[remoteField] = data[localField];
      }
    }
    
    return reversed;
  }

  // HTTP request helper with authentication
  protected async makeRequest(
    method: string,
    endpoint: string,
    data?: any,
    headers: Record<string, string> = {}
  ): Promise<any> {
    const { apiConfig } = this.config;
    
    if (!apiConfig.baseUrl) {
      throw new Error('Base URL not configured');
    }

    const url = `${apiConfig.baseUrl}${endpoint}`;
    
    // Add authentication headers
    if (apiConfig.authType === 'bearer' && apiConfig.apiKey) {
      headers['Authorization'] = `Bearer ${apiConfig.apiKey}`;
    } else if (apiConfig.authType === 'apikey' && apiConfig.apiKey) {
      headers['X-API-Key'] = apiConfig.apiKey;
    } else if (apiConfig.authType === 'basic' && apiConfig.username && apiConfig.password) {
      const credentials = btoa(`${apiConfig.username}:${apiConfig.password}`);
      headers['Authorization'] = `Basic ${credentials}`;
    }

    headers['Content-Type'] = 'application/json';

    const requestOptions: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(apiConfig.timeout || 30000),
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestOptions.body = JSON.stringify(data);
    }

    let lastError: Error | null = null;
    const maxRetries = apiConfig.retryAttempts || 3;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        } else {
          return await response.text();
        }
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Request failed after all retries');
  }

  // Batch processing utility
  protected async processBatch<T>(
    items: T[],
    processor: (batch: T[]) => Promise<void>,
    batchSize: number = 100
  ): Promise<void> {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await processor(batch);
    }
  }

  // Error handling and logging
  protected logError(operation: string, error: Error): void {
    console.error(`[${this.config.systemName}] ${operation} failed:`, error.message);
  }

  protected logInfo(operation: string, message: string): void {
    console.info(`[${this.config.systemName}] ${operation}: ${message}`);
  }

  // Validation utilities
  protected validateConfig(): string[] {
    const errors: string[] = [];
    
    if (this.config.syncConfig.enabled && !this.config.apiConfig.baseUrl) {
      errors.push('Base URL is required when sync is enabled');
    }
    
    if (this.config.apiConfig.authType === 'bearer' && !this.config.apiConfig.apiKey) {
      errors.push('API key is required for bearer authentication');
    }
    
    if (this.config.apiConfig.authType === 'basic') {
      if (!this.config.apiConfig.username || !this.config.apiConfig.password) {
        errors.push('Username and password are required for basic authentication');
      }
    }
    
    return errors;
  }
}