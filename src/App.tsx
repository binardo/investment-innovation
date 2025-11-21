import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { Toaster } from './components/ui/sonner';
import Layout from './components/Layout';
import StrategiesListPage from './pages/StrategiesListPage';
import PortfolioHoldingsPage from './pages/PortfolioHoldingsPage';
import CompanyTimelinePage from './pages/CompanyTimelinePage';
import WatchlistPage from './pages/WatchlistPage';
import UniversePage from './pages/UniversePage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
      <AuthProvider>
        <NavigationProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/strategies" replace />} />
                <Route path="/strategies" element={<StrategiesListPage />} />
                <Route path="/strategies/:strategyCode" element={<PortfolioHoldingsPage />} />
                <Route path="/strategies/:strategyCode/universe" element={<UniversePage />} />
                <Route path="/strategies/:strategyCode/stocks/:sedol" element={<CompanyTimelinePage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="/watchlist/stocks/:sedol" element={<CompanyTimelinePage />} />
                <Route path="/subscriptions" element={<SubscriptionsPage />} />
              </Routes>
            </Layout>
            <Toaster />
          </BrowserRouter>
        </NavigationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
