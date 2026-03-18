import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function ScrapePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const res = await fetch('https://unvouched-orrow-lorri.ngrok-free.dev/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error al realizar la petición');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground tracking-tight">Scraper</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Introduce una URL para extraer datos</p>
      </div>

      <form onSubmit={handleSubmit} className="card-surface p-5 flex gap-3">
        <Input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://ejemplo.com"
          required
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
          {loading ? 'Scraping...' : 'Enviar'}
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="card-surface p-5">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Respuesta</h2>
          <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px] text-xs text-foreground">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
