// import { redirect } from "next/navigation";
// import { getCurrentUser } from "@/lib/auth";
// import { getProducts, getCategories } from "@/lib/actions";
// import Link from "next/link";
// import { Package, Plus, Search, Pencil, Trash2, AlertTriangle } from "lucide-react";
// import { DeleteProductButton } from "@/components/DeleteProductButton";

// export default async function ProductsPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ search?: string; category?: string }>;
// }) {
//   const user = await getCurrentUser();
//   if (!user) redirect("/login");

//   const params = await searchParams;
//   const search = params.search || "";
//   const categoryId = params.category ? parseInt(params.category) : undefined;

//   const [products, categories] = await Promise.all([
//     getProducts(search || undefined, categoryId),
//     getCategories(),
//   ]);

//   return (
//     <div className="p-8 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Products</h1>
//           <p className="text-gray-500 mt-1">Manage your inventory products</p>
//         </div>
//         <Link
//           href="/products/new"
//           className="btn-primary inline-flex items-center gap-2 self-start"
//         >
//           <Plus className="w-4 h-4" />
//           Add Product
//         </Link>
//       </div>

//       {/* Filters */}
//       <div className="card mb-6">
//         <form className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               name="search"
//               defaultValue={search}
//               placeholder="Search by name or SKU..."
//               className="input-field pl-10"
//             />
//           </div>
//           <select
//             name="category"
//             defaultValue={params.category || ""}
//             className="input-field sm:w-48"
//           >
//             <option value="">All Categories</option>
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//           <button type="submit" className="btn-secondary">Filter</button>
//           {(search || params.category) && (
//             <Link href="/products" className="btn-danger">
//               Clear
//             </Link>
//           )}
//         </form>
//       </div>

//       {/* Products Table */}
//       <div className="card overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr>
//                 <th className="table-header">SKU</th>
//                 <th className="table-header">Product Name</th>
//                 <th className="table-header">Category</th>
//                 <th className="table-header">Stock</th>
//                 <th className="table-header">Unit Price</th>
//                 <th className="table-header">Cost</th>
//                 <th className="table-header">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="table-cell text-center py-12 text-gray-500">
//                     <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                     No products found
//                   </td>
//                 </tr>
//               ) : (
//                 products.map((p) => (
//                   <tr key={p.id} className="hover:bg-gray-50 group">
//                     <td className="table-cell font-mono text-gray-500">{p.sku}</td>
//                     <td className="table-cell">
//                       <div className="font-medium text-gray-900">{p.name}</div>
//                       {p.description && (
//                         <div className="text-xs text-gray-400 truncate max-w-xs">{p.description}</div>
//                       )}
//                     </td>
//                     <td className="table-cell">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
//                         {p.category_name || "Uncategorized"}
//                       </span>
//                     </td>
//                     <td className="table-cell">
//                       <div className="flex items-center gap-2">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           p.current_stock <= p.reorder_level
//                             ? "bg-danger-100 text-danger-700"
//                             : "bg-success-100 text-success-700"
//                         }`}>
//                           {p.current_stock} {p.unit}
//                         </span>
//                         {p.current_stock <= p.reorder_level && (
//                           <AlertTriangle className="w-4 h-4 text-danger-500" />
//                         )}
//                       </div>
//                     </td>
//                     <td className="table-cell">${parseFloat(p.unit_price).toFixed(2)}</td>
//                     <td className="table-cell">${parseFloat(p.cost_price).toFixed(2)}</td>
//                     <td className="table-cell">
//                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Link
//                           href={`/products/${p.id}`}
//                           className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
//                           title="Edit"
//                         >
//                           <Pencil className="w-4 h-4" />
//                         </Link>
//                         <DeleteProductButton id={p.id} name={p.name} />
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { getProducts, deleteProduct } from "@/lib/actions";
// import Link from "next/link";
// import { Package, Plus, Search, Pencil, Trash2, AlertTriangle, Loader2 } from "lucide-react";

// export default function ProductsPage() {
//   const router = useRouter();
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   // Load products with search
//   const loadProducts = useCallback(async (query: string = "") => {
//     setLoading(true);
//     const data = await getProducts(query || undefined);
//     setProducts(data);
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     loadProducts();
//   }, [loadProducts]);

