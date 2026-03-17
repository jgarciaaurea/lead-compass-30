import { LeadStatus } from '@/types/company';

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  'nuevo': { label: 'Nuevo', className: 'bg-status-nuevo/10 text-status-nuevo' },
  'contactado': { label: 'Contactado', className: 'bg-status-contactado/10 text-status-contactado' },
  'en progreso': { label: 'En progreso', className: 'bg-status-progreso/10 text-status-progreso' },
  'cerrado': { label: 'Cerrado', className: 'bg-status-cerrado/10 text-status-cerrado' },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${config.className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
