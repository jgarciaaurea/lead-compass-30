import { Activity } from '@/types/company';
import { MessageSquare, Phone, FileText, RefreshCw } from 'lucide-react';

const iconMap: Record<Activity['type'], React.ElementType> = {
  nota: MessageSquare,
  contacto: Phone,
  oferta: FileText,
  estado: RefreshCw,
};

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  const sorted = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="relative">
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
      <div className="space-y-4">
        {sorted.map(activity => {
          const Icon = iconMap[activity.type];
          return (
            <div key={activity.id} className="flex gap-3 relative">
              <div className="relative z-10 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-surface border border-border">
                <Icon className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono tabular-nums">{activity.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
