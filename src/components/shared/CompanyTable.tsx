import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Company } from '@/types/company';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ScoreIndicator } from '@/components/shared/ScoreIndicator';
import { ArrowUpDown } from 'lucide-react';

interface Props {
  companies: Company[];
}

export function CompanyTable({ companies }: Props) {
  const navigate = useNavigate();
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    return [...companies].sort((a, b) => sortAsc ? a.score - b.score : b.score - a.score);
  }, [companies, sortAsc]);

  return (
    <div className="card-surface overflow-hidden">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-raised">
            <th className="table-header-cell">Empresa</th>
            <th className="table-header-cell hidden md:table-cell">Sector</th>
            <th className="table-header-cell hidden lg:table-cell">Ubicación</th>
            <th
              className="table-header-cell cursor-pointer select-none"
              onClick={() => setSortAsc(!sortAsc)}
            >
              <span className="inline-flex items-center gap-1">
                Score
                <ArrowUpDown className="h-3 w-3" strokeWidth={1.5} />
              </span>
            </th>
            <th className="table-header-cell">Estado</th>
            <th className="table-header-cell text-right" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {sorted.map(company => (
            <tr
              key={company.id}
              className="table-row-hover group cursor-pointer"
              onClick={() => navigate(`/companies/${company.id}`)}
            >
              <td className="px-4 py-3">
                <div className="font-medium text-foreground">{company.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{company.website}</div>
              </td>
              <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{company.sector}</td>
              <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{company.location}</td>
              <td className="px-4 py-3">
                <ScoreIndicator value={company.score} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={company.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <span className="opacity-0 group-hover:opacity-100 text-primary font-medium text-xs transition-opacity">
                  Ver detalle →
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div className="py-12 text-center text-muted-foreground text-sm">
          No hay leads detectados. Ajusta los filtros de búsqueda.
        </div>
      )}
    </div>
  );
}
