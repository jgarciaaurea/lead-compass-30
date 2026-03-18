export type LeadStatus = 'nuevo' | 'contactado' | 'en progreso' | 'cerrado';

export interface Company {
  id: string;
  name: string;
  website: string;
  sector: string;
  location: string;
  description?: string;
  cif?: string;
  legal_name?: string;
  emails?: string[];
  addresses?: string[];
  phones?: string[];
  score: number;
  status: LeadStatus;
  contact: {
    email: string;
    phone: string;
  };
  createdAt: string;
  notes: string[];
  activities: Activity[];
  subsidies: Subsidy[];
}

export interface Activity {
  id: string;
  date: string;
  type: 'nota' | 'contacto' | 'oferta' | 'estado';
  description: string;
}

export interface Subsidy {
  id: string;
  name: string;
  amount: string;
  deadline: string;
  status: 'abierta' | 'cerrada' | 'pendiente';
}

export interface DashboardStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  topCompanies: Company[];
}
