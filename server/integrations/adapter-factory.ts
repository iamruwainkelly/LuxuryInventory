import { IntegrationConfig } from '@shared/config';
import { BaseAdapter } from './base-adapter';
import { SAPAdapter } from './sap-adapter';
import { OracleAdapter } from './oracle-adapter';
import { NetSuiteAdapter } from './netsuite-adapter';
import { DynamicsAdapter } from './dynamics-adapter';
import { CustomAdapter } from './custom-adapter';
import { StandaloneAdapter } from './standalone-adapter';

export class AdapterFactory {
  static createAdapter(config: IntegrationConfig): BaseAdapter {
    switch (config.systemType) {
      case 'sap':
        return new SAPAdapter(config);
      
      case 'oracle':
        return new OracleAdapter(config);
      
      case 'netsuite':
        return new NetSuiteAdapter(config);
      
      case 'dynamics':
        return new DynamicsAdapter(config);
      
      case 'custom':
        return new CustomAdapter(config);
      
      case 'standalone':
      default:
        return new StandaloneAdapter(config);
    }
  }

  static getSupportedSystems(): string[] {
    return ['sap', 'oracle', 'netsuite', 'dynamics', 'custom', 'standalone'];
  }

  static validateConfiguration(config: IntegrationConfig): string[] {
    const errors: string[] = [];
    
    if (!this.getSupportedSystems().includes(config.systemType)) {
      errors.push(`Unsupported system type: ${config.systemType}`);
    }

    // System-specific validation
    switch (config.systemType) {
      case 'sap':
        if (config.apiConfig.authType === 'oauth2') {
          if (!config.apiConfig.clientId || !config.apiConfig.clientSecret || !config.apiConfig.tokenEndpoint) {
            errors.push('SAP OAuth2 requires clientId, clientSecret, and tokenEndpoint');
          }
        }
        break;
        
      case 'oracle':
        if (!config.apiConfig.baseUrl) {
          errors.push('Oracle integration requires baseUrl');
        }
        break;
        
      case 'netsuite':
        if (config.apiConfig.authType === 'oauth2') {
          if (!config.apiConfig.clientId || !config.apiConfig.clientSecret) {
            errors.push('NetSuite OAuth requires clientId and clientSecret');
          }
        }
        break;
    }

    return errors;
  }
}