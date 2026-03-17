import { useEffect, useState } from 'react';
import { CompanyService } from '@/services/api';
import { Company, LeadStatus } from '@/types/company';
import { CompanyTable } from '@/components/shared/CompanyTable';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const statuses: (LeadStatus | 'todos')[] = ['todos', 'nuevo', 'contactado', 'en progreso', 'cerrado'];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LeadStatus | 'todos'>('todos');
  const navigate = useNavigate();

  useEffect(() => {
    CompanyService.getAll().then(data => { setCompanies(data); setLoading(false); });
  }, []);

  const filtered = filter === 'todos' ? companies : companies.filter(c => c.status === filter);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 bg-muted/50 animate-pulse rounded-md" />
        <div className="card-surface h-64 animate-pulse bg-muted/50" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">Empresas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{companies.length} leads detectados</p>
        </div>
        <Button size="sm" className="btn-press" onClick={() => navigate('/companies/new')}>
          <Plus className="h-4 w-4 mr-1" strokeWidth={1.5} />
          Añadir
        </Button>
      </div>

      <div className="flex gap-1 flex-wrap">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors btn-press ${
              filter === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {s === 'todos' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <CompanyTable companies={filtered} />
    </div>
  );
}
