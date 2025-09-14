import { useQuery } from "@tanstack/react-query";
import { SymptomReport, WaterSource, Alert, DashboardStats, ChartData } from "../types/dashboard";
import { useState, useEffect } from "react";

const API_BASE_URL = "http://127.0.0.1:5000/api";
const DEFAULT_LIMIT = 3; // Changed from 4 to 3
const DIBRUGARH_LAT = 27.4842;
const DIBRUGARH_LON = 94.9123;
const DEFAULT_RADIUS_KM = 50;

async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
}

// Helper to transform date strings to Date objects
function transformDates<T extends { reportedAt?: string | Date; lastTested?: string | Date; timestamp?: string | Date }>(data: T | T[]): T | T[] {
  if (Array.isArray(data)) {
    return data.map(item => transformDates(item)) as T[];
  } else if (data) {
    const newData = { ...data };
    if (typeof newData.reportedAt === 'string') {
      newData.reportedAt = new Date(newData.reportedAt);
    }
    if (typeof newData.lastTested === 'string') {
      newData.lastTested = new Date(newData.lastTested);
    }
    if (typeof newData.timestamp === 'string') {
      newData.timestamp = new Date(newData.timestamp);
    }
    return newData as T;
  }
  return data;
}

export function useDashboardData() {
  const [centerCoordinates, setCenterCoordinates] = useState<{ lat: number; lon: number } | null>({
    lat: DIBRUGARH_LAT,
    lon: DIBRUGARH_LON,
  });

  useEffect(() => {
    console.log("useDashboardData: centerCoordinates updated", centerCoordinates);
  }, [centerCoordinates]);

  const { data: dashboardStats, isLoading: isLoadingStats, error: errorStats } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: () => fetcher<DashboardStats>(`${API_BASE_URL}/dashboard-summary`),
  });

  // Construct query params for proximity-filtered data
  const proximityParams = centerCoordinates
    ? `latitude=${centerCoordinates.lat}&longitude=${centerCoordinates.lon}&radius_km=${DEFAULT_RADIUS_KM}`
    : '';

  const { data: symptomReportsData, isLoading: isLoadingReports, error: errorReports } = useQuery<SymptomReport[]>({
    queryKey: ['symptomReports', DEFAULT_LIMIT, centerCoordinates],
    queryFn: () =>
      fetcher<SymptomReport[]>(`${API_BASE_URL}/symptom-reports?${proximityParams}&limit=${DEFAULT_LIMIT}`),
    enabled: !!centerCoordinates,
  });
  const symptomReports = transformDates(symptomReportsData) as SymptomReport[];

  const { data: symptomReportsMapData, isLoading: isLoadingReportsMap, error: errorReportsMap } = useQuery<SymptomReport[]>({
    queryKey: ['symptomReportsMap'],
    queryFn: () => fetcher<SymptomReport[]>(`${API_BASE_URL}/symptom-reports`),
  });
  const symptomReportsMap = transformDates(symptomReportsMapData) as SymptomReport[];

  const { data: waterSourcesData, isLoading: isLoadingWaterSources, error: errorWaterSources } = useQuery<WaterSource[]>({
    queryKey: ['waterSources', DEFAULT_LIMIT, centerCoordinates],
    queryFn: () =>
      fetcher<WaterSource[]>(`${API_BASE_URL}/water-sources?${proximityParams}&limit=${DEFAULT_LIMIT}`),
    enabled: !!centerCoordinates,
  });
  const waterSources = transformDates(waterSourcesData) as WaterSource[];

  const { data: waterSourcesMapData, isLoading: isLoadingWaterSourcesMap, error: errorWaterSourcesMap } = useQuery<WaterSource[]>({
    queryKey: ['waterSourcesMap'],
    queryFn: () => fetcher<WaterSource[]>(`${API_BASE_URL}/water-sources`),
  });
  const waterSourcesMap = transformDates(waterSourcesMapData) as WaterSource[];

  const { data: alertsData, isLoading: isLoadingAlerts, error: errorAlerts } = useQuery<Alert[]>({
    queryKey: ['alerts', DEFAULT_LIMIT, centerCoordinates],
    queryFn: () => fetcher<Alert[]>(`${API_BASE_URL}/alerts?${proximityParams}&limit=${DEFAULT_LIMIT}`),
    enabled: !!centerCoordinates,
  });
  const alerts = transformDates(alertsData) as Alert[];

  const { data: chartData, isLoading: isLoadingChartData, error: errorChartData } = useQuery<ChartData>({
    queryKey: ['chartData'],
    queryFn: () => fetcher<ChartData>(`${API_BASE_URL}/chart-data`),
  });

  const isLoading = isLoadingStats || isLoadingReports || isLoadingWaterSources || isLoadingAlerts || isLoadingChartData || isLoadingReportsMap || isLoadingWaterSourcesMap;
  const error = errorStats || errorReports || errorWaterSources || errorAlerts || errorChartData || errorReportsMap || errorWaterSourcesMap;

  return {
    dashboardStats,
    symptomReports,
    symptomReportsMap,
    waterSources,
    waterSourcesMap,
    alerts,
    chartData,
    isLoading,
    error,
    setCenterCoordinates, // Expose setter to update coordinates from map click
  };
}
