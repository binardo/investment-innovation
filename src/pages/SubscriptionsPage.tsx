import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Subscription, SubscriptionType } from '../types';
import { fetchSubscriptions, fetchSubscriptionTypes } from '../lib/dummyData';
import { useNavigation } from '../contexts/NavigationContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { toast } from 'sonner';

export default function SubscriptionsPage() {
  const navigate = useNavigate();
  const { portfolios } = useNavigation();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState('');
  
  const [formData, setFormData] = useState({
    subscription_type_id: '',
    email: '',
    scope: 'watchlist' as 'watchlist' | 'strategy',
    strategy_code: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subs, types] = await Promise.all([
        fetchSubscriptions(),
        fetchSubscriptionTypes()
      ]);
      setSubscriptions(subs);
      setSubscriptionTypes(types);
    } catch (err) {
      console.error('Failed to load subscriptions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subscription_type_id || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newSubscription: Subscription = {
      id: Date.now().toString(),
      subscription_type_id: formData.subscription_type_id,
      email: formData.email,
      strategy_code: formData.scope === 'strategy' ? formData.strategy_code : undefined,
      watchlist_name: formData.scope === 'watchlist' ? 'My Watchlist' : undefined
    };

    setSubscriptions([...subscriptions, newSubscription]);
    toast.success('Subscription added');
    setDialogOpen(false);
    setFormData({
      subscription_type_id: '',
      email: '',
      scope: 'watchlist',
      strategy_code: ''
    });
  };

  const handleDelete = (id: string) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id));
    toast.success('Subscription removed');
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const type = subscriptionTypes.find(t => t.id === sub.subscription_type_id);
    const typeName = type?.name || '';
    const strategy = portfolios.find(p => p.strategy_code === sub.strategy_code);
    const strategyName = strategy?.strategy_name || sub.watchlist_name || '';
    
    return typeName.toLowerCase().includes(filter.toLowerCase()) ||
           sub.email.toLowerCase().includes(filter.toLowerCase()) ||
           strategyName.toLowerCase().includes(filter.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Subscription Management</h1>
                <p className="text-sm text-muted-foreground">Manage your email notification preferences</p>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subscription
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Subscription</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subscription Type</label>
                    <select
                      value={formData.subscription_type_id}
                      onChange={(e) => setFormData({ ...formData, subscription_type_id: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">Select type...</option>
                      {subscriptionTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Scope</label>
                    <select
                      value={formData.scope}
                      onChange={(e) => setFormData({ ...formData, scope: e.target.value as 'watchlist' | 'strategy' })}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="watchlist">Watchlist</option>
                      <option value="strategy">Strategy</option>
                    </select>
                  </div>
                  {formData.scope === 'strategy' && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Strategy</label>
                      <select
                        value={formData.strategy_code}
                        onChange={(e) => setFormData({ ...formData, strategy_code: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                      >
                        <option value="">Select strategy...</option>
                        {portfolios.map(portfolio => (
                          <option key={portfolio.strategy_code} value={portfolio.strategy_code}>
                            {portfolio.strategy_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Filter subscriptions..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center p-12 border rounded-lg">
            <p className="text-muted-foreground mb-4">
              No subscriptions yet. Click "Add Subscription" to get started.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-semibold">Name</th>
                  <th className="text-left p-4 font-semibold">Email</th>
                  <th className="text-left p-4 font-semibold">Strategy</th>
                  <th className="p-4 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((sub) => {
                  const type = subscriptionTypes.find(t => t.id === sub.subscription_type_id);
                  const strategy = portfolios.find(p => p.strategy_code === sub.strategy_code);
                  
                  return (
                    <tr key={sub.id} className="border-t hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-medium">{type?.name || 'Unknown'}</td>
                      <td className="p-4">{sub.email}</td>
                      <td className="p-4">{strategy?.strategy_name || sub.watchlist_name || '-'}</td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(sub.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
