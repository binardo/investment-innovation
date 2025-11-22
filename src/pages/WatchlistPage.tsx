import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WatchlistItem } from '../types';
import { fetchWatchlist } from '../lib/dummyData';
import { Checkbox } from '../components/ui/checkbox';

export default function WatchlistPage() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      const data = await fetchWatchlist();
      setWatchlist(data);
    } catch (err) {
      console.error('Failed to load watchlist', err);
    } finally {
      setLoading(false);
    }
  };

  const formatMCap = (mcap?: number) => {
    if (!mcap) return '-';
    if (mcap >= 1e12) return `$${(mcap / 1e12).toFixed(1)}T`;
    if (mcap >= 1e9) return `$${(mcap / 1e9).toFixed(1)}B`;
    if (mcap >= 1e6) return `$${(mcap / 1e6).toFixed(1)}M`;
    return `$${mcap}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Watchlist</h1>

        {watchlist.length === 0 ? (
          <div className="text-center p-12 border rounded-lg">
            <p className="text-muted-foreground mb-4">
              Your watchlist is empty. Add stocks from the universe page.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 w-12">
                    <Checkbox />
                  </th>
                  <th className="text-left p-4 font-semibold">Name</th>
                  <th className="text-left p-4 font-semibold">SEDOL</th>
                  <th className="text-left p-4 font-semibold">Country</th>
                  <th className="text-left p-4 font-semibold">Sector</th>
                  <th className="text-left p-4 font-semibold">Industry</th>
                  <th className="text-right p-4 font-semibold">MCap</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((item) => (
                  <tr
                    key={item.sedol}
                    className="border-t hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/watchlist/stocks/${item.sedol}`)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedItems.has(item.sedol)}
                        onCheckedChange={(checked) => {
                          const newSelected = new Set(selectedItems);
                          if (checked) {
                            newSelected.add(item.sedol);
                          } else {
                            newSelected.delete(item.sedol);
                          }
                          setSelectedItems(newSelected);
                        }}
                      />
                    </td>
                    <td className="p-4 font-medium">{item.company_name}</td>
                    <td className="p-4">{item.sedol}</td>
                    <td className="p-4">{item.country || '-'}</td>
                    <td className="p-4">{item.sector || '-'}</td>
                    <td className="p-4">{item.industry || '-'}</td>
                    <td className="p-4 text-right">{formatMCap(item.mcap)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
