import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getTransactions, getProducts } from "@/lib/actions";
import Link from "next/link";
import { History, ArrowUpFromLine, ArrowDownToLine, RefreshCcw } from "lucide-react";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; product?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const filters: any = {};
  if (params.type && params.type !== "all") filters.type = params.type;
  if (params.product) filters.productId = parseInt(params.product);

  const [transactions, products] = await Promise.all([
    getTransactions(filters),
    getProducts(),
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-500 mt-1">All stock movements and issuances</p>
      </div>

      <div className="card mb-6">
        <form className="flex flex-col sm:flex-row gap-4">
          <select name="type" defaultValue={params.type || "all"} className="input-field sm:w-48">
            <option value="all">All Types</option>
            <option value="in">Stock In</option>
            <option value="out">Stock Out</option>
            <option value="adjustment">Adjustment</option>
          </select>
          <select name="product" defaultValue={params.product || ""} className="input-field sm:w-64">
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button type="submit" className="btn-secondary">Filter</button>
          {(params.type || params.product) && (
            <Link href="/transactions" className="btn-danger">Clear</Link>
          )}
        </form>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Date & Time</th>
                <th className="table-header">Product</th>
                <th className="table-header">Type</th>
                <th className="table-header">Qty</th>
                <th className="table-header">Stock Change</th>
                <th className="table-header">Reason</th>
                <th className="table-header">By</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-cell text-center py-12 text-gray-500">
                    <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="table-cell text-gray-500 whitespace-nowrap">
                      {new Date(t.created_at).toLocaleString()}
                    </td>
                    <td className="table-cell">
                      <div className="font-medium">{t.product_name}</div>
                      <div className="text-xs text-gray-400">{t.product_sku}</div>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        t.type === 'in' ? 'bg-success-100 text-success-700' :
                        t.type === 'out' ? 'bg-danger-100 text-danger-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {t.type === 'in' ? <ArrowUpFromLine className="w-3 h-3" /> :
                         t.type === 'out' ? <ArrowDownToLine className="w-3 h-3" /> :
                         <RefreshCcw className="w-3 h-3" />}
                        {t.type === 'in' ? 'Stock In' : t.type === 'out' ? 'Stock Out' : 'Adjustment'}
                      </span>
                    </td>
                    <td className="table-cell font-medium">{t.quantity}</td>
                    <td className="table-cell text-gray-500">
                      {t.previous_stock} → <span className="font-medium text-gray-900">{t.new_stock}</span>
                    </td>
                    <td className="table-cell text-gray-500 max-w-xs truncate">{t.reason}</td>
                    <td className="table-cell text-gray-500">{t.created_by_name || 'System'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
