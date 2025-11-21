import React, { createContext, useContext, useState, useEffect } from 'react';
import { PinnedItem, Portfolio } from '../types';
import { fetchPortfolios } from '../lib/dummyData';

interface NavigationContextType {
  pinnedItems: PinnedItem[];
  portfolios: Portfolio[];
  addPinnedItem: (item: PinnedItem) => void;
  removePinnedItem: (id: string) => void;
  isPinned: (id: string) => boolean;
  getIconCodeFromStrategyCode: (strategyCode: string) => string | null;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>(() => {
    const saved = localStorage.getItem('pinnedItems');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  useEffect(() => {
    fetchPortfolios().then(setPortfolios);
  }, []);

  useEffect(() => {
    localStorage.setItem('pinnedItems', JSON.stringify(pinnedItems));
  }, [pinnedItems]);

  const addPinnedItem = (item: PinnedItem) => {
    setPinnedItems(prev => {
      if (prev.some(p => p.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removePinnedItem = (id: string) => {
    setPinnedItems(prev => prev.filter(p => p.id !== id));
  };

  const isPinned = (id: string) => {
    return pinnedItems.some(p => p.id === id);
  };

  const getIconCodeFromStrategyCode = (strategyCode: string): string | null => {
    const portfolio = portfolios.find(p => p.strategy_code === strategyCode);
    return portfolio?.icon_code || null;
  };

  return (
    <NavigationContext.Provider
      value={{
        pinnedItems,
        portfolios,
        addPinnedItem,
        removePinnedItem,
        isPinned,
        getIconCodeFromStrategyCode
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
