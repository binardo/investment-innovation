import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UniverseCompany } from '../types';
import { fetchUniverse } from '../lib/dummyData';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function UniversePage() {
  const { strategyCode } = useParams<{ strategyCode: string }>();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<UniverseCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const [countryFilter, setCountryFilter] = useState<Set<string>>(new Set());
  const [sectorFilter, setSectorFilter] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadUniverse();
  }, [strategyCode]);

  const loadUniverse = async () => {
    if (!strategyCode) return;
    
    try {
      setLoading(true);
      const data = await fetchUniverse(strategyCode);
      setCompanies(data);
    } catch (err) {
      console.error('Failed to load universe', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    if (countryFilter.size > 0 && company.country && !countryFilter.has(company.country)) {
      return false;
    }
    if (sectorFilter.size > 0 && company.sector && !sectorFilter.has(company.sector)) {
      return false;
    }
    return true;
  });

  const uniqueCountries = Array.from(new Set(companies.map(c => c.country).filter(Boolean)));
  const uniqueSectors = Array.from(new Set(companies.map(c => c.sector).filter(Boolean)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading universe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/strategies/${strategyCode}`)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Investment Universe</h1>
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Country</label>
            <select
              multiple
              className="border rounded px-3 py-2 min-w-[200px]"
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                setCountryFilter(new Set(selected));
              }}
            >
              {uniqueCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Sector</label>
            <select
              multiple
              className="border rounded px-3 py-2 min-w-[200px]"
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                setSectorFilter(new Set(selected));
              }}
            >
              {uniqueSectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedCompanies.size > 0 && (
          <div className="mb-4 flex gap-2">
            <Button onClick={() => {
              toast.success(`Added ${selectedCompanies.size} companies to watchlist`);
              setSelectedCompanies(new Set());
            }}>
              Add to Watchlist
            </Button>
            <Button variant="outline" onClick={() => setSelectedCompanies(new Set())}>
              Clear Selection
            </Button>
          </div>
        )}

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
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-muted-foreground">
                    No companies match your filters
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr
                    key={company.sedol}
                    className="border-t hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/strategies/${strategyCode}/stocks/${company.sedol}`)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedCompanies.has(company.sedol)}
                        onCheckedChange={(checked) => {
                          const newSelected = new Set(selectedCompanies);
                          if (checked) {
                            newSelected.add(company.sedol);
                          } else {
                            newSelected.delete(company.sedol);
                          }
                          setSelectedCompanies(newSelected);
                        }}
                      />
                    </td>
                    <td className="p-4 font-medium">{company.company_name}</td>
                    <td className="p-4">{company.sedol}</td>
                    <td className="p-4">{company.country || '-'}</td>
                    <td className="p-4">{company.sector || '-'}</td>
                    <td className="p-4">{company.industry || '-'}</td>
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
