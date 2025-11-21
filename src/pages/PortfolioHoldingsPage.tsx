import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Holding, PortfolioMeta } from '../types';
import { fetchHoldings, fetchPortfolioMeta } from '../lib/dummyData';
import { useNavigation } from '../contexts/NavigationContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { ArrowLeft, ArrowUpDown, MoreVertical, Pin, PinOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function PortfolioHoldingsPage() {
  const { strategyCode } = useParams<{ strategyCode: string }>();
  const navigate = useNavigate();
  const { getIconCodeFromStrategyCode, isPinned, addPinnedItem, removePinnedItem, portfolios } = useNavigation();
  
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [meta, setMeta] = useState<PortfolioMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [selectedHoldings, setSelectedHoldings] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof Holding>('active_weight');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const portfolio = portfolios.find(p => p.strategy_code === strategyCode);
  const strategyPinned = isPinned(strategyCode || '');

  useEffect(() => {
    loadData();
  }, [strategyCode]);

  const loadData = async () => {
    if (!strategyCode) return;
    
    try {
      setLoading(true);
      const iconCode = getIconCodeFromStrategyCode(strategyCode);
      if (!iconCode) {
        setError('Strategy not found');
        return;
      }
      
      const [holdingsData, metaData] = await Promise.all([
        fetchHoldings(iconCode),
        fetchPortfolioMeta(iconCode)
      ]);
      
      setHoldings(holdingsData);
      setMeta(metaData);
    } catch (err) {
      setError('Failed to load holdings');
    } finally {
      setLoading(false);
    }
  };

  const togglePin = () => {
    if (!strategyCode || !portfolio) return;
    
    if (strategyPinned) {
      removePinnedItem(strategyCode);
      toast.success('Strategy unpinned');
    } else {
      addPinnedItem({
        type: 'strategy',
        id: strategyCode,
        name: portfolio.strategy_name,
        strategyCode: strategyCode,
        icon_code: portfolio.icon_code
      });
      toast.success('Strategy pinned');
    }
  };

  const filteredHoldings = holdings
    .filter(h => 
      h.company_name.toLowerCase().includes(filter.toLowerCase()) ||
      h.sedol.toLowerCase().includes(filter.toLowerCase()) ||
      h.sector?.toLowerCase().includes(filter.toLowerCase()) ||
      h.country?.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return sortDir === 'asc' ? comparison : -comparison;
    });

  const toggleSort = (field: keyof Holding) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading holdings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => navigate('/strategies')}>Back to Strategies</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/strategies')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold">{meta?.strategy_name || portfolio?.strategy_name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate(`/strategies/${strategyCode}/universe`)}>
                Universe
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={togglePin}>
                    {strategyPinned ? <PinOff className="mr-2 h-4 w-4" /> : <Pin className="mr-2 h-4 w-4" />}
                    {strategyPinned ? 'Unpin' : 'Pin'} Strategy
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {meta && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Representative Portfolio: {meta.representative_fund}</p>
              <p>{meta.investment_style} - {meta.asset_class} - {meta.sub_asset_class}</p>
              {meta.primary_benchmark_name && <p>Benchmark: {meta.primary_benchmark_name}</p>}
              {meta.portfolio_management_group_members && meta.portfolio_management_group_members.length > 0 && (
                <p>Portfolio Managers: {meta.portfolio_management_group_members.join(', ')}</p>
              )}
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center gap-4">
          <Input
            placeholder="Filter holdings..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          {selectedHoldings.size > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedHoldings.size} selected
            </span>
          )}
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="p-4 w-12">
                  <Checkbox />
                </th>
                <th className="text-left p-4">
                  <Button variant="ghost" onClick={() => toggleSort('company_name')} className="font-semibold">
                    Company
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-left p-4 font-semibold">SEDOL</th>
                <th className="text-left p-4 font-semibold">Sector</th>
                <th className="text-left p-4 font-semibold">Country</th>
                <th className="text-right p-4">
                  <Button variant="ghost" onClick={() => toggleSort('weight')} className="font-semibold">
                    Weight
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-right p-4">
                  <Button variant="ghost" onClick={() => toggleSort('bench_weight')} className="font-semibold">
                    Benchmark Wt
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
                <th className="text-right p-4">
                  <Button variant="ghost" onClick={() => toggleSort('active_weight')} className="font-semibold">
                    Active Wt
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHoldings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-muted-foreground">
                    {filter ? 'No holdings match your filter' : 'No holdings found'}
                  </td>
                </tr>
              ) : (
                filteredHoldings.map((holding) => (
                  <tr
                    key={holding.sedol}
                    className="border-t hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/strategies/${strategyCode}/stocks/${holding.sedol}`)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedHoldings.has(holding.sedol)}
                        onCheckedChange={(checked) => {
                          const newSelected = new Set(selectedHoldings);
                          if (checked) {
                            newSelected.add(holding.sedol);
                          } else {
                            newSelected.delete(holding.sedol);
                          }
                          setSelectedHoldings(newSelected);
                        }}
                      />
                    </td>
                    <td className="p-4 font-medium">{holding.company_name}</td>
                    <td className="p-4">{holding.sedol}</td>
                    <td className="p-4">{holding.sector || '-'}</td>
                    <td className="p-4">{holding.country || '-'}</td>
                    <td className="p-4 text-right">
                      {holding.weight != null ? `${(holding.weight * 100).toFixed(2)}%` : '-'}
                    </td>
                    <td className="p-4 text-right">
                      {holding.bench_weight != null ? `${(holding.bench_weight * 100).toFixed(2)}%` : '-'}
                    </td>
                    <td className="p-4 text-right">
                      {holding.active_weight != null ? `${(holding.active_weight * 100).toFixed(2)}%` : '-'}
                    </td>
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
