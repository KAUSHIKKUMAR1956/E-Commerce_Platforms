import { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, Users, Settings, Package, TrendingUp, Loader2 } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statsData, setStatsData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/orders/all')
        ]);
        setStatsData(statsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const stats = [
    { label: 'Total Revenue', value: statsData ? `$${statsData.totalRevenue.toFixed(2)}` : '$0.00', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Total Orders', value: statsData ? statsData.totalOrders.toString() : '0', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Products', value: statsData ? statsData.totalProducts.toString() : '0', icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Total Users', value: statsData ? statsData.totalUsers.toString() : '0', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 min-h-[80vh] flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0">
        <div className="bg-card rounded-2xl border border-border p-4 sticky top-24">
          <h2 className="text-xl font-bold mb-6 px-4">Admin Panel</h2>
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Overview</h1>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading dashboard data...</p>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map(stat => (
                <div key={stat.label} className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-muted-foreground font-medium mb-1">{stat.label}</h3>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-bold">Recent Orders</h2>
                <button className="text-primary text-sm font-medium hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-secondary/50 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-medium">Order ID</th>
                      <th className="px-6 py-4 font-medium">Customer</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order, i) => (
                        <tr key={i} className="hover:bg-secondary/20 transition-colors">
                          <td className="px-6 py-4 font-medium text-primary">#ORD-{order.id}</td>
                          <td className="px-6 py-4">{order.user?.fullName || order.user?.email || 'Unknown'}</td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                              order.status === 'PENDING' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                              'bg-secondary text-foreground'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-medium">${order.totalAmount.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
              </>
            )}
          </div>
        )}

        {activeTab !== 'dashboard' && (
          <div className="flex items-center justify-center h-full min-h-[400px] border-2 border-dashed border-border rounded-3xl text-muted-foreground animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 capitalize">{activeTab} Management</h2>
              <p>This module is currently under development.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
