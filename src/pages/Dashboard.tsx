import { useEffect, useState } from 'react';
import { CompanyService } from '@/services/api';
import { Company, LeadStatus } from '@/types/company';
import { ScoreIndicator } from '@/components/shared/ScoreIndicator';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, Users, CheckCircle } from 'lucide-react';

const statusLabels: Record<LeadStatus, string> = {
  'nuevo': 'Nuevos',
  'contactado': 'Contactados',
  'en progreso': 'En progreso',
  'cerrado': 'Cerrados',
};

const statusIcons: Record<LeadStatus, React.ElementType> = {
  'nuevo': Building2,
  'contactado': Users,
  'en progreso': TrendingUp,
  'cerrado': CheckCircle,
};

export default function Dashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    CompanyService.getAll().then(data => { setCompanies(data); setLoading(false); });
  }, []);

  const byStatus = (status: LeadStatus) => companies.filter(c => c.status === status).length;
  const topCompanies = [...companies].sort((a, b) => b.score - a.score).slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card-surface h-20 animate-pulse bg-muted/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Resumen de actividad comercial</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(statusLabels) as LeadStatus[]).map((status, i) => {
          const Icon = statusIcons[status];
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
              className="card-surface p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{statusLabels[status]}</span>
                <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="text-2xl font-semibold text-foreground font-mono tabular-nums mt-2">{byStatus(status)}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card-surface">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Top Empresas por Score</h2>
          </div>
          <div className="divide-y divide-border/50">
            {topCompanies.map((company, i) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between px-4 py-3 table-row-hover cursor-pointer"
                onClick={() => navigate(`/companies/${company.id}`)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs text-muted-foreground tabular-nums w-4">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{company.name}</p>
                    <p className="text-xs text-muted-foreground">{company.sector}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ScoreIndicator value={company.score} />
                  <StatusBadge status={company.status} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="card-surface">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Resumen</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total empresas</p>
              <p className="text-3xl font-semibold text-foreground font-mono tabular-nums mt-1">{companies.length}</p>
            </div>
            <div className="h-px bg-border" />
            <div className="space-y-2">
              {(Object.keys(statusLabels) as LeadStatus[]).map(status => (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <span className="font-mono text-sm tabular-nums text-foreground">{byStatus(status)}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-border" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Score promedio</p>
              <p className="text-2xl font-semibold text-foreground font-mono tabular-nums mt-1">
                {companies.length ? Math.round(companies.reduce((s, c) => s + c.score, 0) / companies.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
