import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CompanyDetails, MetricDataPoint, EventDocument, MetricTypeDefinition } from '../types';
import { fetchCompanyDetails, fetchPriceHistory, fetchDocuments, fetchMetricTypes } from '../lib/dummyData';
import { useNavigation } from '../contexts/NavigationContext';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { ArrowLeft, Pin, PinOff } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush, ReferenceLine, ComposedChart, Scatter } from 'recharts';
import { toast } from 'sonner';

interface ChartDataPoint {
  date: Date;
  dateNum: number;
  label: string;
  value: number;
}

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
  const [xDomain, setXDomain] = useState<[number, number] | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

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
      
      if (priceData.length > 0) {
        const minDate = Math.min(...priceData.map(d => d.date.getTime()));
        const maxDate = Math.max(...priceData.map(d => d.date.getTime()));
        setXDomain([minDate, maxDate]);
      }
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

  const chartData: ChartDataPoint[] = metricData.map(d => ({
    date: d.date,
    dateNum: d.date.getTime(),
    label: d.date.toLocaleDateString(),
    value: selectedMetric === 'price' ? d.price :
           selectedMetric === 'mcap' ? d.mcap :
           selectedMetric === 'pe' ? d.pe :
           d.revenue || 0
  }));

  const markerPoints = filteredDocuments.map(doc => ({
    x: doc.date.getTime(),
    y: 0,
    type: doc.type,
    id: doc.id,
    title: doc.title
  }));

  const handleBrushChange = (range: { startIndex?: number; endIndex?: number }) => {
    if (range.startIndex !== undefined && range.endIndex !== undefined && chartData.length > 0) {
      const newMin = chartData[range.startIndex].dateNum;
      const newMax = chartData[range.endIndex].dateNum;
      setXDomain([newMin, newMax]);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!xDomain || chartData.length === 0) return;
    
    e.preventDefault();
    const [currentMin, currentMax] = xDomain;
    const currentWidth = currentMax - currentMin;
    const center = (currentMin + currentMax) / 2;
    
    const zoomFactor = e.deltaY > 0 ? 1.2 : 0.8;
    const newWidth = currentWidth * zoomFactor;
    
    const dataMin = Math.min(...chartData.map(d => d.dateNum));
    const dataMax = Math.max(...chartData.map(d => d.dateNum));
    
    let newMin = center - newWidth / 2;
    let newMax = center + newWidth / 2;
    
    if (newMin < dataMin) {
      newMin = dataMin;
      newMax = Math.min(dataMax, newMin + newWidth);
    }
    if (newMax > dataMax) {
      newMax = dataMax;
      newMin = Math.max(dataMin, newMax - newWidth);
    }
    
    setXDomain([newMin, newMax]);
  };

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      trade: '#F97316',
      earnings_call: '#EC4899',
      broker_report: '#06B6D4',
      company_filing: '#EAB308',
      internal_research: '#3B82F6',
      ai_content: '#A855F7'
    };
    return colors[type] || '#6B7280';
  };

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
              className="border rounded-md px-3 py-2 bg-background text-sm font-medium"
            >
              {metricTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            {xDomain && (
              <span className="text-sm text-muted-foreground">
                {new Date(xDomain[0]).toLocaleDateString()} - {new Date(xDomain[1]).toLocaleDateString()}
              </span>
            )}
          </div>

          <div 
            ref={chartContainerRef}
            onWheel={handleWheel}
            className="border rounded-lg p-6 bg-card shadow-sm"
          >
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} syncId="timeline">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  type="number"
                  dataKey="dateNum" 
                  domain={xDomain || ['auto', 'auto']}
                  tickFormatter={(ts) => new Date(ts).toLocaleDateString()}
                  stroke="#6B7280"
                />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  labelFormatter={(ts) => new Date(ts as number).toLocaleDateString()}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                  dot={false}
                />
                {filteredDocuments.map(doc => (
                  <ReferenceLine 
                    key={doc.id}
                    x={doc.date.getTime()}
                    stroke={getEventColor(doc.type)}
                    strokeDasharray="3 3"
                    strokeOpacity={0.5}
                  />
                ))}
                <Brush 
                  dataKey="dateNum"
                  height={30}
                  stroke="#6366F1"
                  fill="#F3F4F6"
                  onChange={handleBrushChange}
                  tickFormatter={(ts) => new Date(ts).toLocaleDateString()}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-2">
              <ResponsiveContainer width="100%" height={60}>
                <ComposedChart data={markerPoints} syncId="timeline">
                  <XAxis 
                    type="number"
                    dataKey="x"
                    domain={xDomain || ['auto', 'auto']}
                    hide
                  />
                  <YAxis type="number" domain={[0, 1]} hide />
                  <Scatter 
                    data={markerPoints}
                    shape={(props: any) => {
                      const { cx, cy, payload } = props;
                      const color = getEventColor(payload.type);
                      return (
                        <g>
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r={6} 
                            fill={color}
                            stroke="#fff"
                            strokeWidth={2}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              const doc = documents.find(d => d.id === payload.id);
                              if (doc) {
                                toast.info(`Document: ${doc.title}`);
                              }
                            }}
                          />
                          <title>{payload.title}</title>
                        </g>
                      );
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Event Filters</h3>
          <div className="flex flex-wrap gap-3">
            {['trade', 'earnings_call', 'broker_report', 'company_filing', 'internal_research', 'ai_content'].map(type => (
              <label 
                key={type} 
                className="flex items-center gap-2 px-3 py-2 rounded-md border bg-card hover:bg-accent cursor-pointer transition-colors"
              >
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
                <span 
                  className="text-sm font-medium capitalize"
                  style={{ color: getEventColor(type) }}
                >
                  {type.replace('_', ' ')}
                </span>
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
