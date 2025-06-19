import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  MapPin, 
  Search, 
  Plus, 
  Truck, 
  AlertTriangle, 
  BarChart3,
  Map,
  Grid3X3,
  Navigation
} from "lucide-react";

interface WarehouseLocation {
  id: string;
  zone: string;
  aisle: string;
  shelf: string;
  bin: string;
  capacity: number;
  occupied: number;
  products: Array<{
    name: string;
    quantity: number;
    sku: string;
  }>;
}

interface LocationMovement {
  id: string;
  type: 'transfer' | 'receive' | 'pick';
  product: string;
  quantity: number;
  from: string;
  to: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export default function Warehouse() {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  
  const { data: warehouseLocations = [], isLoading } = useQuery({
    queryKey: ["/api/warehouse/locations"],
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: stockMovements = [] } = useQuery({
    queryKey: ["/api/stock/movements"],
  });

  // Mock data for demonstration - in real app this would come from API
  const mockWarehouseLocations: WarehouseLocation[] = [
    {
      id: "1",
      zone: "A",
      aisle: "01",
      shelf: "A",
      bin: "001",
      capacity: 100,
      occupied: 85,
      products: [
        { name: "iPhone 15 Pro Max", quantity: 35, sku: "SKU-001" },
        { name: "MacBook Air M3", quantity: 25, sku: "SKU-002" },
        { name: "AirPods Pro", quantity: 25, sku: "SKU-004" },
      ]
    },
    {
      id: "2",
      zone: "A",
      aisle: "01",
      shelf: "B",
      bin: "002",
      capacity: 100,
      occupied: 45,
      products: [
        { name: "Samsung Galaxy S24", quantity: 45, sku: "SKU-003" },
      ]
    },
    {
      id: "3",
      zone: "B",
      aisle: "02",
      shelf: "A",
      bin: "001",
      capacity: 150,
      occupied: 120,
      products: [
        { name: "iPhone 15 Pro Max", quantity: 50, sku: "SKU-001" },
        { name: "MacBook Air M3", quantity: 40, sku: "SKU-002" },
        { name: "Accessories", quantity: 30, sku: "SKU-005" },
      ]
    }
  ];

  const recentMovements: LocationMovement[] = [
    {
      id: "1",
      type: "transfer",
      product: "iPhone 15 Pro Max",
      quantity: 10,
      from: "A-01-A-001",
      to: "B-02-A-001",
      timestamp: "2024-12-19 14:30",
      status: "completed"
    },
    {
      id: "2",
      type: "receive",
      product: "Samsung Galaxy S24",
      quantity: 25,
      from: "Receiving",
      to: "A-01-B-002",
      timestamp: "2024-12-19 13:15",
      status: "completed"
    },
    {
      id: "3",
      type: "pick",
      product: "AirPods Pro",
      quantity: 5,
      from: "A-01-A-001",
      to: "Shipping",
      timestamp: "2024-12-19 12:45",
      status: "pending"
    }
  ];

  const getOccupancyLevel = (occupied: number, capacity: number) => {
    const percentage = (occupied / capacity) * 100;
    if (percentage >= 90) return "critical";
    if (percentage >= 75) return "high";
    if (percentage >= 50) return "medium";
    return "low";
  };

  const getOccupancyColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-500";
      case "high": return "bg-yellow-500";
      case "medium": return "bg-blue-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Failed</Badge>;
      default:
        return null;
    }
  };

  const displayLocations = warehouseLocations.length > 0 ? warehouseLocations : mockWarehouseLocations;

