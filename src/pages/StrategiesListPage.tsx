import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Portfolio } from '../types';
import { fetchPortfolios } from '../lib/dummyData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowUpDown } from 'lucide-react';

export default function StrategiesListPage() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      setLoading(true);
      const data = await fetchPortfolios();
      setPortfolios(data);
    } catch (err) {
      setError('Failed to load strategies');
    } finally {
      setLoading(false);
    }
  };

  const filteredPortfolios = portfolios
    .filter(p => 
      p.strategy_name.toLowerCase().includes(filter.toLowerCase()) ||
      p.description.toLowerCase().includes(filter.toLowerCase()) ||
      p.strategy_code.toLowerCase().includes(filter.toLowerCase()) ||
      p.icon_code.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const comparison = a.strategy_name.localeCompare(b.strategy_name);
      return sortDir === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading strategies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadPortfolios}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Investment Strategies</h1>
        
        <div className="mb-6 flex items-center gap-4">
          <Input
            placeholder="Filter strategies..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          <span className="text-sm text-muted-foreground">
            {filteredPortfolios.length} {filteredPortfolios.length === 1 ? 'strategy' : 'strategies'}
          </span>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4">
                  <Button
                    variant="ghost"
                    onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                    className="font-semibold"
                  >
                    Strategy Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-left p-4 font-semibold">Description</th>
                <th className="text-right p-4 font-semibold">Holdings</th>
              </tr>
            </thead>
            <tbody>
              {filteredPortfolios.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center p-8 text-muted-foreground">
                    No strategies found
                  </td>
                </tr>
              ) : (
                filteredPortfolios.map((portfolio) => (
                  <tr
                    key={portfolio.strategy_code}
                    className="border-t hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/strategies/${portfolio.strategy_code}`)}
                  >
                    <td className="p-4 font-medium">{portfolio.strategy_name}</td>
                    <td className="p-4 text-muted-foreground">{portfolio.description}</td>
                    <td className="p-4 text-right">{portfolio.holdings_count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
