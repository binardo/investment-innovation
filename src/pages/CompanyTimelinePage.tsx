import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CompanyDetails, MetricDataPoint, EventDocument, MetricTypeDefinition } from '../types';
import { fetchCompanyDetails, fetchPriceHistory, fetchDocuments, fetchMetricTypes } from '../lib/dummyData';
import { useNavigation } from '../contexts/NavigationContext';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { ArrowLeft, Pin, PinOff, DollarSign, FileText, Mic, BarChart2, FlaskConical, Sparkles } from 'lucide-react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Scatter } from 'recharts';
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; domain: [number, number] } | null>(null);
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
        const priceMin = Math.min(...priceData.map(d => d.date.getTime()));
        const priceMax = Math.max(...priceData.map(d => d.date.getTime()));
        
        const docTimes = docs.map(d => d.date.getTime());
        const docMin = docTimes.length ? Math.min(...docTimes) : priceMin;
        const docMax = docTimes.length ? Math.max(...docTimes) : priceMax;
        
        const overallMin = Math.min(priceMin, docMin);
        const overallMax = Math.max(priceMax, docMax);
        
        setXDomain([overallMin, overallMax]);
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

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      trade: '#FDBA74',          // pastel orange (orange-300)
      earnings_call: '#F9A8D4',  // pastel pink (pink-300)
      broker_report: '#A5F3FC',  // pastel cyan (cyan-200)
      company_filing: '#FDE68A', // pastel amber/yellow (amber-200)
      internal_research: '#93C5FD', // pastel blue (blue-300)
      ai_content: '#C4B5FD'      // pastel purple/violet-300
    };
    return colors[type] || '#6B7280';
  };

  const getEventLevel = (type: string): number => {
    const levels: Record<string, number> = {
      trade: 1,
      earnings_call: 2,
      broker_report: 3,
      company_filing: 4,
      internal_research: 5,
      ai_content: 6
    };
    return levels[type] || 3;
  };

  const getEventIcon = (type: string) => {
    const icons = {
      trade: DollarSign,
      earnings_call: Mic,
      broker_report: BarChart2,
      company_filing: FileText,
      internal_research: FlaskConical,
      ai_content: Sparkles
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const findPriceAtDate = (dateMs: number, chartData: ChartDataPoint[]): number | null => {
    if (chartData.length === 0) return null;
    
    // Find the closest data point to this date
    let closest = chartData[0];
    let minDiff = Math.abs(chartData[0].dateNum - dateMs);
    
    for (const point of chartData) {
      const diff = Math.abs(point.dateNum - dateMs);
      if (diff < minDiff) {
        minDiff = diff;
        closest = point;
      }
    }
    
    return closest.value;
  };

  const fullChartData: ChartDataPoint[] = useMemo(() =>
    metricData.map(d => ({
      date: d.date,
      dateNum: d.date.getTime(),
      label: d.date.toLocaleDateString(),
      value: (selectedMetric === 'price' ? d.price :
             selectedMetric === 'mcap' ? d.mcap :
             selectedMetric === 'pe' ? d.pe :
             d.revenue) || 0
    })),
    [metricData, selectedMetric]
  );

  const visibleData = useMemo(() => {
    if (!xDomain || fullChartData.length === 0) return fullChartData;
    const [min, max] = xDomain;
    return fullChartData.filter(d => d.dateNum >= min && d.dateNum <= max);
  }, [fullChartData, xDomain]);

  const filteredDocuments = useMemo(() => 
    documents.filter(doc => enabledEventTypes.has(doc.type)),
    [documents, enabledEventTypes]
  );

  const visibleDocs = useMemo(() => {
    if (!xDomain) return filteredDocuments;
    const [min, max] = xDomain;
    return filteredDocuments.filter(doc => {
      const docTime = doc.date.getTime();
      return docTime >= min && docTime <= max;
    });
  }, [filteredDocuments, xDomain]);

  const markerPoints = useMemo(() => 
    visibleDocs.map(doc => ({
      x: doc.date.getTime(),
      y: getEventLevel(doc.type),
      type: doc.type,
      id: doc.id,
      title: doc.title
    })),
    [visibleDocs]
  );


  const handleWheel = (e: React.WheelEvent) => {
    if (!xDomain || fullChartData.length === 0) return;
    
    e.preventDefault();
    const [currentMin, currentMax] = xDomain;
    const currentWidth = currentMax - currentMin;
    const center = (currentMin + currentMax) / 2;
    
    const zoomFactor = e.deltaY > 0 ? 1.2 : 0.8;
    const newWidth = currentWidth * zoomFactor;
    
    const dataMin = Math.min(...fullChartData.map(d => d.dateNum));
    const dataMax = Math.max(...fullChartData.map(d => d.dateNum));
    
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!xDomain) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, domain: xDomain });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !chartContainerRef.current) return;
    
    const containerWidth = chartContainerRef.current.clientWidth - 100;
    const deltaPx = e.clientX - dragStart.x;
    const [startMin, startMax] = dragStart.domain;
    const domainWidth = startMax - startMin;
    const timeDelta = (deltaPx / containerWidth) * domainWidth;
    
    const dataMin = Math.min(...fullChartData.map(d => d.dateNum));
    const dataMax = Math.max(...fullChartData.map(d => d.dateNum));
    
    let newMin = startMin - timeDelta;
    let newMax = startMax - timeDelta;
    
    if (newMin < dataMin) {
      newMin = dataMin;
      newMax = dataMin + domainWidth;
    }
    if (newMax > dataMax) {
      newMax = dataMax;
      newMin = dataMax - domainWidth;
    }
    
    setXDomain([newMin, newMax]);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (fullChartData.length === 0) return;
                  const maxDate = Math.max(...fullChartData.map(d => d.dateNum));
                  const oneYearAgo = maxDate - (365 * 24 * 60 * 60 * 1000);
                  const minDate = Math.min(...fullChartData.map(d => d.dateNum));
                  setXDomain([Math.max(oneYearAgo, minDate), maxDate]);
                }}
              >
                1Y
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (fullChartData.length === 0) return;
                  const maxDate = Math.max(...fullChartData.map(d => d.dateNum));
                  const fiveYearsAgo = maxDate - (5 * 365 * 24 * 60 * 60 * 1000);
                  const minDate = Math.min(...fullChartData.map(d => d.dateNum));
                  setXDomain([Math.max(fiveYearsAgo, minDate), maxDate]);
                }}
              >
                5Y
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (fullChartData.length === 0) return;
                  const priceMin = Math.min(...fullChartData.map(d => d.dateNum));
                  const priceMax = Math.max(...fullChartData.map(d => d.dateNum));
                  
                  const docTimes = documents.map(d => d.date.getTime());
                  const docMin = docTimes.length ? Math.min(...docTimes) : priceMin;
                  const docMax = docTimes.length ? Math.max(...docTimes) : priceMax;
                  
                  const overallMin = Math.min(priceMin, docMin);
                  const overallMax = Math.max(priceMax, docMax);
                  
                  setXDomain([overallMin, overallMax]);
                }}
              >
                ALL
              </Button>
            </div>
          </div>

          <div 
            ref={chartContainerRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="border rounded-lg p-6 bg-card shadow-sm"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={visibleData} syncId="timeline">
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
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
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="none"
                  fill="url(#priceGradient)"
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                  dot={false}
                />
                {visibleDocs
                  .filter(doc => doc.type === 'trade' || doc.type === 'broker_report')
                  .map(doc => {
                    const x = doc.date.getTime();
                    const chartData = visibleData.length > 0 ? visibleData : fullChartData;
                    
                    // Only draw connector lines for documents within the price data range
                    if (chartData.length === 0) return null;
                    const priceDataMin = chartData[0].dateNum;
                    const priceDataMax = chartData[chartData.length - 1].dateNum;
                    
                    // Skip if document is outside the price data range
                    if (x < priceDataMin || x > priceDataMax) return null;
                    
                    const priceAtDate = findPriceAtDate(x, chartData);
                    if (priceAtDate === null) return null;
                    
                    return (
                      <ReferenceLine 
                        key={doc.id}
                        segment={[
                          { x, y: 0 },
                          { x, y: priceAtDate }
                        ]}
                        stroke={getEventColor(doc.type)}
                        strokeDasharray="3 3"
                        strokeOpacity={0.25}
                      />
                    );
                  })
                  .filter(line => line !== null)}
              </ComposedChart>
            </ResponsiveContainer>

            <div className="mt-4 border-t pt-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">Event Timeline</div>
              <ResponsiveContainer width="100%" height={100}>
                <ComposedChart data={markerPoints} syncId="timeline" margin={{ top: 5, bottom: 5, left: 50, right: 50 }}>
                  <XAxis 
                    type="number"
                    dataKey="x"
                    domain={xDomain || ['auto', 'auto']}
                    hide
                  />
                  <YAxis type="number" dataKey="y" domain={[0.5, 6.5]} hide />
                  <Scatter 
                    data={markerPoints}
                    dataKey="y"
                    isAnimationActive={false}
                    shape={(props: unknown) => {
                      const { cx, cy, payload } = props as { cx?: number; cy?: number; payload?: { type: string; id: string; title: string } };
                      if (!cx || !cy || !payload) return <></>;
                      const color = getEventColor(payload.type);
                      const Icon = getEventIcon(payload.type);
                      const isConnectorType = payload.type === 'trade' || payload.type === 'broker_report';
                      return (
                        <g>
                          {isConnectorType && (
                            <line
                              x1={cx}
                              x2={cx}
                              y1={0}
                              y2={cy}
                              stroke={color}
                              strokeDasharray="3 3"
                              strokeOpacity={0.25}
                            />
                          )}
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r={10} 
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
                          <g transform={`translate(${cx - 6}, ${cy - 6})`}>
                            <Icon width={12} height={12} color="#ffffff" strokeWidth={2.5} />
                          </g>
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
            {['trade', 'earnings_call', 'broker_report', 'company_filing', 'internal_research', 'ai_content'].map(type => {
              const isEnabled = enabledEventTypes.has(type);
              const color = getEventColor(type);
              const Icon = getEventIcon(type);
              return (
                <button
                  key={type}
                  onClick={() => {
                    const newTypes = new Set(enabledEventTypes);
                    if (isEnabled) {
                      newTypes.delete(type);
                    } else {
                      newTypes.add(type);
                    }
                    setEnabledEventTypes(newTypes);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 flex items-center gap-2 ${
                    isEnabled
                      ? 'shadow-sm'
                      : 'bg-background hover:bg-accent border-border'
                  }`}
                  style={
                    isEnabled
                      ? {
                          backgroundColor: `${color}15`,
                          borderColor: color,
                          color: color
                        }
                      : {}
                  }
                  role="checkbox"
                  aria-checked={isEnabled}
                >
                  <Icon className="h-4 w-4" />
                  {type.replace('_', ' ')}
                </button>
              );
            })}
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
