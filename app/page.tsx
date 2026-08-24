import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  getDashboardStats,
  getLowStockItems,
  getRecentTransactions,
} from "@/lib/actions";
import {
  Package,
  DollarSign,
  AlertTriangle,
  ArrowUpFromLine,
  ArrowDownToLine,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const stats = await getDashboardStats();
  const lowStock = await getLowStockItems();
  const recent = await getRecentTransactions(8);

  const statCards = [
    {
      title: "Total Products",
      value: stats.total_products,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      href: "/products",
    },
    
    {
      title: "Low Stock Items",
      value: stats.low_stock_count,
      icon: AlertTriangle,
      color: "bg-amber-50 text-amber-600",
      href: "/products",
    },
    {
      title: "Total Issuances",
      value: stats.total_issuances,
      icon: FileText,
      color: "bg-purple-50 text-purple-600",
      href: "/reports",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user.name}. Here&apos;s your logbook overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Monthly Movement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Stock Movement</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-success-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <ArrowUpFromLine className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock In (This Month)</p>
                  <p className="text-xl font-bold text-gray-900">{stats.stock_in_month} units</p>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-success-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-danger-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
                  <ArrowDownToLine className="w-5 h-5 text-danger-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock Out (This Month)</p>
                  <p className="text-xl font-bold text-gray-900">{stats.stock_out_month} units</p>
                </div>
              </div>
              <TrendingDown className="w-5 h-5 text-danger-600" />
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Low Stock Alerts
            </h3>
            <Link href="/products" className="text-sm text-primary-600 hover:underline">
              View All
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-gray-500 text-center py-8">All stock levels are healthy! ✅</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">Product</th>
                    <th className="table-header">SKU</th>
                    <th className="table-header">Current</th>
                    <th className="table-header">Reorder Level</th>
                    <th className="table-header">Shortage</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="table-cell font-medium">{item.name}</td>
                      <td className="table-cell text-gray-500">{item.sku}</td>
                      <td className="table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-700">
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="table-cell">{item.reorder_level} {item.unit}</td>
                      <td className="table-cell text-danger-600 font-medium">{item.shortage} {item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <Link href="/transactions" className="text-sm text-primary-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Date</th>
                <th className="table-header">Product</th>
                <th className="table-header">Type</th>
                <th className="table-header">Quantity</th>
                <th className="table-header">Stock</th>
                <th className="table-header">By</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="table-cell text-gray-500">
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                  <td className="table-cell font-medium">{t.product_name}</td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      t.type === 'in' ? 'bg-success-100 text-success-700' :
                      t.type === 'out' ? 'bg-danger-100 text-danger-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {t.type === 'in' ? 'Stock In' : t.type === 'out' ? 'Stock Out' : 'Adjustment'}
                    </span>
                  </td>
                  <td className="table-cell">{t.quantity}</td>
                  <td className="table-cell text-gray-500">{t.previous_stock} → {t.new_stock}</td>
                  <td className="table-cell text-gray-500">{t.created_by_name || 'System'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
