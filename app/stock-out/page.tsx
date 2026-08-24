// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { stockOut, getProducts } from "@/lib/actions";
// import Link from "next/link";
// import { ArrowLeft, ArrowDownToLine, Loader2, Package, User, PenTool } from "lucide-react";

// export default function StockOutPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [products, setProducts] = useState<any[]>([]);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);

//   useEffect(() => {
//     getProducts().then(setProducts);
//   }, []);

//   const handleProductChange = (productId: string) => {
//     const prod = products.find((p) => p.id === parseInt(productId));
//     setSelectedProduct(prod);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     const form = e.currentTarget;
//     const formData = new FormData(form);

//     try {
//       await stockOut({
//         product_id: parseInt(formData.get("product_id") as string),
//         quantity: parseInt(formData.get("quantity") as string),
//         receiver_name: formData.get("receiver_name") as string,
//         receiver_department: formData.get("receiver_department") as string,
//         issue_purpose: formData.get("issue_purpose") as string,
//         issuer_name: formData.get("issuer_name") as string,
//         issuer_signature: formData.get("issuer_signature") as string,
//         issue_date: formData.get("issue_date") as string,
//       });
//       setSuccess("Stock issued successfully! Redirecting to report...");
//       setTimeout(() => router.push("/reports"), 1500);
//     } catch (err: any) {
//       setError(err.message || "Failed to issue stock");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 max-w-3xl mx-auto">
//       <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
//         <ArrowLeft className="w-4 h-4" />
//         Back to Dashboard
//       </Link>

//       <div className="card">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
//             <ArrowDownToLine className="w-5 h-5 text-danger-600" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Stock Issue Entry</h1>
//             <p className="text-gray-500 text-sm">Logbook entry for stock issuance</p>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-600 text-sm">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg text-success-600 text-sm">
//             {success}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Product Selection */}
//           <div className="bg-gray-50 rounded-xl p-5 space-y-4">
//             <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
//               <Package className="w-4 h-4" />
//               Product Details
//             </h3>

//             <div>
//               <label className="label">Product *</label>
//               <select
//                 name="product_id"
//                 required
//                 className="input-field"
//                 onChange={(e) => handleProductChange(e.target.value)}
//               >
//                 <option value="">Select Product</option>
//                 {products.map((p) => (
//                   <option key={p.id} value={p.id}>
//                     {p.sku} — {p.name} (Stock: {p.current_stock} {p.unit})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {selectedProduct && (
//               <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">Available Stock</p>
//                   <p className="text-xl font-bold text-gray-900">
//                     {selectedProduct.current_stock} <span className="text-sm font-normal text-gray-500">{selectedProduct.unit}</span>
//                   </p>
//                 </div>
//                 <Package className="w-8 h-8 text-primary-200" />
//               </div>
//             )}

//             <div>
//               <label className="label">Quantity to Issue *</label>
//               <input name="quantity" type="number" min="1" required className="input-field sm:w-48" placeholder="0" />
//             </div>
//           </div>

//           {/* Receiver Details */}
//           <div className="bg-blue-50 rounded-xl p-5 space-y-4">
//             <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide flex items-center gap-2">
//               <User className="w-4 h-4" />
//               Receiver Details (Lene Wale Ka)
//             </h3>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="label">Receiver Name *</label>
//                 <input name="receiver_name" required className="input-field" placeholder="e.g. Ali Khan" />
//               </div>
//               <div>
//                 <label className="label">Department *</label>
//                 <select name="receiver_department" required className="input-field">
//                   <option value="">Select Department</option>
//                   <option value="IT Department">IT Department</option>
//                   <option value="HR Department">HR Department</option>
//                   <option value="Finance Department">Finance Department</option>
//                   <option value="Admin Department">Admin Department</option>
//                   <option value="Operations">Operations</option>
//                   <option value="Marketing">Marketing</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="label">Purpose of Issue</label>
//               <textarea name="issue_purpose" rows={2} className="input-field" placeholder="e.g. New employee workstation setup, Replacement, etc." />
//             </div>
//           </div>

