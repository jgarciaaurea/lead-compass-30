import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CompanyService } from '@/services/api';
import { Company, LeadStatus } from '@/types/company';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ScoreIndicator } from '@/components/shared/ScoreIndicator';
import { ActivityTimeline } from '@/components/shared/ActivityTimeline';
import { SubsidyList } from '@/components/shared/SubsidyList';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, FileText, Phone, MessageSquare, Globe, MapPin, Mail, Loader2, Building2, Hash, Euro, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (id) {
      CompanyService.getById(id).then(data => {
        setCompany(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  const handleStatusChange = async (status: LeadStatus) => {
    if (!id) return;
    const updated = await CompanyService.updateStatus(id, status);
    if (updated) { setCompany(updated); toast.success(`Estado cambiado a "${status}"`); }
  };

  const handleGenerateOffer = async () => {
    if (!id) return;
    setGenerating(true);
    const result = await CompanyService.generateOffer(id);
    setGenerating(false);
    if (result.success) {
      toast.success(result.message);
      const updated = await CompanyService.getById(id);
      if (updated) setCompany(updated);
    }
  };

  const handleAddNote = async () => {
    if (!id || !noteText.trim()) return;
    const updated = await CompanyService.addNote(id, noteText.trim());
    if (updated) { setCompany(updated); setNoteText(''); toast.success('Nota añadida'); }
  };

  if (loading) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="card-surface h-32 animate-pulse bg-muted/50" />)}</div>;
  }

  if (!company) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Empresa no encontrada.</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate('/companies')}>← Volver al listado</Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-6">
      <button onClick={() => navigate('/companies')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors btn-press">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Volver al listado
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">{company.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={company.status} />
            <ScoreIndicator value={company.score} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Info */}
          <div className="card-surface p-4 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Información general</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4" strokeWidth={1.5} />
                <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{company.website}</a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" strokeWidth={1.5} />
                {company.location}
              </div>
              {company.cif && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="h-4 w-4" strokeWidth={1.5} />
                  <span><span className="font-medium text-foreground">CIF:</span> {company.cif}</span>
                </div>
              )}
              {company.legal_name && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" strokeWidth={1.5} />
                  <span><span className="font-medium text-foreground">Razón social:</span> {company.legal_name}</span>
                </div>
              )}
            </div>

            {/* Emails */}
            <div className="pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Emails</span>
              <div className="mt-1 space-y-1">
                {company.emails && company.emails.length > 0 ? (
                  company.emails.map((email, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                      <a href={`mailto:${email}`} className="text-primary hover:underline">{email}</a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">-</p>
                )}
              </div>
            </div>

            {/* Phones */}
            <div className="pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Teléfonos</span>
              <div className="mt-1 space-y-1">
                {company.phones && company.phones.length > 0 ? (
                  company.phones.map((phone, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" strokeWidth={1.5} />
                      <a href={`tel:${phone}`} className="text-primary hover:underline">{phone}</a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">-</p>
                )}
              </div>
            </div>

            {/* Addresses */}
            {company.addresses && company.addresses.length > 0 && (
              <div className="pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Direcciones</span>
                <div className="mt-1 space-y-1">
                  {company.addresses.map((addr, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                      <span>{addr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {company.description && (
              <div className="pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Descripción</span>
                <p className="text-sm text-foreground mt-0.5">{company.description}</p>
              </div>
            )}
            <div className="pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Sector</span>
              <p className="text-sm font-medium text-foreground mt-0.5">{company.sector}</p>
            </div>
          </div>

          {/* Activity */}
          <div className="card-surface p-4">
            <h2 className="text-sm font-semibold text-foreground mb-4">Historial de actividad</h2>
            <ActivityTimeline activities={company.activities} />
          </div>

          {/* Subsidies */}
          <div className="card-surface p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">Subvenciones detectadas</h2>
            <SubsidyList subsidies={company.subsidies} />
          </div>
        </div>

        {/* Right column - Actions */}
        <div className="space-y-4">
          <div className="card-surface p-4 space-y-3 lg:sticky lg:top-6">
            <h2 className="text-sm font-semibold text-foreground">Acciones</h2>

            <Button className="w-full btn-press" onClick={handleGenerateOffer} disabled={generating}>
              {generating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <FileText className="h-4 w-4 mr-1" strokeWidth={1.5} />}
              {generating ? 'Generando oferta...' : 'Generar oferta'}
            </Button>

            {company.status !== 'contactado' && (
              <Button variant="outline" className="w-full btn-press" onClick={() => handleStatusChange('contactado')}>
                <Phone className="h-4 w-4 mr-1" strokeWidth={1.5} />
                Marcar como contactado
              </Button>
            )}

            <div className="pt-2 border-t border-border">
              <label className="text-xs text-muted-foreground font-medium">Añadir nota</label>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Escribe una nota..."
                className="mt-1 w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-ring resize-none"
                rows={3}
              />
              <Button variant="outline" size="sm" className="mt-2 w-full btn-press" onClick={handleAddNote} disabled={!noteText.trim()}>
                <MessageSquare className="h-4 w-4 mr-1" strokeWidth={1.5} />
                Guardar nota
              </Button>
            </div>

            <div className="pt-2 border-t border-border">
              <label className="text-xs text-muted-foreground font-medium block mb-2">Cambiar estado</label>
              <div className="flex flex-wrap gap-1">
                {(['nuevo', 'contactado', 'en progreso', 'cerrado'] as LeadStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-colors btn-press ${
                      company.status === s
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {company.notes.length > 0 && (
            <div className="card-surface p-4">
              <h2 className="text-sm font-semibold text-foreground mb-2">Notas</h2>
              <div className="space-y-2">
                {company.notes.map((note, i) => (
                  <p key={i} className="text-sm text-muted-foreground border-l-2 border-border pl-3">{note}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
