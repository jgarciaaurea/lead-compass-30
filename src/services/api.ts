import { Company, LeadStatus } from '@/types/company';
import { mockCompanies } from '@/mocks/companies';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

let companies = [...mockCompanies];

export const CompanyService = {
  async getAll(): Promise<Company[]> {
    await delay();
    return [...companies];
  },

  async getById(id: string): Promise<Company | undefined> {
    await delay();
    return companies.find(c => c.id === id);
  },

  async create(data: Omit<Company, 'id' | 'createdAt' | 'notes' | 'activities' | 'subsidies' | 'score' | 'status'>): Promise<Company> {
    await delay();
    const newCompany: Company = {
      ...data,
      id: String(Date.now()),
      score: Math.floor(Math.random() * 60) + 30,
      status: 'nuevo',
      createdAt: new Date().toISOString().split('T')[0],
      notes: [],
      activities: [{ id: `a-${Date.now()}`, date: new Date().toISOString().split('T')[0], type: 'estado', description: 'Lead creado manualmente' }],
      subsidies: [],
    };
    companies = [newCompany, ...companies];
    return newCompany;
  },

  async updateStatus(id: string, status: LeadStatus): Promise<Company | undefined> {
    await delay();
    companies = companies.map(c => c.id === id ? { ...c, status, activities: [...c.activities, { id: `a-${Date.now()}`, date: new Date().toISOString().split('T')[0], type: 'estado' as const, description: `Estado cambiado a "${status}"` }] } : c);
    return companies.find(c => c.id === id);
  },

  async addNote(id: string, note: string): Promise<Company | undefined> {
    await delay();
    companies = companies.map(c => c.id === id ? { ...c, notes: [...c.notes, note], activities: [...c.activities, { id: `a-${Date.now()}`, date: new Date().toISOString().split('T')[0], type: 'nota' as const, description: note }] } : c);
    return companies.find(c => c.id === id);
  },

  async generateOffer(id: string): Promise<{ success: boolean; message: string }> {
    await delay(1200);
    companies = companies.map(c => c.id === id ? { ...c, activities: [...c.activities, { id: `a-${Date.now()}`, date: new Date().toISOString().split('T')[0], type: 'oferta' as const, description: 'Oferta PDF generada' }] } : c);
    return { success: true, message: 'Oferta PDF preparada.' };
  },
};