//   // Auto-search on every keystroke (with 300ms debounce)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       loadProducts(search);
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [search, loadProducts]);

//   const handleDelete = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this product?")) return;
//     await deleteProduct(id);
//     loadProducts(search);
//   };

//   // Filter locally for instant feel (optional extra layer)
//   const filteredProducts = products.filter((p) => {
//     if (!search.trim()) return true;
//     const q = search.toLowerCase();
//     return (
//       p.sku?.toLowerCase().includes(q) ||
//       p.name?.toLowerCase().includes(q) ||
//       p.description?.toLowerCase().includes(q)
//     );
//   });

//   return (
//     <div className="p-8 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Products</h1>
//           <p className="text-gray-500 mt-1">Manage your inventory logbooks</p>
//         </div>
//         <Link
//           href="/products/new"
//           className="btn-primary inline-flex items-center gap-2 self-start"
//         >
//           <Plus className="w-4 h-4" />
//           Add Product
//         </Link>
//       </div>

//       {/* Search Box Only — No Filter Form */}
//       <div className="card mb-6">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search Logbook Name"
//             className="input-field pl-10 w-full"
//           />
//           {search && (
//             <button
//               onClick={() => setSearch("")}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
//             >
//               Clear
//             </button>
//           )}
//         </div>
        
//       </div>

//       {/* Products Table */}
//       <div className="card overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr>
//                 <th className="table-header">Logbook Code</th>
//                 <th className="table-header">Logbook Name</th>
//                 <th className="table-header">Document No</th>
//                 <th className="table-header">Stock</th>
//                 <th className="table-header">Unit</th>
//                 <th className="table-header">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="table-cell text-center py-12 text-gray-500">
//                     <Loader2 className="w-8 h-8 mx-auto mb-3 text-gray-300 animate-spin" />
//                     Loading products...
//                   </td>
//                 </tr>
//               ) : filteredProducts.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="table-cell text-center py-12 text-gray-500">
//                     <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                     {search ? "No products match your search" : "No products found"}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredProducts.map((p) => (
//                   <tr key={p.id} className="hover:bg-gray-50 group">
//                     <td className="table-cell font-mono font-medium text-amber-700">{p.sku}</td>
//                     <td className="table-cell">
//                       <div className="font-medium text-gray-900">{p.name}</div>
//                     </td>
//                     <td className="table-cell text-gray-500 text-sm">
//                       {p.description || "—"}
//                     </td>
//                     <td className="table-cell">
//                       <div className="flex items-center gap-2">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           p.current_stock <= p.reorder_level
//                             ? "bg-danger-100 text-danger-700"
//                             : "bg-success-100 text-success-700"
//                         }`}>     
//                           {p.current_stock}
//                         </span>
//                         {p.current_stock <= p.reorder_level && (
//                           <AlertTriangle className="w-4 h-4 text-danger-500" />
//                         )}
//                       </div>
//                     </td>
//                     <td className="table-cell text-gray-500 text-sm">{p.unit}</td>
//                     <td className="table-cell">
//                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Link
//                           href={`/products/${p.id}`}
//                           className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
//                           title="Edit"
//                         >
//                           <Pencil className="w-4 h-4" />
//                         </Link>
//                         <button
//                           onClick={() => handleDelete(p.id)}
//                           className="p-1.5 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
//                           title="Delete"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }







