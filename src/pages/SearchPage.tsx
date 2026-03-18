import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, AlertTriangle, MapPin, Globe } from 'lucide-react';

interface SearchResult {
  saved: any[];
  skipped: any[];
  errors: any[];
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [numResults, setNumResults] = useState('10');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const res = await fetch('https://unvouched-orrow-lorri.ngrok-free.dev/search-and-scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ query: query.trim(), num_results: Number(numResults) }),
      });
      const data = await res.json();
      setResult({
        saved: data.saved || [],
        skipped: data.skipped || [],
        errors: data.errors || [],
      });
    } catch (err: any) {
      setError(err.message || 'Error al realizar la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const total = result ? result.saved.length + result.skipped.length + result.errors.length : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground tracking-tight">Búsqueda de Leads</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Busca empresas automáticamente y guárdalas como leads
        </p>
      </div>

      <form onSubmit={handleSearch} className="card-surface p-5 flex flex-col sm:flex-row gap-3">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ej: fontanería Badajoz, restaurantes Madrid"
          required
          className="flex-1"
        />
        <Select value={numResults} onValueChange={setNumResults}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
          {loading ? 'Buscando...' : 'Buscar y guardar leads'}
        </Button>
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