  const filteredLocations = displayLocations.filter((location: any) => {
    const searchTerm = searchLocation.toLowerCase();
    const locationString = `${location.zone}-${location.aisle}-${location.shelf}-${location.bin}`.toLowerCase();
    const zoneMatch = selectedZone === "" || selectedZone === "all" || location.zone === selectedZone;
    const searchMatch = searchLocation === "" || 
      locationString.includes(searchTerm) ||
      (location.products && location.products.some((p: any) => p.name.toLowerCase().includes(searchTerm) || p.sku.toLowerCase().includes(searchTerm)));
    
    return zoneMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Warehouse Management</h1>
          <p className="text-lg text-gray-300">Track locations, movements, and optimize storage</p>
        </div>

        <Tabs defaultValue="locations" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-black/20 backdrop-blur-sm">
            <TabsTrigger value="locations" className="data-[state=active]:bg-white/10">Locations</TabsTrigger>
            <TabsTrigger value="movements" className="data-[state=active]:bg-white/10">Movements</TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-white/10">Warehouse Map</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="locations" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Location Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Search Location/Product</Label>
                    <Input
                      placeholder="Zone, SKU, or product name..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="bg-black/20 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Zone Filter</Label>
                    <Select value={selectedZone} onValueChange={setSelectedZone}>
                      <SelectTrigger className="bg-black/20 border-white/10 text-white">
                        <SelectValue placeholder="All Zones" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Zones</SelectItem>
                        <SelectItem value="A">Zone A</SelectItem>
                        <SelectItem value="B">Zone B</SelectItem>
                        <SelectItem value="C">Zone C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Location
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLocations.map((location: any) => {
                const occupied = location.currentOccupancy || location.occupied || 0;
                const capacity = location.capacity || 100;
                const occupancyPercentage = (occupied / capacity) * 100;
                const occupancyLevel = getOccupancyLevel(occupied, capacity);
                
                return (
                  <Card key={location.id} className="bg-black/30 backdrop-blur-sm border-white/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">
                          {location.zone}-{location.aisle}-{location.shelf}-{location.bin}
                        </CardTitle>
                        <Badge 
                          className={`${getOccupancyColor(occupancyLevel)} text-white`}
                          variant="secondary"
                        >
                          {Math.round(occupancyPercentage)}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>Capacity</span>
                          <span>{occupied}/{capacity}</span>
                        </div>
                        <Progress 
                          value={occupancyPercentage} 
                          className="h-2"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Package className="h-4 w-4" />
                          <span className="text-sm">Products ({location.products.length})</span>
                        </div>
                        <div className="space-y-2">
                          {location.products.map((product, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-300">{product.name}</span>
                              <span className="text-white font-medium">×{product.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1 border-white/10">
                            <MapPin className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 border-white/10">
                            <Truck className="h-4 w-4 mr-1" />
                            Move
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="movements" className="space-y-6">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Recent Movements
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Track stock transfers and location changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMovements.map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {movement.type === 'transfer' && <Navigation className="h-5 w-5 text-blue-400" />}
                          {movement.type === 'receive' && <Package className="h-5 w-5 text-green-400" />}
                          {movement.type === 'pick' && <Truck className="h-5 w-5 text-purple-400" />}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{movement.product}</h3>
                          <p className="text-gray-400 text-sm">
                            {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}: {movement.from} → {movement.to}
                          </p>
                          <p className="text-gray-500 text-xs">{movement.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold">×{movement.quantity}</span>
                        {getStatusBadge(movement.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Warehouse Layout
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Visual representation of warehouse zones and locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Zone A */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Zone A</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 16 }, (_, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-black/40 border border-white/20 rounded flex items-center justify-center relative group hover:bg-white/10 cursor-pointer transition-colors"
                        >
                          <Grid3X3 className="h-4 w-4 text-gray-400" />
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded" />
                          <span className="absolute bottom-1 right-1 text-xs text-gray-400">
                            A{String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Zone B */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Zone B</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 16 }, (_, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-black/40 border border-white/20 rounded flex items-center justify-center relative group hover:bg-white/10 cursor-pointer transition-colors"
                        >
                          <Grid3X3 className="h-4 w-4 text-gray-400" />
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded" />
                          <span className="absolute bottom-1 right-1 text-xs text-gray-400">
                            B{String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Locations</CardTitle>
                  <MapPin className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">248</div>
                  <p className="text-xs text-gray-400">Across 3 zones</p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Utilization Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">73%</div>
                  <p className="text-xs text-gray-400">+2.1% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Critical Locations</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">12</div>
                  <p className="text-xs text-gray-400">Require attention</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Location Efficiency</CardTitle>
                <CardDescription className="text-gray-300">
                  Optimize warehouse layout and improve picking efficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-gray-300">
                    <p>Advanced analytics features coming soon...</p>
                    <p className="text-sm">• Heat maps for high-activity zones</p>
                    <p className="text-sm">• Picking path optimization</p>
                    <p className="text-sm">• Storage density analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}