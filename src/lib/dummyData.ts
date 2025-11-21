import { 
  Portfolio, 
  PortfolioMeta, 
  Holding, 
  CompanyDetails, 
  MetricDataPoint, 
  EventDocument, 
  MetricTypeDefinition,
  WatchlistItem,
  UniverseCompany,
  SubscriptionType,
  Subscription
} from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockPortfolios: Portfolio[] = [
  {
    strategy_code: 'GLOBALALPHA',
    strategy_name: 'Global Alpha Strategy',
    description: 'Long-term global equity strategy focused on alpha generation',
    icon_code: 'GA001',
    total_value: 1250000000,
    holdings_count: 45
  },
  {
    strategy_code: 'EMGROWTH',
    strategy_name: 'Emerging Markets Growth',
    description: 'High-growth emerging markets equity strategy',
    icon_code: 'EM002',
    total_value: 850000000,
    holdings_count: 38
  },
  {
    strategy_code: 'TECHVALUE',
    strategy_name: 'Technology Value',
    description: 'Value-oriented technology sector strategy',
    icon_code: 'TV003',
    total_value: 620000000,
    holdings_count: 28
  },
  {
    strategy_code: 'SUSTAINABLE',
    strategy_name: 'Sustainable Equity',
    description: 'ESG-focused sustainable investment strategy',
    icon_code: 'SE004',
    total_value: 490000000,
    holdings_count: 32
  }
];

export const mockHoldings: Record<string, Holding[]> = {
  'GA001': [
    {
      sedol: '0263494',
      company_name: 'Apple Inc',
      icon_code: 'GA001',
      weight: 0.0523,
      bench_weight: 0.0450,
      active_weight: 0.0073,
      sector: 'Technology',
      country: 'United States',
      industry: 'Consumer Electronics',
      mcap: 2800000000000
    },
    {
      sedol: '2588173',
      company_name: 'Microsoft Corporation',
      icon_code: 'GA001',
      weight: 0.0489,
      bench_weight: 0.0420,
      active_weight: 0.0069,
      sector: 'Technology',
      country: 'United States',
      industry: 'Software',
      mcap: 2600000000000
    },
    {
      sedol: 'B7TL820',
      company_name: 'NVIDIA Corporation',
      icon_code: 'GA001',
      weight: 0.0445,
      bench_weight: 0.0380,
      active_weight: 0.0065,
      sector: 'Technology',
      country: 'United States',
      industry: 'Semiconductors',
      mcap: 1200000000000
    },
    {
      sedol: '2310967',
      company_name: 'Amazon.com Inc',
      icon_code: 'GA001',
      weight: 0.0412,
      bench_weight: 0.0390,
      active_weight: 0.0022,
      sector: 'Consumer Discretionary',
      country: 'United States',
      industry: 'E-commerce',
      mcap: 1500000000000
    },
    {
      sedol: 'B4TX8S1',
      company_name: 'Alphabet Inc',
      icon_code: 'GA001',
      weight: 0.0398,
      bench_weight: 0.0370,
      active_weight: 0.0028,
      sector: 'Technology',
      country: 'United States',
      industry: 'Internet Services',
      mcap: 1700000000000
    }
  ]
};

export const mockPortfolioMeta: Record<string, PortfolioMeta> = {
  'GA001': {
    strategy_name: 'Global Alpha Strategy',
    strategy_description: 'Long-term global equity strategy focused on alpha generation through fundamental analysis',
    strategy_performance_objective: 'Outperform MSCI World Index by 200-300 basis points annually',
    primary_benchmark_name: 'MSCI World Index',
    representative_fund: 'GA001',
    fund_managers: ['John Smith', 'Sarah Johnson'],
    client_contacts: ['Michael Brown', 'Emily Davis'],
    asset_class: 'Equity',
    sub_asset_class: 'Global Equity',
    investment_style: 'Growth at Reasonable Price',
    investment_time_horizon: 'Long-term (5+ years)',
    product_group_members: ['Alice Wilson', 'Bob Martinez', 'Carol Lee'],
    investment_decision_making_group_members: ['David Chen', 'Emma Thompson'],
    portfolio_management_group_members: ['John Smith', 'Sarah Johnson', 'Tom Anderson']
  }
};

export const mockCompanyDetails: Record<string, CompanyDetails> = {
  '0263494': {
    sedol: '0263494',
    company_name: 'Apple Inc',
    legal_name: 'Apple Inc.',
    short_name: 'Apple',
    country_code: 'US',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.'
  }
};

export const mockMetricData: Record<string, MetricDataPoint[]> = {
  '0263494': generateMockPriceData()
};

function generateMockPriceData(): MetricDataPoint[] {
  const data: MetricDataPoint[] = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  
  let price = 150;
  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    price += (Math.random() - 0.5) * 5;
    price = Math.max(100, Math.min(200, price));
    
    data.push({
      date,
      price,
      mcap: price * 16000000000,
      pe: 25 + (Math.random() - 0.5) * 5,
      revenue: 380000000000 + (Math.random() - 0.5) * 20000000000
    });
  }
  
  return data;
}

