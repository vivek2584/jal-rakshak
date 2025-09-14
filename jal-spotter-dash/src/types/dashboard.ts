export interface SymptomReport {
  id: string;
  village: string;
  coordinates: [number, number];
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  reportedAt: Date;
  waterSource?: string;
  reporterAge?: number;
  reporterGender?: 'male' | 'female' | 'other';
}

export interface WaterSource {
  id: string;
  name: string;
  type: 'well' | 'borehole' | 'river' | 'pond' | 'tank';
  coordinates: [number, number];
  status: 'safe' | 'caution' | 'contaminated';
  lastTested?: Date;
  reports: string[];
}

export interface Alert {
  id: string;
  village: string;
  level: 'high' | 'medium' | 'low';
  trigger: string;
  description: string;
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved';
  reportCount: number;
}

export interface DashboardStats {
  totalReportsToday: number;
  activeAlerts: number;
  highRiskVillages: number;
  newReports24h: number;
}

export interface ChartData {
  symptoms: Array<{ name: string; count: number }>;
  timeline: Array<{ date: string; reports: number; rainfall?: number }>;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'district_medical_officer' | 'asha_coordinator' | 'health_inspector' | 'data_analyst' | 'public_user';
  district: string;
  department: string;
  phone?: string;
  lastLogin: Date;
  profilePicture?: string;
}

export interface ActionLog {
  id: string;
  timestamp: Date;
  action: string;
  officer: string;
  village?: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Resource {
  name: string;
  current: number;
  total: number;
  status: 'good' | 'low' | 'critical';
  locations?: string[];
}

export interface WorkerLocation {
  id: string;
  name: string;
  role: string;
  coordinates: [number, number];
  status: 'available' | 'busy' | 'offline';
  assignedVillage?: string;
}

export interface RiskPrediction {
  village: string;
  coordinates: [number, number];
  riskScore: number;
  factors: string[];
  confidence: number;
}