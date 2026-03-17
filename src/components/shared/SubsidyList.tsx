import { Subsidy } from '@/types/company';

const statusColors: Record<Subsidy['status'], string> = {
  abierta: 'text-score-high bg-score-high/10',
  pendiente: 'text-score-mid bg-score-mid/10',
  cerrada: 'text-muted-foreground bg-muted',
};

export function SubsidyList({ subsidies }: { subsidies: Subsidy[] }) {
  if (subsidies.length === 0) {
    return <p className="text-sm text-muted-foreground">No se han detectado subvenciones para esta empresa.</p>;
  }

  return (
    <div className="space-y-2">
      {subsidies.map(s => (
        <div key={s.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <div>
            <p className="text-sm font-medium text-foreground">{s.name}</p>
            <p className="text-xs text-muted-foreground font-mono tabular-nums">Hasta {s.deadline} · {s.amount}</p>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${statusColors[s.status]}`}>
            {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
          </span>
        </div>
      ))}
    </div>
  );
}