//           {/* Issuer Details */}
//           <div className="bg-amber-50 rounded-xl p-5 space-y-4">
//             <h3 className="text-sm font-semibold text-amber-900 uppercase tracking-wide flex items-center gap-2">
//               <PenTool className="w-4 h-4" />
//               Issuer Details (Dene Wale Ka)
//             </h3>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="label">Issuer Name *</label>
//                 <input name="issuer_name" required className="input-field" placeholder="e.g. Ahmed Hassan" />
//               </div>
//               <div>
//                 <label className="label">Issuer Signature / Sign *</label>
//                 <input name="issuer_signature" required className="input-field" placeholder="e.g. A.Hassan, Manager" />
//                 <p className="text-xs text-gray-400 mt-1">Type initials, name, or designation as signature</p>
//               </div>
//             </div>

//             <div>
//               <label className="label">Issue Date *</label>
//               <input name="issue_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="input-field sm:w-48" />
//             </div>
//           </div>

//           <div className="flex items-center gap-3 pt-2">
//             <button type="submit" disabled={loading} className="btn-danger flex items-center gap-2">
//               {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//               Issue Stock
//             </button>
//             <Link href="/" className="btn-secondary">Cancel</Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { stockOut, getProducts } from "@/lib/actions";
// import Link from "next/link";
// import { ArrowLeft, ArrowDownToLine, Loader2, Package, BookOpen, Hash } from "lucide-react";

// export default function StockOutPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [products, setProducts] = useState<any[]>([]);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);

//   useEffect(() => {
//     getProducts().then(setProducts);
//   }, []);

//   const handleProductChange = (productId: string) => {
//     const prod = products.find((p) => p.id === parseInt(productId));
//     setSelectedProduct(prod);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     const form = e.currentTarget;
//     const formData = new FormData(form);

//     try {
//       await stockOut({
//         product_id: parseInt(formData.get("product_id") as string),
//         quantity: parseInt(formData.get("quantity") as string),
//         receiver_name: formData.get("receiver_name") as string,
//         receiver_department: formData.get("receiver_department") as string,
//         issue_purpose: formData.get("issue_purpose") as string,
//         issuer_name: formData.get("issuer_name") as string,
//         issuer_signature: formData.get("issuer_signature") as string,
//         issue_date: formData.get("issue_date") as string,
//         logbook_name: formData.get("logbook_name") as string,
//         document_no: formData.get("document_no") as string,
//       });
//       setSuccess("Stock issued successfully! Redirecting to report...");
//       setTimeout(() => router.push("/reports"), 1500);
//     } catch (err: any) {
//       setError(err.message || "Failed to issue stock");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 max-w-3xl mx-auto">
//       <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
//         <ArrowLeft className="w-4 h-4" />
//         Back to Dashboard
//       </Link>

//       <div className="card">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
//             <ArrowDownToLine className="w-5 h-5 text-danger-600" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Stock Issue Entry</h1>
//             <p className="text-gray-500 text-sm">Logbook entry for stock issuance</p>
//           </div>
//         </div>
        
//         {error && (
//           <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-600 text-sm">
//             {error}
//           </div>
//         )}
     
//         {success && (
//           <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg text-success-600 text-sm">
//             {success}
//           </div>
//         )}
      
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* LOGBOOK FIELDS - TOP SECTION */}
//           <div className="bg-purple-50 rounded-xl p-5 space-y-4 border-2 border-purple-200">
//             <h3 className="text-sm font-semibold text-purple-900 uppercase tracking-wide flex items-center gap-2">
//               <BookOpen className="w-4 h-4" />
//               Logbook Details (Required)
//             </h3>
                                       
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="label">Logbook Name *</label>
//                 <input name="logbook_name" required className="input-field" placeholder="e.g. Stationery Logbook, IT Equipment Logbook" />
//               </div>
//               <div>
//                 <label className="label">Document No *</label>
//                 <input name="document_no" required className="input-field" placeholder="e.g. DOC-2026-001, INV-001" />
//               </div>
//             </div>
//           </div>
        
//           {/* Product Selection */}
//           <div className="bg-gray-50 rounded-xl p-5 space-y-4">
//             <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
//               <Package className="w-4 h-4" />
//               Product Details
//             </h3>
               


