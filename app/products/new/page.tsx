// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { createProduct, getCategories } from "@/lib/actions";
// import Link from "next/link";
// import { ArrowLeft, Package, Loader2 } from "lucide-react";

// export default function NewProductPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
//   const [loaded, setLoaded] = useState(false);

//   // Load categories on client
//   if (!loaded) {
//     getCategories().then((cats) => {
//       setCategories(cats);
//       setLoaded(true);
//     });
//   }

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const form = e.currentTarget;
//     const formData = new FormData(form);

//     try {
//       await createProduct({
//         sku: formData.get("sku") as string,
//         name: formData.get("name") as string,
//         description: formData.get("description") as string,
//         category_id: formData.get("category_id") ? parseInt(formData.get("category_id") as string) : null,
//         unit_price: parseFloat(formData.get("unit_price") as string) || 0,
//         cost_price: parseFloat(formData.get("cost_price") as string) || 0,
//         reorder_level: parseInt(formData.get("reorder_level") as string) || 10,
//         unit: formData.get("unit") as string,
//         initial_stock: parseInt(formData.get("initial_stock") as string) || 0,
//       });
//       router.push("/products");
//     } catch (err: any) {
//       setError(err.message || "Failed to create product");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 max-w-3xl mx-auto">
//       <Link href="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
//         <ArrowLeft className="w-4 h-4" />
//         Back to Products
//       </Link>

//       <div className="card">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
//             <Package className="w-5 h-5 text-primary-600" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
//             <p className="text-gray-500 text-sm">Fill in the details below</p>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-600 text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <div>
//               <label className="label">SKU *</label>
//               <input name="sku" required className="input-field" placeholder="e.g. ELEC-001" />
//             </div>
//             <div>
//               <label className="label">Product Name *</label>
//               <input name="name" required className="input-field" placeholder="e.g. Wireless Mouse" />
//             </div>
//           </div>

//           <div>
//             <label className="label">Description</label>
//             <textarea name="description" rows={3} className="input-field" placeholder="Product description..." />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//             <div>
//               <label className="label">Category</label>
//               <select name="category_id" className="input-field">
//                 <option value="">Select Category</option>
//                 {categories.map((cat) => (
//                   <option key={cat.id} value={cat.id}>{cat.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Unit</label>
//               <select name="unit" className="input-field" defaultValue="pcs">
//                 <option value="pcs">Pieces (pcs)</option>
//                 <option value="kg">Kilograms (kg)</option>
//                 <option value="litre">Litres (litre)</option>
//                 <option value="pack">Pack</option>
//                 <option value="box">Box</option>
//                 <option value="ream">Ream</option>
//                 <option value="bottle">Bottle</option>
//                 <option value="set">Set</option>
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//             <div>
//               <label className="label">Unit Price ($)</label>
//               <input name="unit_price" type="number" step="0.01" min="0" className="input-field" placeholder="0.00" />
//             </div>
//             <div>
//               <label className="label">Cost Price ($)</label>
//               <input name="cost_price" type="number" step="0.01" min="0" className="input-field" placeholder="0.00" />
//             </div>
//             <div>
//               <label className="label">Reorder Level</label>
//               <input name="reorder_level" type="number" min="0" defaultValue="10" className="input-field" />
//             </div>
//           </div>

//           <div>
//             <label className="label">Initial Stock</label>
//             <input name="initial_stock" type="number" min="0" defaultValue="0" className="input-field sm:w-48" />
//             <p className="text-xs text-gray-400 mt-1">Starting quantity for this product</p>
//           </div>

