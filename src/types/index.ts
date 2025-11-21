export interface Portfolio {
  strategy_code: string;
  strategy_name: string;
  description: string;
  icon_code: string;
  total_value: number;
  holdings_count: number;
}

export interface PortfolioMeta {
  strategy_name?: string;
  strategy_description?: string;
  strategy_performance_objective?: string;
  primary_benchmark_name?: string;
  representative_fund?: string;
  fund_managers?: string[];
  client_contacts?: string[];
  asset_class?: string;
  sub_asset_class?: string;
  investment_style?: string;
  investment_time_horizon?: string;
  product_group_members?: string[];
  investment_decision_making_group_members?: string[];
  portfolio_management_group_members?: string[];
}

export interface Holding {
  sedol: string;
  company_name: string;
  icon_code: string;
  weight: number;
  bench_weight?: number;
  active_weight?: number;
  sector?: string;
  country?: string;
  industry?: string;
  mcap?: number;
}

export interface CompanyDetails {
  sedol: string;
  company_name: string;
  legal_name?: string;
  short_name?: string;
  country_code?: string;
  description?: string;
}

export interface MetricDataPoint {
  date: Date;
  price?: number;
  mcap?: number;
  pe?: number;
  revenue?: number;
  [key: string]: number | Date | undefined;
}

export type EventType = 
  | 'trade'
  | 'earnings_call'
  | 'broker_report'
  | 'company_filing'
  | 'internal_research'
  | 'ai_content'
  | 'macro_event'
  | 'flh';

export interface EventDocument {
  id: string;
  date: Date;
  type: EventType;
  title: string;
  description: string;
  author: string;
  content: string;
  subtype?: string;
  variant?: string;
  isBuy?: boolean;
  color?: string;
  url?: string;
  filename?: string;
  variants?: {
    name: string;
    content: string;
    id?: string;
  }[];
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface MetricTypeDefinition {
  id: string;
  name: string;
  description: string;
  unit?: string;
}

export interface FLHIndicator {
  id: string;
  text: string;
  status?: 'green' | 'yellow' | 'orange' | 'red';
  include_in_overall_status: boolean;
  details?: string;
  status_history?: {
    date: Date;
    status: 'green' | 'yellow' | 'orange' | 'red';
    commentary?: string;
  }[];
}

export interface FLH {
  id: string;
  sedol: string;
  strategy_code: string;
  description: string;
  indicators: FLHIndicator[];
  overall_status?: 'green' | 'yellow' | 'orange' | 'red';
  last_reviewed_date?: Date;
  last_reviewed_by?: string;
  description_versions?: {
    date: Date;
    text: string;
  }[];
}

export interface PinnedItem {
  type: 'strategy' | 'company';
  id: string;
  name: string;
  strategyCode?: string;
  icon_code: string;
  sedol?: string;
}

export interface WatchlistItem {
  sedol: string;
  company_name: string;
  country?: string;
  sector?: string;
  industry?: string;
  mcap?: number;
}

export interface UniverseCompany {
  sedol: string;
  company_name: string;
  country?: string;
  sector?: string;
  industry?: string;
}

export interface SubscriptionType {
  id: string;
  name: string;
  description: string;
}

export interface Subscription {
  id: string;
  subscription_type_id: string;
  email: string;
  strategy_code?: string;
  watchlist_name?: string;
}
