import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function AddCompany() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', website: '', sector: '', location: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Campo requerido';
    if (!form.website.trim()) e.website = 'Campo requerido';
    if (!form.sector.trim()) e.sector = 'Campo requerido';
    if (!form.location.trim()) e.location = 'Campo requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await CompanyService.create({
      name: form.name,
      website: form.website,
      sector: form.sector,
      location: form.location,
      contact: { email: form.email || '-', phone: form.phone || '-' },
    });
    setSubmitting(false);
    toast.success('Empresa creada correctamente');
    navigate('/companies');
  };

  const inputClass = (field: string) =>
    `w-full rounded-md border px-3 py-2 text-sm text-foreground bg-surface placeholder:text-muted-foreground focus-ring ${
      errors[field] ? 'border-destructive' : 'border-input'
    }`;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <button onClick={() => navigate('/companies')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors btn-press">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Volver al listado
      </button>

      <div>
        <h1 className="text-lg font-semibold text-foreground tracking-tight">Añadir Empresa</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Registrar un nuevo lead manualmente</p>
      </div>

      <form onSubmit={handleSubmit} className="card-surface p-5 space-y-4">
        {[
          { key: 'name', label: 'Nombre', placeholder: 'Ej: Acme Corp' },
          { key: 'website', label: 'Sitio web', placeholder: 'Ej: acme.com' },
          { key: 'sector', label: 'Sector', placeholder: 'Ej: Tecnología' },
          { key: 'location', label: 'Ubicación', placeholder: 'Ej: Madrid' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label} *</label>
            <input
              value={form[key as keyof typeof form]}
              onChange={e => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); }}
              placeholder={placeholder}
              className={inputClass(key) + ' mt-1'}
            />
            {errors[key] && <p className="text-xs text-destructive mt-1">{errors[key]}</p>}
          </div>
        ))}

        <div className="h-px bg-border" />
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Datos de contacto (opcional)</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="email@empresa.com"
              className={inputClass('email') + ' mt-1'}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Teléfono</label>
            <input
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+34 900 000 000"
              className={inputClass('phone') + ' mt-1'}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" className="btn-press" onClick={() => navigate('/companies')}>Cancelar</Button>
          <Button type="submit" className="btn-press" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            {submitting ? 'Guardando...' : 'Crear empresa'}
          </Button>
        </div>
      </form>
    </div>
  );
}
