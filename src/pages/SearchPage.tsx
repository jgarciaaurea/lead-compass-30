import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, AlertTriangle, MapPin, Globe, Search, SlidersHorizontal } from 'lucide-react';

const API_URL = 'https://unvouched-orrow-lorri.ngrok-free.dev';

interface SearchResult {
  saved: any[];
  skipped: any[];
  errors: any[];
}

export default function SearchPage() {
  const [mode, setMode] = useState<'libre' | 'filtros'>('libre');
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [numResults, setNumResults] = useState('10');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState('');

  const buildQuery = () => {
    if (mode === 'libre') return query.trim();
    const parts = [sector.trim(), ciudad.trim()].filter(Boolean);
    return parts.join(' ');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuery = buildQuery();
    if (!finalQuery) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await fetch(`${API_URL}/search-and-scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ query: finalQuery, num_results: Number(numResults) }),
      });
      const data = await res.json();
      setResult({ saved: data.saved || [], skipped: data.skipped || [], errors: data.errors || [] });
    } catch (err: any) {
      setError(err.message || 'Error al realizar la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground tracking-tight">Búsqueda de Leads</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Busca empresas automáticamente y guárdalas como leads
        </p>
      </div>

      {/* Pestañas */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('libre')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'libre' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
        >
          <Search className="h-4 w-4" />
          Búsqueda libre
        </button>
        <button
          onClick={() => setMode('filtros')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'filtros' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Búsqueda con filtros
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSearch} className="card-surface p-5 space-y-4">
        {mode === 'libre' ? (
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ej: fontanería Badajoz, restaurantes Madrid"
            required
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Sector / Actividad</label>
              <Input value={sector} onChange={e => setSector(e.target.value)} placeholder="ej: fontanería, abogados" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Ciudad</label>
              <Input value={ciudad} onChange={e => setCiudad(e.target.value)} placeholder="ej: Badajoz, Madrid" className="mt-1" />
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Resultados:</span>
            <Select value={numResults} onValueChange={setNumResults}>
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading} className="ml-auto">
            {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            {loading ? 'Buscando...' : 'Buscar y guardar leads'}
          </Button>
        </div>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="flex items-center gap-2 p-4">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{result.saved.length}</p>
                  <p className="text-xs text-muted-foreground">Guardadas</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-2 p-4">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{result.skipped.length}</p>
                  <p className="text-xs text-muted-foreground">Saltadas</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-2 p-4">
                <XCircle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{result.errors.length}</p>
                  <p className="text-xs text-muted-foreground">Errores</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {result.saved.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Empresas guardadas ({result.saved.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {result.saved.map((company: any, i: number) => (
                    <div key={i} className="px-5 py-3 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {company.legal_name || company.title || company.url || 'Sin nombre'}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {company.url && (
                            <span className="inline-flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {company.url}
                            </span>
                          )}
                          {company.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {company.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
