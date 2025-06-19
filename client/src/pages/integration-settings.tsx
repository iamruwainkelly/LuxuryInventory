import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Plug, 
  TestTube, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap,
  Database,
  Shield
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface IntegrationConfig {
  systemType: string;
  systemName: string;
  version?: string;
  apiConfig: {
    baseUrl?: string;
    authType: string;
    apiKey?: string;
    username?: string;
    password?: string;
    timeout: number;
    retryAttempts: number;
  };
  syncConfig: {
    enabled: boolean;
    direction: string;
    interval: number;
    batchSize: number;
    autoSync: boolean;
    conflictResolution: string;
  };
  businessRules: {
    allowNegativeStock: boolean;
    requireApprovalForLowStock: boolean;
    autoCreatePurchaseOrders: boolean;
    enforceMinMaxLevels: boolean;
  };
  uiConfig: {
    companyName: string;
    theme: string;
    showAdvancedFeatures: boolean;
  };
}

export default function IntegrationSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [config, setConfig] = useState<IntegrationConfig>({
    systemType: "standalone",
    systemName: "LuxInventory",
    apiConfig: {
      authType: "none",
      timeout: 30000,
      retryAttempts: 3,
    },
    syncConfig: {
      enabled: false,
      direction: "bidirectional",
      interval: 300,
      batchSize: 100,
      autoSync: false,
      conflictResolution: "local_wins",
    },
    businessRules: {
      allowNegativeStock: false,
      requireApprovalForLowStock: true,
      autoCreatePurchaseOrders: false,
      enforceMinMaxLevels: true,
    },
    uiConfig: {
      companyName: "LuxInventory",
      theme: "luxury",
      showAdvancedFeatures: true,
    },
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');

  const { data: currentConfig, isLoading } = useQuery({
    queryKey: ["/api/integration/config"],
    onSuccess: (data) => {
      if (data) {
        setConfig(data);
      }
    },
  });

  const { data: syncStatus } = useQuery({
    queryKey: ["/api/integration/sync-status"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const updateConfigMutation = useMutation({
    mutationFn: (newConfig: IntegrationConfig) => apiRequest("/api/integration/config", {
      method: "PUT",
      body: JSON.stringify(newConfig),
    }),
    onSuccess: () => {
      toast({
        title: "Configuration Updated",
        description: "Integration settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/integration/config"] });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update integration settings.",
        variant: "destructive",
      });
    },
  });

  const testConnectionMutation = useMutation({
    mutationFn: () => apiRequest("/api/integration/test-connection", { method: "POST" }),
    onSuccess: (data) => {
      setConnectionStatus(data.connected ? 'connected' : 'disconnected');
      toast({
        title: data.connected ? "Connection Successful" : "Connection Failed",
        description: data.message || "",
        variant: data.connected ? "default" : "destructive",
      });
    },
  });

  const syncNowMutation = useMutation({
    mutationFn: (entityType?: string) => apiRequest("/api/integration/sync", {
      method: "POST",
      body: entityType ? JSON.stringify({ entityType }) : undefined,
    }),
    onSuccess: () => {
      toast({
        title: "Sync Started",
        description: "Data synchronization has been initiated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/integration/sync-status"] });
    },
  });

  const handleConfigChange = (path: string, value: any) => {
    const keys = path.split('.');
    const newConfig = { ...config };
    let current: any = newConfig;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setConfig(newConfig);
  };

  const handleSaveConfig = () => {
    updateConfigMutation.mutate(config);
  };

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    testConnectionMutation.mutate();
    setTimeout(() => setIsTestingConnection(false), 2000);
  };

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
      case 'disconnected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"><XCircle className="h-3 w-3 mr-1" />Disconnected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"><Clock className="h-3 w-3 mr-1" />Unknown</Badge>;
    }
  };

  const systemTypes = [
    { value: "standalone", label: "Standalone" },
    { value: "sap", label: "SAP ERP" },
    { value: "oracle", label: "Oracle ERP Cloud" },
    { value: "netsuite", label: "NetSuite" },
    { value: "dynamics", label: "Microsoft Dynamics 365" },
    { value: "odoo", label: "Odoo" },
    { value: "custom", label: "Custom API" },
  ];

  const authTypes = [
    { value: "none", label: "None" },
    { value: "bearer", label: "Bearer Token" },
    { value: "basic", label: "Basic Authentication" },
    { value: "apikey", label: "API Key" },
    { value: "oauth2", label: "OAuth 2.0" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">Integration Settings</h1>
            <p className="text-lg text-gray-300">Loading configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Integration Settings</h1>
          <p className="text-lg text-gray-300">Configure ERP/WMS system integration</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">System Type</CardTitle>
              <Database className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{config.systemName}</div>
              <p className="text-xs text-gray-400">{config.systemType}</p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Connection</CardTitle>
              <Plug className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {getConnectionBadge()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Sync Status</CardTitle>
              <RefreshCw className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-white">
                {syncStatus?.isEnabled ? (
                  syncStatus.isAutoSyncRunning ? "Auto-sync running" : "Manual sync only"
                ) : (
                  "Sync disabled"
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Last Sync</CardTitle>
              <Clock className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-white">
                {syncStatus?.lastSyncTime 
                  ? new Date(syncStatus.lastSyncTime).toLocaleString()
                  : "Never"
                }
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="connection" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-black/20 backdrop-blur-sm">
            <TabsTrigger value="connection" className="data-[state=active]:bg-white/10">Connection</TabsTrigger>
            <TabsTrigger value="sync" className="data-[state=active]:bg-white/10">Sync Settings</TabsTrigger>
            <TabsTrigger value="mapping" className="data-[state=active]:bg-white/10">Field Mapping</TabsTrigger>
            <TabsTrigger value="business" className="data-[state=active]:bg-white/10">Business Rules</TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-white/10">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-6">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plug className="h-5 w-5" />
                  System Connection
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configure connection to your ERP or WMS system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white">System Type</Label>
                    <Select 
                      value={config.systemType} 
                      onValueChange={(value) => handleConfigChange('systemType', value)}
                    >
                      <SelectTrigger className="bg-black/20 border-white/10 text-white">
                        <SelectValue placeholder="Select system type" />
                      </SelectTrigger>
                      <SelectContent>
                        {systemTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">System Name</Label>
                    <Input
                      value={config.systemName}
                      onChange={(e) => handleConfigChange('systemName', e.target.value)}
                      className="bg-black/20 border-white/10 text-white"
                      placeholder="Enter system name"
                    />
                  </div>
                </div>

                {config.systemType !== 'standalone' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-white">Base URL</Label>
                      <Input
                        value={config.apiConfig.baseUrl || ''}
                        onChange={(e) => handleConfigChange('apiConfig.baseUrl', e.target.value)}
                        className="bg-black/20 border-white/10 text-white"
                        placeholder="https://api.example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Authentication Type</Label>
                      <Select 
                        value={config.apiConfig.authType} 
                        onValueChange={(value) => handleConfigChange('apiConfig.authType', value)}
                      >
                        <SelectTrigger className="bg-black/20 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {authTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {(config.apiConfig.authType === 'bearer' || config.apiConfig.authType === 'apikey') && (
                      <div className="space-y-2">
                        <Label className="text-white">API Key</Label>
                        <Input
                          type="password"
                          value={config.apiConfig.apiKey || ''}
                          onChange={(e) => handleConfigChange('apiConfig.apiKey', e.target.value)}
                          className="bg-black/20 border-white/10 text-white"
                          placeholder="Enter API key"
                        />
                      </div>
                    )}

                    {config.apiConfig.authType === 'basic' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-white">Username</Label>
                          <Input
                            value={config.apiConfig.username || ''}
                            onChange={(e) => handleConfigChange('apiConfig.username', e.target.value)}
                            className="bg-black/20 border-white/10 text-white"
                            placeholder="Username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Password</Label>
                          <Input
                            type="password"
                            value={config.apiConfig.password || ''}
                            onChange={(e) => handleConfigChange('apiConfig.password', e.target.value)}
                            className="bg-black/20 border-white/10 text-white"
                            placeholder="Password"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button 
                        onClick={handleTestConnection}
                        disabled={isTestingConnection}
                        variant="outline"
                        className="border-white/10"
                      >
                        <TestTube className="h-4 w-4 mr-2" />
                        {isTestingConnection ? "Testing..." : "Test Connection"}
                      </Button>
                    </div>
                  </>
                )}

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveConfig}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                    disabled={updateConfigMutation.isPending}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync" className="space-y-6">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Synchronization Settings
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configure how data syncs between systems
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Enable Synchronization</Label>
                    <p className="text-sm text-gray-400">Allow data sync with external system</p>
                  </div>
                  <Switch
                    checked={config.syncConfig.enabled}
                    onCheckedChange={(checked) => handleConfigChange('syncConfig.enabled', checked)}
                  />
                </div>

                {config.syncConfig.enabled && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-white">Sync Direction</Label>
                        <Select 
                          value={config.syncConfig.direction} 
                          onValueChange={(value) => handleConfigChange('syncConfig.direction', value)}
                        >
                          <SelectTrigger className="bg-black/20 border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bidirectional">Bidirectional</SelectItem>
                            <SelectItem value="import_only">Import Only</SelectItem>
                            <SelectItem value="export_only">Export Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Sync Interval (seconds)</Label>
                        <Input
                          type="number"
                          value={config.syncConfig.interval}
                          onChange={(e) => handleConfigChange('syncConfig.interval', parseInt(e.target.value))}
                          className="bg-black/20 border-white/10 text-white"
                          min={60}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Auto Sync</Label>
                        <p className="text-sm text-gray-400">Automatically sync at specified intervals</p>
                      </div>
                      <Switch
                        checked={config.syncConfig.autoSync}
                        onCheckedChange={(checked) => handleConfigChange('syncConfig.autoSync', checked)}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        onClick={() => syncNowMutation.mutate()}
                        disabled={syncNowMutation.isPending}
                        className="bg-gradient-to-r from-green-600 to-blue-600"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Sync Now
                      </Button>
                    </div>
                  </>
                )}

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveConfig}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mapping" className="space-y-6">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Field Mapping</CardTitle>
                <CardDescription className="text-gray-300">
                  Map fields between your system and the external system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Field mapping configuration will be available based on the selected system type.
                  This allows you to match fields between systems for seamless data exchange.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Business Rules
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configure business logic and validation rules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Allow Negative Stock</Label>
                      <p className="text-sm text-gray-400">Permit stock levels to go below zero</p>
                    </div>
                    <Switch
                      checked={config.businessRules.allowNegativeStock}
                      onCheckedChange={(checked) => handleConfigChange('businessRules.allowNegativeStock', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Require Low Stock Approval</Label>
                      <p className="text-sm text-gray-400">Require approval for transactions when stock is low</p>
                    </div>
                    <Switch
                      checked={config.businessRules.requireApprovalForLowStock}
                      onCheckedChange={(checked) => handleConfigChange('businessRules.requireApprovalForLowStock', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Auto Create Purchase Orders</Label>
                      <p className="text-sm text-gray-400">Automatically create POs when stock hits reorder point</p>
                    </div>
                    <Switch
                      checked={config.businessRules.autoCreatePurchaseOrders}
                      onCheckedChange={(checked) => handleConfigChange('businessRules.autoCreatePurchaseOrders', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Enforce Min/Max Levels</Label>
                      <p className="text-sm text-gray-400">Enforce minimum and maximum stock level constraints</p>
                    </div>
                    <Switch
                      checked={config.businessRules.enforceMinMaxLevels}
                      onCheckedChange={(checked) => handleConfigChange('businessRules.enforceMinMaxLevels', checked)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveConfig}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    Save Rules
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Advanced Configuration</CardTitle>
                <CardDescription className="text-gray-300">
                  Advanced settings and customizations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white">Company Name</Label>
                    <Input
                      value={config.uiConfig.companyName}
                      onChange={(e) => handleConfigChange('uiConfig.companyName', e.target.value)}
                      className="bg-black/20 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Theme</Label>
                    <Select 
                      value={config.uiConfig.theme} 
                      onValueChange={(value) => handleConfigChange('uiConfig.theme', value)}
                    >
                      <SelectTrigger className="bg-black/20 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Show Advanced Features</Label>
                    <p className="text-sm text-gray-400">Display advanced features and options</p>
                  </div>
                  <Switch
                    checked={config.uiConfig.showAdvancedFeatures}
                    onCheckedChange={(checked) => handleConfigChange('uiConfig.showAdvancedFeatures', checked)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveConfig}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}