export const mockDocuments: Record<string, EventDocument[]> = {
  '0263494': [
    {
      id: 'doc1',
      date: new Date('2024-10-15'),
      type: 'earnings_call',
      title: 'Q3 2024 Earnings Call',
      description: 'Quarterly earnings call transcript',
      author: 'Apple Inc',
      content: 'Q3 2024 earnings call transcript content...'
    },
    {
      id: 'doc2',
      date: new Date('2024-09-20'),
      type: 'broker_report',
      title: 'Apple: Strong iPhone 15 Demand',
      description: 'Analyst report on iPhone 15 sales',
      author: 'Goldman Sachs',
      content: 'Analyst report content...'
    },
    {
      id: 'doc3',
      date: new Date('2024-08-10'),
      type: 'company_filing',
      title: '10-Q Filing',
      description: 'Quarterly SEC filing',
      author: 'Apple Inc',
      content: '10-Q filing content...'
    }
  ]
};

export const mockMetricTypes: MetricTypeDefinition[] = [
  { id: 'price', name: 'Price', description: 'Stock price', unit: '$' },
  { id: 'mcap', name: 'Market Cap', description: 'Market capitalization', unit: '$' },
  { id: 'pe', name: 'P/E Ratio', description: 'Price to earnings ratio', unit: '' },
  { id: 'revenue', name: 'Revenue', description: 'Total revenue', unit: '$' }
];

export const mockWatchlist: WatchlistItem[] = [
  {
    sedol: '0263494',
    company_name: 'Apple Inc',
    country: 'United States',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    mcap: 2800000000000
  },
  {
    sedol: '2588173',
    company_name: 'Microsoft Corporation',
    country: 'United States',
    sector: 'Technology',
    industry: 'Software',
    mcap: 2600000000000
  }
];

export const mockUniverse: Record<string, UniverseCompany[]> = {
  'GLOBALALPHA': [
    {
      sedol: '0263494',
      company_name: 'Apple Inc',
      country: 'United States',
      sector: 'Technology',
      industry: 'Consumer Electronics'
    },
    {
      sedol: '2588173',
      company_name: 'Microsoft Corporation',
      country: 'United States',
      sector: 'Technology',
      industry: 'Software'
    },
    {
      sedol: 'B7TL820',
      company_name: 'NVIDIA Corporation',
      country: 'United States',
      sector: 'Technology',
      industry: 'Semiconductors'
    },
    {
      sedol: '2310967',
      company_name: 'Amazon.com Inc',
      country: 'United States',
      sector: 'Consumer Discretionary',
      industry: 'E-commerce'
    }
  ]
};

export const mockSubscriptionTypes: SubscriptionType[] = [
  {
    id: 'daily_summary',
    name: 'Daily Summary',
    description: 'Daily summary of portfolio activity and market updates'
  },
  {
    id: 'trade_alerts',
    name: 'Trade Alerts',
    description: 'Real-time alerts for portfolio trades'
  },
  {
    id: 'research_updates',
    name: 'Research Updates',
    description: 'New research reports and analysis'
  }
];

export const mockSubscriptions: Subscription[] = [];

export async function fetchPortfolios(): Promise<Portfolio[]> {
  await delay(200);
  return mockPortfolios;
}

export async function fetchHoldings(iconCode: string): Promise<Holding[]> {
  await delay(300);
  return mockHoldings[iconCode] || [];
}

export async function fetchPortfolioMeta(iconCode: string): Promise<PortfolioMeta> {
  await delay(200);
  return mockPortfolioMeta[iconCode] || {};
}

export async function fetchCompanyDetails(sedol: string): Promise<CompanyDetails> {
  await delay(200);
  return mockCompanyDetails[sedol] || {
    sedol,
    company_name: 'Unknown Company'
  };
}

export async function fetchPriceHistory(sedol: string): Promise<MetricDataPoint[]> {
  await delay(300);
  return mockMetricData[sedol] || [];
}

export async function fetchDocuments(sedol: string): Promise<EventDocument[]> {
  await delay(250);
  return mockDocuments[sedol] || [];
}

export async function fetchMetricTypes(): Promise<MetricTypeDefinition[]> {
  await delay(100);
  return mockMetricTypes;
}

export async function fetchWatchlist(): Promise<WatchlistItem[]> {
  await delay(200);
  return mockWatchlist;
}

export async function fetchUniverse(strategyCode: string): Promise<UniverseCompany[]> {
  await delay(300);
  return mockUniverse[strategyCode] || [];
}

export async function fetchSubscriptionTypes(): Promise<SubscriptionType[]> {
  await delay(150);
  return mockSubscriptionTypes;
}

export async function fetchSubscriptions(): Promise<Subscription[]> {
  await delay(200);
  return mockSubscriptions;
}
