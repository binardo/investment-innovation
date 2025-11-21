import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, List, Mail, ChevronLeft, ChevronRight, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface NavigationSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function NavigationSidebar({ open, onToggle }: NavigationSidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { pinnedItems, portfolios } = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { path: '/strategies', label: 'Home', icon: Home },
    { path: '/watchlist', label: 'Watchlist', icon: List },
    { path: '/subscriptions', label: 'Subscriptions', icon: Mail },
  ];

  const filteredPortfolios = searchQuery
    ? portfolios.filter(p => 
        p.strategy_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const pinnedStrategies = pinnedItems.filter(item => item.type === 'strategy');
  const pinnedCompanies = pinnedItems.filter(item => item.type === 'company');

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 flex flex-col ${
        open ? 'w-[337px]' : 'w-[81px]'
      }`}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        {open && <h2 className="text-lg font-semibold">Investment Timeline</h2>}
        <Button variant="ghost" size="icon" onClick={onToggle}>
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full ${open ? 'justify-start' : 'justify-center'}`}
                >
                  <Icon className="h-4 w-4" />
                  {open && <span className="ml-2">{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </div>

        {open && (
          <div className="p-4 space-y-4">
            <div>
              <Input
                placeholder="Search strategies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && filteredPortfolios.length > 0 && (
                <div className="mt-2 space-y-1">
                  {filteredPortfolios.map((portfolio) => (
                    <Link
                      key={portfolio.strategy_code}
                      to={`/strategies/${portfolio.strategy_code}`}
                      onClick={() => setSearchQuery('')}
                    >
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        {portfolio.strategy_name}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {pinnedStrategies.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Pinned Strategies</h3>
                <div className="space-y-1">
                  {pinnedStrategies.map((item) => (
                    <Link key={item.id} to={`/strategies/${item.strategyCode}`}>
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {pinnedCompanies.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Pinned Companies</h3>
                <div className="space-y-1">
                  {pinnedCompanies.map((item) => (
                    <Link 
                      key={item.id} 
                      to={item.strategyCode 
                        ? `/strategies/${item.strategyCode}/stocks/${item.sedol}`
                        : `/watchlist/stocks/${item.sedol}`
                      }
                    >
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={`w-full ${open ? 'justify-start' : 'justify-center'}`}>
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user?.initials}</AvatarFallback>
              </Avatar>
              {open && (
                <div className="ml-2 text-left">
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className="text-xs text-muted-foreground">{user?.email}</div>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
