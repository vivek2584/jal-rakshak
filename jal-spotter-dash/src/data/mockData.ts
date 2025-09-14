import { ActionLog, Resource, WorkerLocation, RiskPrediction } from '../types/dashboard';

export const mockActionLogs: ActionLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    action: 'Protocol: Water testing team dispatched to Youliwadi',
    officer: 'Dr. Rajesh Sharma',
    village: 'Youliwadi',
    status: 'completed'
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    action: 'SMS Alert sent to 2,500 residents in Khowang area',
    officer: 'Priya Devi',
    village: 'Khowang',
    status: 'completed'
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    action: 'ASHA Worker notified for symptom investigation',
    officer: 'Bikash Das',
    village: 'Tengakhat',
    status: 'pending'
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    action: 'NHM Report generated for outbreak cluster',
    officer: 'Anjali Goswami',
    status: 'completed'
  }
];

export const mockResources: Resource[] = [
  {
    name: 'Water Testing Kits',
    current: 45,
    total: 50,
    status: 'good',
    locations: ['Dibrugarh PHC', 'Khowang Sub-center', 'Youliwadi Clinic']
  },
  {
    name: 'ORS Stocks',
    current: 150,
    total: 500,
    status: 'low',
    locations: ['Central Medical Store', 'Youliwadi Clinic', 'Rajgarh Clinic']
  },
  {
    name: 'Field Teams',
    current: 2,
    total: 3,
    status: 'good',
    locations: ['Team Alpha: Youliwadi', 'Team Beta: Khowang']
  },
  {
    name: 'Medical Beds',
    current: 12,
    total: 20,
    status: 'good',
    locations: ['Dibrugarh CHC', 'Tengakhat PHC']
  }
];

export const mockWorkerLocations: WorkerLocation[] = [
  {
    id: 'worker-1',
    name: 'Ritu Sharma',
    role: 'ASHA Worker',
    coordinates: [27.4728, 94.9120],
    status: 'busy',
    assignedVillage: 'Youliwadi'
  },
  {
    id: 'worker-2',
    name: 'Manjit Das',
    role: 'Health Inspector',
    coordinates: [27.4512, 94.8987],
    status: 'available'
  },
  {
    id: 'worker-3',
    name: 'Priya Gogoi',
    role: 'ASHA Worker',
    coordinates: [27.4889, 94.9254],
    status: 'available'
  },
  {
    id: 'worker-4',
    name: 'Babul Borah',
    role: 'Water Testing Tech',
    coordinates: [27.4456, 94.9087],
    status: 'busy',
    assignedVillage: 'Tengakhat'
  },
  {
    id: 'worker-5',
    name: 'Geeta Kalita',
    role: 'Field Coordinator',
    coordinates: [27.4623, 94.9156],
    status: 'available'
  }
];

export const mockRiskPredictions: RiskPrediction[] = [
  {
    village: 'Youliwadi',
    coordinates: [27.4728, 94.9120],
    riskScore: 85,
    factors: ['High population density', 'Contaminated water source', 'Recent rainfall'],
    confidence: 92
  },
  {
    village: 'Khowang',
    coordinates: [27.4512, 94.8987],
    riskScore: 67,
    factors: ['Increased symptoms', 'Shared water source', 'Poor sanitation'],
    confidence: 78
  },
  {
    village: 'Rajgarh',
    coordinates: [27.4889, 94.9254],
    riskScore: 23,
    factors: ['Good water quality', 'Low population density'],
    confidence: 85
  },
  {
    village: 'Tengakhat',
    coordinates: [27.4456, 94.9087],
    riskScore: 45,
    factors: ['River water source', 'Moderate rainfall'],
    confidence: 72
  },
  {
    village: 'Barbarua',
    coordinates: [27.4623, 94.9156],
    riskScore: 34,
    factors: ['Regular water testing', 'Good drainage'],
    confidence: 80
  }
];

export const aiInsights = {
  'alert-1': {
    pathogen: 'Vibrio cholerae (Cholera)',
    confidence: 87,
    recommendation: 'Immediate deployment of ORS kits and water purification tablets. Establish isolation ward.',
    symptoms: ['Watery diarrhea', 'Vomiting', 'Dehydration'],
    treatmentProtocol: 'WHO Cholera Treatment Protocol'
  },
  'alert-2': {
    pathogen: 'Rotavirus',
    confidence: 73,
    recommendation: 'Distribute zinc supplements and ORS. Monitor children under 5 closely.',
    symptoms: ['Fever', 'Vomiting', 'Loose stools'],
    treatmentProtocol: 'Pediatric Diarrhea Management'
  },
  'alert-3': {
    pathogen: 'E. coli (ETEC)',
    confidence: 65,
    recommendation: 'Water source testing and treatment. Hygiene education campaign.',
    symptoms: ['Abdominal cramps', 'Watery diarrhea'],
    treatmentProtocol: 'Bacterial Diarrhea Protocol'
  }
};

export const roiData = {
  casesPreventedThisMonth: 45,
  estimatedCostSavings: 225000, // in rupees
  responseTime: '2.3 hours', // average
  alertAccuracy: 89, // percentage
  resourceEfficiency: 76 // percentage
};