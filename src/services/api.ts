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
      headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
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
  const emailsList = d.email ? d.email.split("|").filter(Boolean) : [];
  const phonesList = d.phone ? d.phone.split("|").filter(Boolean) : [];
  return {
    id: String(d.id),
    name: d.legal_name || d.title || d.url || "Sin nombre",
    website: d.url || "",
    description: d.description || "",
    sector: d.sector || "-",
    location: d.location || "-",
    cif: d.cif || "",
    legal_name: d.legal_name || "",
    emails: emailsList,
    phones: phonesList,
    addresses: Array.isArray(d.addresses) ? d.addresses : [],
    score: 50,
    status: "nuevo",
    contact: {
      email: emailsList[0] || "-",
      phone: phonesList[0] || "-",
    },
    createdAt: new Date().toISOString().split("T")[0],
    notes: [],
    activities: [],
    subsidies: [],
  };
}
