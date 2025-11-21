import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CompanyDetails, MetricDataPoint, EventDocument, MetricTypeDefinition } from '../types';
import { fetchCompanyDetails, fetchPriceHistory, fetchDocuments, fetchMetricTypes } from '../lib/dummyData';
import { useNavigation } from '../contexts/NavigationContext';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { ArrowLeft, Pin, PinOff } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

export default function CompanyTimelinePage() {
  const { strategyCode, sedol } = useParams<{ strategyCode?: string; sedol: string }>();
  const navigate = useNavigate();
  const { isPinned, addPinnedItem, removePinnedItem } = useNavigation();
  
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [metricData, setMetricData] = useState<MetricDataPoint[]>([]);
  const [documents, setDocuments] = useState<EventDocument[]>([]);
  const [metricTypes, setMetricTypes] = useState<MetricTypeDefinition[]>([]);
  const [selectedMetric, setSelectedMetric] = useState('price');
  const [loading, setLoading] = useState(true);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [enabledEventTypes, setEnabledEventTypes] = useState<Set<string>>(
    new Set(['trade', 'earnings_call', 'broker_report', 'company_filing'])
  );

  const companyPinned = isPinned(sedol || '');

  useEffect(() => {
    loadData();
  }, [sedol]);

  const loadData = async () => {
    if (!sedol) return;
    
    try {
      setLoading(true);
      const [details, priceData, docs, types] = await Promise.all([
        fetchCompanyDetails(sedol),
        fetchPriceHistory(sedol),
        fetchDocuments(sedol),
        fetchMetricTypes()
      ]);
      
      setCompanyDetails(details);
      setMetricData(priceData);
      setDocuments(docs);
      setMetricTypes(types);
    } catch (err) {
      console.error('Failed to load company data', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePin = () => {
    if (!sedol || !companyDetails) return;
    
    if (companyPinned) {
      removePinnedItem(sedol);
      toast.success('Company unpinned');
    } else {
      addPinnedItem({
        type: 'company',
        id: sedol,
        name: companyDetails.company_name,
        strategyCode: strategyCode,
        icon_code: '',
        sedol: sedol
      });
      toast.success('Company pinned');
    }
  };

  const filteredDocuments = documents.filter(doc => enabledEventTypes.has(doc.type));

  const chartData = metricData.map(d => ({
    date: d.date.toLocaleDateString(),
    value: selectedMetric === 'price' ? d.price :
           selectedMetric === 'mcap' ? d.mcap :
           selectedMetric === 'pe' ? d.pe :
           d.revenue
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading company timeline...</p>
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
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate(strategyCode ? `/strategies/${strategyCode}` : '/watchlist')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{companyDetails?.company_name}</h1>
                {companyDetails?.legal_name && (
                  <p className="text-sm text-muted-foreground">
                    {companyDetails.legal_name} | {companyDetails.short_name} | {companyDetails.country_code}
                  </p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={togglePin}>
              {companyPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
            </Button>
          </div>

          {companyDetails?.description && (
            <p className="text-sm text-muted-foreground">{companyDetails.description}</p>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border rounded px-3 py-2"
            >
              {metricTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div className="border rounded-lg p-4 bg-card">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Event Filters</h3>
          <div className="flex flex-wrap gap-4">
            {['trade', 'earnings_call', 'broker_report', 'company_filing', 'internal_research', 'ai_content'].map(type => (
              <label key={type} className="flex items-center gap-2">
                <Checkbox
                  checked={enabledEventTypes.has(type)}
                  onCheckedChange={(checked) => {
                    const newTypes = new Set(enabledEventTypes);
                    if (checked) {
                      newTypes.add(type);
                    } else {
                      newTypes.delete(type);
                    }
                    setEnabledEventTypes(newTypes);
                  }}
                />
                <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Documents</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 w-12">
                    <Checkbox />
                  </th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Type</th>
                  <th className="text-left p-4 font-semibold">Title</th>
                  <th className="text-left p-4 font-semibold">Author</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-muted-foreground">
                      No documents found
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-t hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedDocs.has(doc.id)}
                          onCheckedChange={(checked) => {
                            const newSelected = new Set(selectedDocs);
                            if (checked) {
                              newSelected.add(doc.id);
                            } else {
                              newSelected.delete(doc.id);
                            }
                            setSelectedDocs(newSelected);
                          }}
                        />
                      </td>
                      <td className="p-4">{doc.date.toLocaleDateString()}</td>
                      <td className="p-4 capitalize">{doc.type.replace('_', ' ')}</td>
                      <td className="p-4 font-medium">{doc.title}</td>
                      <td className="p-4">{doc.author}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