//             <div>
//               <label className="label">Product *</label>
//               <select
//                 name="product_id"
//                 required
//                 className="input-field"
//                 onChange={(e) => handleProductChange(e.target.value)}
//               >
//                 <option value="">Select Product</option>
//                 {products.map((p) => (
//                   <option key={p.id} value={p.id}>
//                     {p.sku} — {p.name} (Stock: {p.current_stock} {p.unit})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {selectedProduct && (
//               <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">Available Stock</p>
//                   <p className="text-xl font-bold text-gray-900">
//                     {selectedProduct.current_stock} <span className="text-sm font-normal text-gray-500">{selectedProduct.unit}</span>
//                   </p>
//                 </div>
//                 <Package className="w-8 h-8 text-primary-200" />
//               </div>
//             )}

//             <div>
//               <label className="label">Quantity to Issue *</label>
//               <input name="quantity" type="number" min="1" required className="input-field sm:w-48" placeholder="0" />
//             </div>
//           </div>

//           {/* Receiver Details */}
//           <div className="bg-blue-50 rounded-xl p-5 space-y-4">
//             <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide flex items-center gap-2">
//               <Hash className="w-4 h-4" />
//               Receiver Details
//             </h3>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="label">Receiver Name *</label>
//                 <input name="receiver_name" required className="input-field" placeholder="e.g. Ali Khan" />
//               </div>
//               <div>
//                 <label className="label">Department *</label>
//                 <select name="receiver_department" required className="input-field">
//                   <option value="">Select Department</option>
//                   <option value="IT Department">IT Department</option>
//                   <option value="HR Department">HR Department</option>
//                   <option value="Finance Department">Finance Department</option>
//                   <option value="Admin Department">Admin Department</option>
//                   <option value="Operations">Operations</option>
//                   <option value="Marketing">Marketing</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="label">Purpose of Issue</label>
//               <textarea name="issue_purpose" rows={2} className="input-field" placeholder="e.g. New employee workstation setup" />
//             </div>
//           </div>

//           {/* Issuer Details */}
//           <div className="bg-amber-50 rounded-xl p-5 space-y-4">
//             <h3 className="text-sm font-semibold text-amber-900 uppercase tracking-wide flex items-center gap-2">
//               <Hash className="w-4 h-4" />
//               Issuer Details
//             </h3>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="label">Issuer Name *</label>
//                 <input name="issuer_name" required className="input-field" placeholder="e.g. Ahmed Hassan" />
//               </div>
//               <div>
//                 <label className="label">Issuer Signature *</label>
//                 <input name="issuer_signature" required className="input-field" placeholder="e.g. A.Hassan, Manager" />
//               </div>
//             </div>

//             <div>
//               <label className="label">Issue Date *</label>
//               <input name="issue_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="input-field sm:w-48" />
//             </div>
//           </div>

//           <div className="flex items-center gap-3 pt-2">
//             <button type="submit" disabled={loading} className="btn-danger flex items-center gap-2">
//               {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//               Issue Stock
//             </button>
//             <Link href="/" className="btn-secondary">Cancel</Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { stockOut, getProducts } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, ArrowDownToLine, Loader2, Package, Hash, Search, X } from "lucide-react";