//           <div className="flex items-center gap-3 pt-4">
//             <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
//               {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//               Create Product
//             </button>
//             <Link href="/products" className="btn-secondary">Cancel</Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct, getCategories, getProductNames, getProductDescriptions, searchProductsByCode } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, Package, Loader2, BookOpen, FileDigit, Hash, Search, Check, Boxes } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  // Form values
  const [logbookName, setLogbookName] = useState("");
  const [documentNo, setDocumentNo] = useState("");
  const [code, setCode] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [unit, setUnit] = useState("pcs");

  // Autocomplete states
  const [productNames, setProductNames] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [filteredNames, setFilteredNames] = useState<string[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [showDocDropdown, setShowDocDropdown] = useState(false);
  const [showCodeDropdown, setShowCodeDropdown] = useState(false);
  const [selectedExisting, setSelectedExisting] = useState<any>(null);
  const [isExistingProduct, setIsExistingProduct] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
    getProductNames().then(setProductNames);
    getProductDescriptions().then(setDescriptions);
  }, []);

  const handleNameChange = (value: string) => {
    setLogbookName(value);
    setIsExistingProduct(false);
    setSelectedExisting(null);
    if (value.trim()) {
      const filtered = productNames.filter(n => n.toLowerCase().includes(value.toLowerCase()));
      setFilteredNames(filtered);
      setShowNameDropdown(filtered.length > 0);
    } else {
      setShowNameDropdown(false);
    }
  };

  const handleDocChange = (value: string) => {
    setDocumentNo(value);
    if (value.trim()) {
      const filtered = descriptions.filter(d => d && d.toLowerCase().includes(value.toLowerCase()));
      setFilteredDocs(filtered);
      setShowDocDropdown(filtered.length > 0);
    } else {
      setShowDocDropdown(false);
    }
  };

  const handleCodeChange = async (value: string) => {
    setCode(value);
    setIsExistingProduct(false);
    setSelectedExisting(null);
    if (value.trim().length >= 1) {
      const results = await searchProductsByCode(value);
      setFilteredProducts(results);
      setShowCodeDropdown(results.length > 0);
    } else {
      setFilteredProducts([]);
      setShowCodeDropdown(false);
    }
  };

  const selectExistingProduct = (product: any) => {
    setSelectedExisting(product);
    setCode(product.sku);
    setLogbookName(product.name);
    setDocumentNo(product.description || "");
    setUnit(product.unit);
    setIsExistingProduct(true);
    setShowCodeDropdown(false);
    setShowNameDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!logbookName.trim()) {
      setError("Logbook Name is required");
      return;
    }
    if (!code.trim()) {
      setError("Code (SKU) is required");
      return;
    }
    if (!quantity || parseInt(quantity) < 0) {
      setError("Please enter a valid quantity");
      return;
    }

    setLoading(true);

    try {
      await createProduct({
        sku: code.trim(),
        name: logbookName.trim(),
        description: documentNo.trim(),
        category_id: null,
        unit_price: 0,
        cost_price: 0,
        reorder_level: 0,
        unit: unit,
        initial_stock: parseInt(quantity) || 0,
      });
      setSuccess("Product added successfully! Redirecting...");
      setTimeout(() => router.push("/products"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to create product");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-500 text-sm">Add logbook item to inventory</p>
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

        {isExistingProduct && selectedExisting && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm flex items-center gap-2">
            <Boxes className="w-4 h-4" />
            This product already exists! Current stock: {selectedExisting.current_stock} {selectedExisting.unit}. 
            Go to <Link href="/stock-in" className="font-bold underline">Stock In</Link> to add more.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* LOGBOOK NAME */}
          <div className="relative">
            <label className="label flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              Logbook Name *
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. Log Book of Production Area Daily Cleaning Record"
              value={logbookName}
              onChange={(e) => handleNameChange(e.target.value)}
              onFocus={() => logbookName && filteredNames.length > 0 && setShowNameDropdown(true)}
              onBlur={() => setTimeout(() => setShowNameDropdown(false), 200)}
            />
            {showNameDropdown && filteredNames.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredNames.map((name, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm"
                    onMouseDown={() => { setLogbookName(name); setShowNameDropdown(false); }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DOCUMENT NO */}
          <div className="relative">
            <label className="label flex items-center gap-2">
              <FileDigit className="w-4 h-4 text-blue-600" />
              Document No
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. GM-LB-PADCR-104"
              value={documentNo}
              onChange={(e) => handleDocChange(e.target.value)}
              onFocus={() => documentNo && filteredDocs.length > 0 && setShowDocDropdown(true)}
              onBlur={() => setTimeout(() => setShowDocDropdown(false), 200)}
            />
            {showDocDropdown && filteredDocs.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredDocs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    onMouseDown={() => { setDocumentNo(doc); setShowDocDropdown(false); }}
                  >
                    {doc}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CODE (SKU) */}
          <div className="relative">
            <label className="label flex items-center gap-2">
              <Hash className="w-4 h-4 text-amber-600" />
               Logbook Code
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                className={`input-field pl-10 ${isExistingProduct ? "border-amber-500 bg-amber-50" : ""}`}
                placeholder="Type code e.g. R1, R2..."
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                onFocus={() => code && filteredProducts.length > 0 && !isExistingProduct && setShowCodeDropdown(true)}
              />
              {isExistingProduct && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Check className="w-5 h-5 text-amber-600" />
                </div>
              )}
            </div>
            {showCodeDropdown && filteredProducts.length > 0 && !isExistingProduct && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                <div className="px-3 py-1 text-xs text-gray-400 bg-gray-50">Click to auto-fill existing product</div>
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-sm flex items-center justify-between border-b border-gray-100"
                    onMouseDown={() => selectExistingProduct(p)}
                  >
                    <div>
                      <span className="font-mono font-bold text-amber-700">{p.sku}</span>
                      <span className="text-gray-500 mx-2">—</span>
                      <span className="font-medium">{p.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">Stock: {p.current_stock}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* QUANTITY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label flex items-center gap-2">
                <Boxes className="w-4 h-4 text-emerald-600" />
                Quantity *
              </label>
              <input
                type="number"
                min="0"
                required
                className="input-field"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Unit</label>
              <select className="input-field" value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="pcs">Pieces (pcs)</option>
                {/* <option value="kg">Kilograms (kg)</option>
                <option value="litre">Litres (litre)</option>
                <option value="pack">Pack</option>
                <option value="box">Box</option>
                <option value="ream">Ream</option>
                <option value="bottle">Bottle</option>
                <option value="set">Set</option> */}
                <option value="logbook">Logbook</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || isExistingProduct}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isExistingProduct ? "Product Exists" : "Add Product"}
            </button>
            <Link href="/products" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}