import { Company, LeadStatus } from "@/types/company";

const API_URL = "https://unvouched-orrow-lorri.ngrok-free.dev";

export const CompanyService = {
  async getAll(): Promise<Company[]> {
    const res = await fetch(`${API_URL}/companies`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
    const data = await res.json();
    return data.map(mapCompany);
  },

  async getById(id: string): Promise<Company | undefined> {
    const res = await fetch(`${API_URL}/companies`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
    const data = await res.json();
    return data.map(mapCompany).find((c: Company) => c.id === id);
  },

  async create(
    input: Omit<Company, "id" | "createdAt" | "notes" | "activities" | "subsidies" | "score" | "status">,
  ): Promise<Company> {
    const res = await fetch(`${API_URL}/companies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: input.website,
        title: input.name,
        email: input.contact.email,
        phone: input.contact.phone,
      }),
    });
    const data = await res.json();
    return mapCompany(data);
  },

  async updateStatus(id: string, status: LeadStatus): Promise<Company | undefined> {
    return undefined; // implementar cuando añadas el endpoint en FastAPI
  },

  async addNote(id: string, note: string): Promise<Company | undefined> {
    return undefined; // implementar cuando añadas el endpoint en FastAPI
  },

  async generateOffer(id: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: "Oferta PDF preparada." };
  },
};

function mapCompany(d: any): Company {
  return {
    id: String(d.id),
    name: d.title || d.url || "Sin nombre",
    website: d.url || "",
    sector: "-",
    location: "-",
    score: 50,
    status: "nuevo",
    contact: {
      email: d.email?.split("|")[0] || "-",
      phone: d.phone?.split("|")[0] || "-",
    },
    createdAt: new Date().toISOString().split("T")[0],
    notes: [],
    activities: [],
    subsidies: [],
  };
}
