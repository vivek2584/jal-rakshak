import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SymptomReport, WaterSource } from '../types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Droplets, AlertTriangle } from 'lucide-react';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  reports: SymptomReport[];
  waterSources: WaterSource[];
  onClusterClick?: (lat: number, lon: number) => void;
}

interface ClusterInfo {
  village: string;
  count: number;
  mainSymptom: string;
  coordinates: [number, number];
}

export function InteractiveMap({ reports, waterSources, onClusterClick }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<ClusterInfo | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Dibrugarh, Assam
    const map = L.map(mapRef.current).setView([27.4728, 94.9120], 12);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // Create clusters by village
    const clusters = new Map<string, SymptomReport[]>();
    reports.forEach(report => {
      const key = report.village;
      if (!clusters.has(key)) {
        clusters.set(key, []);
      }
      clusters.get(key)!.push(report);
    });

    // Add cluster markers
    clusters.forEach((villageReports, village) => {
      const count = villageReports.length;
      const avgLat = villageReports.reduce((sum, r) => sum + r.coordinates[0], 0) / count;
      const avgLng = villageReports.reduce((sum, r) => sum + r.coordinates[1], 0) / count;
      
      // Determine cluster color based on report count
      let color = '#22c55e'; // green (default for <= 5 reports)
      let size = 20;
      if (count > 20) { // Critical (>20 reports)
        color = '#ef4444'; // red
        size = 40;
      } else if (count > 10) { // High (10-20 reports)
        color = '#f97316'; // orange
        size = 30;
      } else if (count > 5) { // Medium (5-10 reports)
        color = '#eab308'; // yellow
        size = 25;
      } else { // Low (<=5 reports)
        color = '#22c55e'; // green
        size = 20;
      }

      const circle = L.circleMarker([avgLat, avgLng], {
        radius: size / 2,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      });

      // Most common symptom in this cluster
      const symptomCounts = new Map<string, number>();
      villageReports.forEach(report => {
        report.symptoms.forEach(symptom => {
          symptomCounts.set(symptom, (symptomCounts.get(symptom) || 0) + 1);
        });
      });
      const mainSymptom = Array.from(symptomCounts.entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

      circle.bindTooltip(`
        <div style="font-size: 12px;">
          <strong>${village}</strong><br/>
          ${count} reports<br/>
          Main symptom: ${mainSymptom}
        </div>
      `);

      circle.on('click', () => {
        console.log("InteractiveMap: Cluster clicked, sending coordinates:", { lat: avgLat, lon: avgLng });
        setSelectedCluster({
          village,
          count,
          mainSymptom,
          coordinates: [avgLat, avgLng]
        });
        if (onClusterClick) {
          onClusterClick({ lat: avgLat, lon: avgLng });
        }
      });

      circle.addTo(map);
    });

    // Add water source markers
    waterSources.forEach(source => {
      let iconColor = '#3b82f6'; // blue default
      if (source.status === 'contaminated') {
        iconColor = '#ef4444'; // red
      } else if (source.status === 'caution') {
        iconColor = '#f97316'; // orange
      }

      const icon = L.divIcon({
        html: `<div style="background-color: ${iconColor}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        className: '',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker(source.coordinates, { icon });
      marker.bindTooltip(`
        <div style="font-size: 12px;">
          <strong>${source.name}</strong><br/>
          Type: ${source.type}<br/>
          Status: ${source.status}<br/>
          Reports linked: ${source.reports.length}
        </div>
      `);

      marker.addTo(map);
    });

  }, [reports, waterSources, onClusterClick]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Disease Outbreak Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <div 
                ref={mapRef} 
                className="w-full h-96 lg:h-[500px] border rounded-lg"
                style={{ minHeight: '400px' }}
              />
              
              {/* Map Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  <span>Low (&lt;5 reports)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-yellow-500 rounded-full border-2 border-white"></div>
                  <span>Medium (5-10 reports)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full border-2 border-white"></div>
                  <span>High (10-20 reports)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white"></div>
                  <span>Critical (&gt;20 reports)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span>Water Sources</span>
                </div>
              </div>
            </div>

            {/* Cluster Details Panel */}
            <div className="space-y-4">
              {selectedCluster ? (
                <Card className="border-2 border-health-primary">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-alert-high" />
                      Cluster Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-semibold text-lg">{selectedCluster.village}</p>
                      <p className="text-muted-foreground">Village</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="bg-alert-high">
                        {selectedCluster.count} Reports
                      </Badge>
                    </div>

                    <div>
                      <p className="font-medium">Main Symptom</p>
                      <p className="text-alert-high font-semibold">{selectedCluster.mainSymptom}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Coordinates: {selectedCluster.coordinates[0].toFixed(4)}, {selectedCluster.coordinates[1].toFixed(4)}
                      </p>
                    </div>

                    <Button 
                      className="w-full bg-health-primary hover:bg-health-primary/90 text-wrap h-auto py-2"
                      onClick={() => {
                        // Simulate protocol activation
                        alert(`Emergency Protocol Activated for ${selectedCluster.village}\n\nActions:\n• Water testing team dispatched\n• Medical supplies deployed\n• Community alert issued`);
                      }}
                    >
                      <span className="text-center">Activate Response Protocol</span>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Click on a cluster to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Water Source Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    Water Source Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {waterSources.length > 0 ? (
                    waterSources.map(source => (
                      <div key={source.id} className="flex items-center justify-between text-sm">
                        <span className="truncate">{source.name}</span>
                        <Badge 
                          variant={source.status === 'contaminated' ? 'destructive' :
                                  source.status === 'caution' ? 'secondary' : 'default'}
                          className={
                            source.status === 'contaminated' ? 'bg-alert-high' :
                            source.status === 'caution' ? 'bg-alert-medium text-white' :
                            'bg-success text-white'
                          }
                        >
                          {source.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Droplets className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No nearby water sources</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}