"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getProducts, deleteProduct, getProductDescriptions } from "@/lib/actions";
import Link from "next/link";
import { Package, Plus, Search, Pencil, Trash2, AlertTriangle, Loader2, X, FileSearch } from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Document No search states
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [docNoSearch, setDocNoSearch] = useState("");
  const [showDocNoDropdown, setShowDocNoDropdown] = useState(false);
  const [selectedDocNo, setSelectedDocNo] = useState("");
  const docNoDropdownRef = useRef<HTMLDivElement>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Load products with search
  const loadProducts = useCallback(async (query: string = "") => {
    setLoading(true);
    const data = await getProducts(query || undefined);
    setProducts(data);
    setLoading(false);
  }, []);

  const loadDescriptions = useCallback(async () => {
    const data = await getProductDescriptions();
    setDescriptions(data);
  }, []);

  useEffect(() => {
    loadProducts();
    loadDescriptions();
  }, [loadProducts, loadDescriptions]);

  // Auto-search on every keystroke (with 300ms debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, loadProducts]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (docNoDropdownRef.current && !docNoDropdownRef.current.contains(event.target as Node)) {
        setShowDocNoDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await deleteProduct(id);
    loadProducts(search);
  };

  // Filter locally for instant feel
  const filteredProducts = products.filter((p) => {
    if (!search.trim() && !selectedDocNo) return true;
    const q = search.toLowerCase();
    const matchesSearch = !search.trim() || (
      p.sku?.toLowerCase().includes(q) ||
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
    const matchesDocNo = !selectedDocNo || p.description === selectedDocNo;
    return matchesSearch && matchesDocNo;
  });

  // Document No filter logic
  const filteredDescriptions = docNoSearch.trim() === ""
    ? descriptions
    : descriptions.filter(d =>
        d.toLowerCase().includes(docNoSearch.toLowerCase())
      );

  const handleDocNoSelect = (desc: string) => {
    setSelectedDocNo(desc);
    setDocNoSearch(desc);
    setShowDocNoDropdown(false);
    setCurrentPage(1);
  };

  const clearDocNo = () => {
    setSelectedDocNo("");
    setDocNoSearch("");
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your inventory logbooks</p>
        </div>
        <Link
          href="/products/new"
          className="btn-primary inline-flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Search Filters */}
      <div className="card mb-6 space-y-4">
        {/* Product Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search Logbook Name"
            className="input-field pl-10 w-full"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
            >
              Clear
            </button>
          )}
        </div>

        {/* Document No Search Bar */}
        <div className="relative" ref={docNoDropdownRef}>
          <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={docNoSearch}
            onChange={(e) => {
              setDocNoSearch(e.target.value);
              setShowDocNoDropdown(true);
              if (selectedDocNo && e.target.value !== selectedDocNo) {
                setSelectedDocNo("");
              }
            }}
            onFocus={() => setShowDocNoDropdown(true)}
            placeholder="Search Document No"
            className="input-field pl-10 pr-10 w-full"
          />
          {docNoSearch && (
            <button
              type="button"
              onClick={clearDocNo}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Document No Dropdown Results */}
          {showDocNoDropdown && filteredDescriptions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredDescriptions.map((desc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDocNoSelect(desc)}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center gap-2"
                >
                  <FileSearch className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-mono text-sm text-gray-900">{desc}</span>
                </button>
              ))}
            </div>
          )}
          {showDocNoDropdown && docNoSearch && filteredDescriptions.length === 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-400 text-sm">
              No document numbers found
            </div>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Logbook Code</th>
                <th className="table-header">Logbook Name</th>
                <th className="table-header">Document No</th>
                <th className="table-header">Stock</th>
                <th className="table-header">Unit</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="table-cell text-center py-12 text-gray-500">
                    <Loader2 className="w-8 h-8 mx-auto mb-3 text-gray-300 animate-spin" />
                    Loading products...
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-cell text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    {search || selectedDocNo ? "No products match your search" : "No products found"}
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 group">
                    <td className="table-cell font-mono font-medium text-amber-700">{p.sku}</td>
                    <td className="table-cell">
                      <div className="font-medium text-gray-900">{p.name}</div>
                    </td>
                    <td className="table-cell text-gray-500 text-sm">
                      {p.description || "—"}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          p.current_stock <= p.reorder_level
                            ? "bg-danger-100 text-danger-700"
                            : "bg-success-100 text-success-700"
                        }`}>
                          {p.current_stock}
                        </span>
                        {p.current_stock <= p.reorder_level && (
                          <AlertTriangle className="w-4 h-4 text-danger-500" />
                        )}
                      </div>
                    </td>
                    <td className="table-cell text-gray-500 text-sm">{p.unit}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/products/${p.id}`}
                          className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-medium text-gray-900">{filteredProducts.length}</span> results
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 text-sm rounded-lg ${
                    currentPage === page
                      ? "bg-primary-600 text-white font-medium"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}