export default function StockOutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Product search states (same as Stock In)
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const productDropdownRef = useRef<HTMLDivElement>(null);
  const [productId, setProductId] = useState("");

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products based on search (name, SKU, description)
  const filteredProducts = productSearch.trim() === ""
    ? products
    : products.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(productSearch.toLowerCase()))
      );

  const handleProductSelect = (product: any) => {
    setProductId(product.id.toString());
    setSelectedProduct(product);
    setProductSearch(`${product.sku} — ${product.name}`);
    setShowProductDropdown(false);
  };

  const clearProduct = () => {
    setProductId("");
    setSelectedProduct(null);
    setProductSearch("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!productId) {
      setError("Please select a product");
      setLoading(false);
      return;
    }

    try {
      await stockOut({
        product_id: parseInt(productId),
        quantity: parseInt(formData.get("quantity") as string),
        receiver_name: formData.get("receiver_name") as string,
        receiver_department: formData.get("receiver_department") as string,
        issue_purpose: formData.get("issue_purpose") as string,
        issuer_name: formData.get("issuer_name") as string,
        issuer_signature: formData.get("issuer_signature") as string,
        issue_date: formData.get("issue_date") as string,
        logbook_name: "Stock Out Logbook",
        document_no: "", // Server auto-generate karega
      });
      setSuccess("Stock issued successfully! Redirecting to report...");
      setTimeout(() => router.push("/reports"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to issue stock");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
            <ArrowDownToLine className="w-5 h-5 text-danger-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Issue Entry</h1>
            <p className="text-gray-500 text-sm">Logbook entry for stock issuance</p>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-600 text-sm">
            {error}
          </div>
        )}
     
        {success && (
          <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg text-success-600 text-sm">
            {success}
          </div>
        )}
      
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Selection - SEARCH BAR (same as Stock In) */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
              <Package className="w-4 h-4" />
              Product Details
            </h3>
               
            <div ref={productDropdownRef}>
              <label className="label">Product *</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  className="input-field pl-10 pr-10 w-full"
                  placeholder="Search by name, SKU or description..."
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setShowProductDropdown(true);
                    if (selectedProduct && e.target.value !== `${selectedProduct.sku} — ${selectedProduct.name}`) {
                      setProductId("");
                      setSelectedProduct(null);
                    }
                  }}
                  onFocus={() => setShowProductDropdown(true)}
                />
                {productSearch && (
                  <button
                    type="button"
                    onClick={clearProduct}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                
                {/* Dropdown Results */}
                {showProductDropdown && filteredProducts.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleProductSelect(p)}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center justify-between"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.sku}</div>
                          {p.description && (
                            <div className="text-xs text-gray-400 truncate">{p.description}</div>
                          )}
                        </div>
                        <div className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded ml-2 shrink-0">
                          Stock: {p.current_stock}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {showProductDropdown && productSearch && filteredProducts.length === 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-400 text-sm">
                    No products found
                  </div>
                )}
              </div>
            </div>

            {selectedProduct && (
              <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Available Stock</p>
                  <p className="text-xl font-bold text-gray-900">
                    {selectedProduct.current_stock} <span className="text-sm font-normal text-gray-500">{selectedProduct.unit}</span>
                  </p>
                </div>
                <Package className="w-8 h-8 text-primary-200" />
              </div>
            )}

            <div>
              <label className="label">Quantity to Issue *</label>
              <input name="quantity" type="number" min="1" required className="input-field sm:w-48" placeholder="0" />
            </div>
          </div>

          {/* Receiver Details */}
          <div className="bg-blue-50 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Receiver Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Receiver Name *</label>
                <input name="receiver_name" required className="input-field" placeholder="e.g. Ali Khan" />
              </div>
              <div>
                <label className="label">Department *</label>
                <select name="receiver_department" required className="input-field">
                  <option value="">Select Department</option>
                  <option value="Production Department">Production Department</option>
                  <option value="QA Department">QA Department</option>
                  <option value="QC Department">QC Department</option>
                  <option value="Admin Department">Admin Department</option>
                  <option value="Admin Department">Engineering Department</option>
                  <option value="Other">Other</option>
                  {/* <option value="HR Department">HR Department</option> */}
                  {/* <option value="Finance Department">Finance Department</option> */}
                 
                  {/* <option value="Operations">Operations</option> */}
                  {/* <option value="Marketing">Marketing</option> */}
                  
                </select>
              </div>
            </div>

            <div>
              <label className="label">Purpose of Issue</label>
              <textarea name="issue_purpose" rows={2} className="input-field" placeholder="e.g. New employee workstation setup" />
            </div>
          </div>

          {/* Issuer Details */}
          <div className="bg-amber-50 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-amber-900 uppercase tracking-wide flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Issuer Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Issuer Name *</label>
                <input name="issuer_name" required className="input-field" placeholder="e.g. Ahmed Hassan" />
              </div>
              <div>
                <label className="label">Issuer Signature *</label>
                <input name="issuer_signature" required className="input-field" placeholder="e.g. A.Hassan, Manager" />
              </div>
            </div>

            <div>
              <label className="label">Issue Date *</label>
              <input name="issue_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="input-field sm:w-48" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-danger flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Issue Stock
            </button>
            <Link href="/" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}