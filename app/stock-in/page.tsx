// // "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter } from "next/navigation";
// // import { stockIn, getProducts } from "@/lib/actions";
// // import Link from "next/link";
// // import { ArrowLeft, ArrowUpFromLine, Loader2, Package } from "lucide-react";

// // export default function StockInPage() {
// //   const router = useRouter();
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");
// //   const [products, setProducts] = useState<any[]>([]);
// //   const [selectedProduct, setSelectedProduct] = useState<any>(null);

// //   useEffect(() => {
// //     getProducts().then(setProducts);
// //   }, []);

// //   const handleProductChange = (productId: string) => {
// //     const prod = products.find((p) => p.id === parseInt(productId));
// //     setSelectedProduct(prod);
// //   };

// //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     setError("");
// //     setSuccess("");
// //     setLoading(true);

// //     const form = e.currentTarget;
// //     const formData = new FormData(form);

// //     try {
// //       await stockIn({
// //         product_id: parseInt(formData.get("product_id") as string),
// //         quantity: parseInt(formData.get("quantity") as string),
// //         reason: formData.get("reason") as string,
// //         reference: formData.get("reference") as string,
// //       });
// //       setSuccess("Stock added successfully! Redirecting...");
// //       setTimeout(() => router.push("/"), 1500);
// //     } catch (err: any) {
// //       setError(err.message || "Failed to add stock");
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="p-8 max-w-2xl mx-auto">
// //       <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
// //         <ArrowLeft className="w-4 h-4" />
// //         Back to Dashboard
// //       </Link>

// //       <div className="card">
// //         <div className="flex items-center gap-3 mb-6">
// //           <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
// //             <ArrowUpFromLine className="w-5 h-5 text-success-600" />
// //           </div>
// //           <div>
// //             <h1 className="text-2xl font-bold text-gray-900">Stock In Entry</h1>
// //             <p className="text-gray-500 text-sm">Add stock to inventory logbook</p>
// //           </div>
// //         </div>

// //         {error && (
// //           <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-600 text-sm">
// //             {error}
// //           </div>
// //         )}

// //         {success && (
// //           <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg text-success-600 text-sm">
// //             {success}
// //           </div>
// //         )}

// //         <form onSubmit={handleSubmit} className="space-y-5">
// //           <div>
// //             <label className="label">Product *</label>
// //             <select
// //               name="product_id"
// //               required
// //               className="input-field"
// //               onChange={(e) => handleProductChange(e.target.value)}
// //             >
// //               <option value="">Select Product</option>
// //               {products.map((p) => (
// //                 <option key={p.id} value={p.id}>
// //                   {p.sku} — {p.name} (Stock: {p.current_stock} {p.unit})
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           {selectedProduct && (
// //             <div className="bg-primary-50 rounded-lg p-4 flex items-center gap-3">
// //               <Package className="w-5 h-5 text-primary-600" />
// //               <div>
// //                 <p className="text-sm font-medium text-primary-900">Current Stock</p>
// //                 <p className="text-2xl font-bold text-primary-700">
// //                   {selectedProduct.current_stock} <span className="text-sm font-normal">{selectedProduct.unit}</span>
// //                 </p>
// //               </div>
// //             </div>
// //           )}

// //           <div>
// //             <label className="label">Quantity to Add *</label>
// //             <input name="quantity" type="number" min="1" required className="input-field sm:w-48" placeholder="0" />
// //           </div>

// //           <div>
// //             <label className="label">Reason *</label>
// //             <input name="reason" required className="input-field" placeholder="e.g. New purchase, Return, etc." />
// //           </div>

// //           <div>
// //             <label className="label">Reference (Optional)</label>
// //             <input name="reference" className="input-field" placeholder="e.g. PO-2026-001, Invoice #123" />
// //           </div>

// //           <div className="flex items-center gap-3 pt-4">
// //             <button type="submit" disabled={loading} className="btn-success flex items-center gap-2">
// //               {loading && <Loader2 className="w-4 h-4 animate-spin" />}
// //               Add Stock
// //             </button>
// //             <Link href="/" className="btn-secondary">Cancel</Link>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }



// // "use client";

// // import { useState, useEffect, useRef } from "react";
// // import { useRouter } from "next/navigation";
// // import { stockIn, getProducts, getLogbookNames, getDocumentNumbers, searchProductsByCode } from "@/lib/actions";
// // import Link from "next/link";
// // import { ArrowLeft, ArrowUpFromLine, Loader2, Package, BookOpen, Hash, FileDigit, Search, X } from "lucide-react";

// // export default function StockInPage() {
// //   const router = useRouter();
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");
// //   const [products, setProducts] = useState<any[]>([]);
// //   const [selectedProduct, setSelectedProduct] = useState<any>(null);

// //   // Autocomplete states
// //   const [logbookNames, setLogbookNames] = useState<string[]>([]);
// //   const [docNumbers, setDocNumbers] = useState<string[]>([]);
// //   const [filteredLogbooks, setFilteredLogbooks] = useState<string[]>([]);
// //   const [filteredDocs, setFilteredDocs] = useState<string[]>([]);
// //   const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
// //   const [showLogbookDropdown, setShowLogbookDropdown] = useState(false);
// //   const [showDocDropdown, setShowDocDropdown] = useState(false);
// //   const [showProductDropdown, setShowProductDropdown] = useState(false);

// //   const [logbookName, setLogbookName] = useState("");
// //   const [documentNo, setDocumentNo] = useState("");
// //   const [logbookCode, setLogbookCode] = useState("");

// //   useEffect(() => {
// //     getProducts().then(setProducts);
// //     getLogbookNames().then(setLogbookNames);
// //     getDocumentNumbers().then(setDocNumbers);
// //   }, []);

// //   // Logbook Name autocomplete
// //   const handleLogbookChange = (value: string) => {
// //     setLogbookName(value);
// //     if (value.trim()) {
// //       const filtered = logbookNames.filter(n => n.toLowerCase().includes(value.toLowerCase()));
// //       setFilteredLogbooks(filtered);
// //       setShowLogbookDropdown(filtered.length > 0);
// //     } else {
// //       setShowLogbookDropdown(false);
// //     }
// //   };

// //   // Document No autocomplete
// //   const handleDocChange = (value: string) => {
// //     setDocumentNo(value);
// //     if (value.trim()) {
// //       const filtered = docNumbers.filter(n => n.toLowerCase().includes(value.toLowerCase()));
// //       setFilteredDocs(filtered);
// //       setShowDocDropdown(filtered.length > 0);
// //     } else {
// //       setShowDocDropdown(false);
// //     }
// //   };

// //   // Product Code autocomplete
// //   const handleCodeChange = async (value: string) => {
// //     setLogbookCode(value);
// //     if (value.trim().length >= 1) {
// //       const results = await searchProductsByCode(value);
// //       setFilteredProducts(results);
// //       setShowProductDropdown(results.length > 0);
// //     } else {
// //       setShowProductDropdown(false);
// //     }
// //   };

// //   const selectProduct = (product: any) => {
// //     setSelectedProduct(product);
// //     setLogbookCode(product.sku);
// //     setShowProductDropdown(false);
// //   };

// //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     if (!selectedProduct) {
// //       setError("Please select a product from the code search");
// //       return;
// //     }
// //     setError("");
// //     setSuccess("");
// //     setLoading(true);

// //     const form = e.currentTarget;
// //     const formData = new FormData(form);

// //     try {
// //       await stockIn({
// //         product_id: selectedProduct.id,
// //         quantity: parseInt(formData.get("quantity") as string),
// //         reason: formData.get("reason") as string,
// //         reference: formData.get("reference") as string,
// //         logbook_name: logbookName,
// //         document_no: documentNo,
// //         logbook_code: logbookCode,
// //       });
// //       setSuccess("Stock added successfully! Redirecting...");
// //       setTimeout(() => router.push("/"), 1500);
// //     } catch (err: any) {
// //       setError(err.message || "Failed to add stock");
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="p-8 max-w-2xl mx-auto">
// //       <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
// //         <ArrowLeft className="w-4 h-4" />
// //         Back to Dashboard
// //       </Link>

// //       <div className="card">
// //         <div className="flex items-center gap-3 mb-6">
// //           <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
// //             <ArrowUpFromLine className="w-5 h-5 text-success-600" />
// //           </div>
// //           <div>
// //             <h1 className="text-2xl font-bold text-gray-900">Stock In Entry</h1>
// //             <p className="text-gray-500 text-sm">Add stock to inventory logbook</p>
// //           </div>
// //         </div>

// //         {error && (
// //           <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-600 text-sm">
// //             {error}
// //           </div>
// //         )}

// //         {success && (
// //           <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg text-success-600 text-sm">
// //             {success}
// //           </div>
// //         )}

// //         <form onSubmit={handleSubmit} className="space-y-5">
// //           {/* LOGBOOK NAME - Autocomplete */}
// //           <div className="relative">
// //             <label className="label flex items-center gap-2">
// //               <BookOpen className="w-4 h-4 text-purple-600" />
// //               Logbook Name *
// //             </label>
// //             <input
// //               name="logbook_name"
// //               required
// //               className="input-field"
// //               placeholder="Type logbook name..."
// //               value={logbookName}
// //               onChange={(e) => handleLogbookChange(e.target.value)}
// //               onFocus={() => logbookName && filteredLogbooks.length > 0 && setShowLogbookDropdown(true)}
// //             />
// //             {showLogbookDropdown && filteredLogbooks.length > 0 && (
// //               <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
// //                 {filteredLogbooks.map((name, idx) => (
// //                   <div
// //                     key={idx}
// //                     className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm"
// //                     onClick={() => { setLogbookName(name); setShowLogbookDropdown(false); }}
// //                   >
// //                     {name}
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* DOCUMENT NO - Autocomplete */}
// //           <div className="relative">
// //             <label className="label flex items-center gap-2">
// //               <FileDigit className="w-4 h-4 text-blue-600" />
// //               Document No *
// //             </label>
// //             <input
// //               name="document_no"
// //               required
// //               className="input-field"
// //               placeholder="Type document number..."
// //               value={documentNo}
// //               onChange={(e) => handleDocChange(e.target.value)}
// //               onFocus={() => documentNo && filteredDocs.length > 0 && setShowDocDropdown(true)}
// //             />
// //             {showDocDropdown && filteredDocs.length > 0 && (
// //               <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
// //                 {filteredDocs.map((doc, idx) => (
// //                   <div
// //                     key={idx}
// //                     className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
// //                     onClick={() => { setDocumentNo(doc); setShowDocDropdown(false); }}
// //                   >
// //                     {doc}
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* LOGBOOK CODE (Product SKU) - Autocomplete Search */}
// //           <div className="relative">
// //             <label className="label flex items-center gap-2">
// //               <Hash className="w-4 h-4 text-amber-600" />
// //               Logbook Code (Product SKU) *
// //             </label>
// //             <div className="relative">
// //               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
// //               <input
// //                 required
// //                 className="input-field pl-10"
// //                 placeholder="Type SKU or product name to search..."
// //                 value={logbookCode}
// //                 onChange={(e) => handleCodeChange(e.target.value)}
// //                 onFocus={() => logbookCode && filteredProducts.length > 0 && setShowProductDropdown(true)}
// //               />
// //               {selectedProduct && (
// //                 <button
// //                   type="button"
// //                   onClick={() => { setSelectedProduct(null); setLogbookCode(""); }}
// //                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
// //                 >
// //                   <X className="w-4 h-4" />
// //                 </button>
// //               )}
// //             </div>
// //             {showProductDropdown && filteredProducts.length > 0 && (
// //               <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
// //                 {filteredProducts.map((p) => (
// //                   <div
// //                     key={p.id}
// //                     className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-sm flex items-center justify-between"
// //                     onClick={() => selectProduct(p)}
// //                   >
// //                     <div>
// //                       <span className="font-mono font-medium text-amber-700">{p.sku}</span>
// //                       <span className="text-gray-500 mx-2">—</span>
// //                       <span>{p.name}</span>
// //                     </div>
// //                     <span className="text-xs text-gray-400">Stock: {p.current_stock}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* Selected Product Display */}
// //           {selectedProduct && (
// //             <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
// //               <div className="flex items-center justify-between">
// //                 <div>
// //                   <p className="text-xs text-amber-600 font-medium">SELECTED PRODUCT</p>
// //                   <p className="text-lg font-bold text-gray-900">{selectedProduct.name}</p>
// //                   <p className="text-sm text-gray-500 font-mono">SKU: {selectedProduct.sku}</p>
// //                 </div>
// //                 <div className="text-right">
// //                   <p className="text-xs text-gray-500">Current Stock</p>
// //                   <p className="text-2xl font-bold text-amber-700">
// //                     {selectedProduct.current_stock} <span className="text-sm font-normal">{selectedProduct.unit}</span>
// //                   </p>
// //                 </div>
// //               </div>
// //               <input type="hidden" name="product_id" value={selectedProduct.id} />
// //             </div>
// //           )}

// //           <div>
// //             <label className="label">Quantity to Add *</label>
// //             <input name="quantity" type="number" min="1" required className="input-field sm:w-48" placeholder="0" />
// //           </div>

// //           <div>
// //             <label className="label">Reason *</label>
// //             <input name="reason" required className="input-field" placeholder="e.g. New purchase, Return, etc." />
// //           </div>

// //           <div>
// //             <label className="label">Reference (Optional)</label>
// //             <input name="reference" className="input-field" placeholder="e.g. PO-2026-001, Invoice #123" />
// //           </div>

// //           <div className="flex items-center gap-3 pt-4">
// //             <button type="submit" disabled={loading || !selectedProduct} className="btn-success flex items-center gap-2 disabled:opacity-50">
// //               {loading && <Loader2 className="w-4 h-4 animate-spin" />}
// //               Add Stock
// //             </button>
// //             <Link href="/" className="btn-secondary">Cancel</Link>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { stockIn, getLogbookNames, getDocumentNumbers, searchProductsByCode } from "@/lib/actions";
// import Link from "next/link";
// import { ArrowLeft, ArrowUpFromLine, Loader2, BookOpen, FileDigit, Hash, Search, Check } from "lucide-react";

// export default function StockInPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Form values
//   const [logbookName, setLogbookName] = useState("");
//   const [documentNo, setDocumentNo] = useState("");
//   const [logbookCode, setLogbookCode] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [reason, setReason] = useState("");
//   const [reference, setReference] = useState("");

//   // Autocomplete states
//   const [logbookNames, setLogbookNames] = useState<string[]>([]);
//   const [docNumbers, setDocNumbers] = useState<string[]>([]);
//   const [filteredLogbooks, setFilteredLogbooks] = useState<string[]>([]);
//   const [filteredDocs, setFilteredDocs] = useState<string[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
//   const [showLogbookDropdown, setShowLogbookDropdown] = useState(false);
//   const [showDocDropdown, setShowDocDropdown] = useState(false);
//   const [showProductDropdown, setShowProductDropdown] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);

//   useEffect(() => {
//     getLogbookNames().then(setLogbookNames);
//     getDocumentNumbers().then(setDocNumbers);
//   }, []);

//   const handleLogbookChange = (value: string) => {
//     setLogbookName(value);
//     if (value.trim()) {
//       const filtered = logbookNames.filter(n => n.toLowerCase().includes(value.toLowerCase()));
//       setFilteredLogbooks(filtered);
//       setShowLogbookDropdown(filtered.length > 0);
//     } else {
//       setShowLogbookDropdown(false);
//     }
//   };

//   const handleDocChange = (value: string) => {
//     setDocumentNo(value);
//     if (value.trim()) {
//       const filtered = docNumbers.filter(n => n.toLowerCase().includes(value.toLowerCase()));
//       setFilteredDocs(filtered);
//       setShowDocDropdown(filtered.length > 0);
//     } else {
//       setShowDocDropdown(false);
//     }
//   };

//   const handleCodeChange = async (value: string) => {
//     setLogbookCode(value);
//     setSelectedProduct(null);
//     if (value.trim().length >= 1) {
//       const results = await searchProductsByCode(value);
//       setFilteredProducts(results);
//       setShowProductDropdown(results.length > 0);
//     } else {
//       setFilteredProducts([]);
//       setShowProductDropdown(false);
//     }
//   };

//   const selectProduct = (product: any) => {
//     setSelectedProduct(product);
//     setLogbookCode(product.sku + " — " + product.name);
//     setShowProductDropdown(false);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!logbookName.trim()) {
//       setError("Logbook Name is required");
//       return;
//     }
//     if (!documentNo.trim()) {
//       setError("Document No is required");
//       return;
//     }
//     if (!selectedProduct) {
//       setError("Please select a product from the code search dropdown");
//       return;
//     }
//     if (!quantity || parseInt(quantity) < 1) {
//       setError("Please enter a valid quantity");
//       return;
//     }
//     if (!reason.trim()) {
//       setError("Reason is required");
//       return;
//     }

//     setLoading(true);

//     try {
//       await stockIn({
//         product_id: selectedProduct.id,
//         quantity: parseInt(quantity),
//         reason: reason,
//         reference: reference,
//         logbook_name: logbookName,
//         document_no: documentNo,
//         logbook_code: selectedProduct.sku,
//       });
//       setSuccess("Stock added successfully! Redirecting...");
//       setLogbookName("");
//       setDocumentNo("");
//       setLogbookCode("");
//       setQuantity("");
//       setReason("");
//       setReference("");
//       setSelectedProduct(null);
//       setTimeout(() => router.push("/"), 1500);
//     } catch (err: any) {
//       setError(err.message || "Failed to add stock");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 max-w-2xl mx-auto">
//       <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
//         <ArrowLeft className="w-4 h-4" />
//         Back to Dashboard
//       </Link>

//       <div className="card">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
//             <ArrowUpFromLine className="w-5 h-5 text-success-600" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Stock In Entry</h1>
//             <p className="text-gray-500 text-sm">Add stock to inventory logbook</p>
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

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* LOGBOOK NAME */}
//           <div className="relative">
//             <label className="label flex items-center gap-2">
//               <BookOpen className="w-4 h-4 text-purple-600" />
//               Logbook Name *
//             </label>
//             <input
//               type="text"
//               required
//               className="input-field"
//               placeholder="Type logbook name..."
//               value={logbookName}
//               onChange={(e) => handleLogbookChange(e.target.value)}
//               onFocus={() => logbookName && filteredLogbooks.length > 0 && setShowLogbookDropdown(true)}
//               onBlur={() => setTimeout(() => setShowLogbookDropdown(false), 200)}
//             />
//             {showLogbookDropdown && filteredLogbooks.length > 0 && (
//               <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
//                 {filteredLogbooks.map((name, idx) => (
//                   <div
//                     key={idx}
//                     className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm"
//                     onMouseDown={() => { setLogbookName(name); setShowLogbookDropdown(false); }}
//                   >
//                     {name}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* DOCUMENT NO */}
//           <div className="relative">
//             <label className="label flex items-center gap-2">
//               <FileDigit className="w-4 h-4 text-blue-600" />
//               Document No *
//             </label>
//             <input
//               type="text"
//               required
//               className="input-field"
//               placeholder="Type document number..."
//               value={documentNo}
//               onChange={(e) => handleDocChange(e.target.value)}
//               onFocus={() => documentNo && filteredDocs.length > 0 && setShowDocDropdown(true)}
//               onBlur={() => setTimeout(() => setShowDocDropdown(false), 200)}
//             />
//             {showDocDropdown && filteredDocs.length > 0 && (
//               <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
//                 {filteredDocs.map((doc, idx) => (
//                   <div
//                     key={idx}
//                     className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
//                     onMouseDown={() => { setDocumentNo(doc); setShowDocDropdown(false); }}
//                   >
//                     {doc}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* LOGBOOK CODE */}
//           <div className="relative">
//             <label className="label flex items-center gap-2">
//               <Hash className="w-4 h-4 text-amber-600" />
//               Logbook Code (Product SKU) *
//             </label>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 required
//                 className={`input-field pl-10 ${selectedProduct ? "border-success-500 bg-success-50" : ""}`}
//                 placeholder="Type SKU or product name to search..."
//                 value={logbookCode}
//                 onChange={(e) => handleCodeChange(e.target.value)}
//                 onFocus={() => logbookCode && filteredProducts.length > 0 && !selectedProduct && setShowProductDropdown(true)}
//               />
//               {selectedProduct && (
//                 <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                   <Check className="w-5 h-5 text-success-600" />
//                 </div>
//               )}
//             </div>
//             {showProductDropdown && filteredProducts.length > 0 && !selectedProduct && (
//               <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
//                 {filteredProducts.map((p) => (
//                   <div
//                     key={p.id}
//                     className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-sm flex items-center justify-between"
//                     onMouseDown={() => selectProduct(p)}
//                   >
//                     <div>
//                       <span className="font-mono font-medium text-amber-700">{p.sku}</span>
//                       <span className="text-gray-500 mx-2">—</span>
//                       <span>{p.name}</span>
//                     </div>
//                     <span className="text-xs text-gray-400">Stock: {p.current_stock}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Selected Product */}
//           {selectedProduct && (
//             <div className="bg-success-50 rounded-lg p-4 border border-success-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs text-success-700 font-medium uppercase tracking-wide">Selected Product</p>
//                   <p className="text-lg font-bold text-gray-900">{selectedProduct.name}</p>
//                   <p className="text-sm text-gray-500 font-mono">SKU: {selectedProduct.sku}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs text-gray-500">Current Stock</p>
//                   <p className="text-2xl font-bold text-success-700">
//                     {selectedProduct.current_stock} <span className="text-sm font-normal">{selectedProduct.unit}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div>
//             <label className="label">Quantity to Add *</label>
//             <input
//               type="number"
//               min="1"
//               required
//               className="input-field sm:w-48"
//               placeholder="0"
//               value={quantity}
//               onChange={(e) => setQuantity(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="label">Reason *</label>
//             <input
//               type="text"
//               required
//               className="input-field"
//               placeholder="e.g. New purchase, Return, etc."
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="label">Reference (Optional)</label>
//             <input
//               type="text"
//               className="input-field"
//               placeholder="e.g. PO-2026-001, Invoice #123"
//               value={reference}
//               onChange={(e) => setReference(e.target.value)}
//             />
//           </div>

//           <div className="flex items-center gap-3 pt-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn-success flex items-center gap-2 disabled:opacity-60"
//             >
//               {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//               Add Stock
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
// import { getStockInReport, getProducts } from "@/lib/actions";
// import Link from "next/link";
// import { FileText, Printer, ArrowLeft, Search, Calendar, ArrowUpFromLine } from "lucide-react";

// export default function StockInReportPage() {
//   const [loading, setLoading] = useState(false);
//   const [report, setReport] = useState<any[]>([]);
//   const [products, setProducts] = useState<any[]>([]);
//   const [filters, setFilters] = useState({
//     startDate: "",
//     endDate: "",
//     productId: "",
//   });

//   useEffect(() => {
//     getProducts().then(setProducts);
//     loadReport();
//   }, []);

//   const loadReport = async (override?: any) => {
//     setLoading(true);
//     const f = override || filters;
//     const data = await getStockInReport({
//       startDate: f.startDate || undefined,
//       endDate: f.endDate || undefined,
//       productId: f.productId ? parseInt(f.productId) : undefined,
//     });
//     setReport(data);
//     setLoading(false);
//   };

//   const handleFilter = (e: React.FormEvent) => {
//     e.preventDefault();
//     loadReport();
//   };

//   const totalQuantity = report.reduce((sum, r) => sum + parseInt(r.quantity), 0);

//   return (
//     <div className="p-8 max-w-7xl mx-auto">
//       <div className="no-print">
//         <div className="flex items-center gap-4 mb-6">
//           <Link href="/reports" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700">
//             <ArrowLeft className="w-4 h-4" />
//             Back to Reports
//           </Link>
//         </div>

//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Stock In / Receiving Report</h1>
//             <p className="text-gray-500 mt-1">Print stock receiving records for verification & sign</p>
//           </div>
//           <div className="flex gap-2">
//             <Link href="/reports" className="btn-secondary inline-flex items-center gap-2">
//               <FileText className="w-4 h-4" />
//               Issuance Report
//             </Link>
//             <button onClick={() => window.print()} className="btn-primary inline-flex items-center gap-2">
//               <Printer className="w-4 h-4" />
//               Print Report
//             </button>
//           </div>
//         </div>

//         <div className="card mb-6">
//           <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <div>
//               <label className="label text-xs">Start Date</label>
//               <input type="date" className="input-field" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
//             </div>
//             <div>
//               <label className="label text-xs">End Date</label>
//               <input type="date" className="input-field" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
//             </div>
//             <div>
//               <label className="label text-xs">Product</label>
//               <select className="input-field" value={filters.productId} onChange={(e) => setFilters({ ...filters, productId: e.target.value })}>
//                 <option value="">All Products</option>
//                 {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//               </select>
//             </div>
//             <div className="sm:col-span-3 flex gap-2">
//               <button type="submit" className="btn-primary flex items-center gap-2"><Search className="w-4 h-4" />Generate</button>
//               <button type="button" onClick={() => { setFilters({ startDate: "", endDate: "", productId: "" }); loadReport({ startDate: "", endDate: "", productId: "" }); }} className="btn-secondary">Reset</button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <div className="card">
//         <div className="print-only text-center mb-6 pb-4 border-b-2 border-gray-800">
//           <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">Stock Receiving Report</h1>
//           <div className="mt-3 text-sm text-gray-600 space-y-1">
//             <p className="flex items-center justify-center gap-2"><Calendar className="w-4 h-4" />Period: {filters.startDate || "Beginning"} to {filters.endDate || "Today"}</p>
//             <p>Generated: {new Date().toLocaleDateString('en-GB')}</p>
//           </div>
//         </div>

//         <div className="no-print flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//             <ArrowUpFromLine className="w-5 h-5 text-success-600" />
//             Stock In Records
//           </h3>
//           <div className="text-sm text-gray-500">
//             Records: <span className="font-bold text-gray-900">{report.length}</span> | 
//             Total Qty: <span className="font-bold text-gray-900">{totalQuantity}</span>
//           </div>
//         </div>

//         {loading ? (
//           <div className="text-center py-12 text-gray-500 no-print"><div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />Loading...</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="border-b-2 border-gray-800">
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">#</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Date</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Logbook</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Doc No</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Code (SKU)</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Product</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Qty</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Previous</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">New Stock</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Reason</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">By</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100 w-32">Sign / Verify</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {report.length === 0 ? (
//                   <tr><td colSpan={12} className="px-3 py-8 text-center text-gray-500"><FileText className="w-12 h-12 mx-auto mb-3 text-gray-300 no-print" />No records found</td></tr>
//                 ) : (
//                   report.map((r, idx) => (
//                     <tr key={r.id} className="border-b border-gray-200 hover:bg-gray-50">
//                       <td className="px-2 py-2 text-sm text-gray-500">{idx + 1}</td>
//                       <td className="px-2 py-2 text-sm whitespace-nowrap">{new Date(r.created_at).toLocaleDateString('en-GB')}</td>
//                       <td className="px-2 py-2 text-sm font-medium text-purple-700">{r.logbook_name || "—"}</td>
//                       <td className="px-2 py-2 text-sm font-mono">{r.document_no || "—"}</td>
//                       <td className="px-2 py-2 text-sm font-mono text-gray-500">{r.logbook_code || r.product_sku}</td>
//                       <td className="px-2 py-2 text-sm font-medium">{r.product_name}</td>
//                       <td className="px-2 py-2 text-sm font-bold text-success-700">+{r.quantity}</td>
//                       <td className="px-2 py-2 text-sm text-gray-500">{r.previous_stock}</td>
//                       <td className="px-2 py-2 text-sm font-bold">{r.new_stock}</td>
//                       <td className="px-2 py-2 text-sm text-gray-500 max-w-xs truncate">{r.reason}</td>
//                       <td className="px-2 py-2 text-sm">{r.created_by_name || 'Admin'}</td>
//                       <td className="px-2 py-2 text-sm border-l border-gray-300"><div className="h-8 border-b border-gray-400"></div></td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div className="print-only mt-8 pt-4 border-t-2 border-gray-800">
//           <div className="grid grid-cols-2 gap-8 mt-4">
//             <div>
//               <p className="text-sm font-bold text-gray-900 mb-8">Prepared By:</p>
//               <div className="border-t border-gray-800 pt-2">
//                 <p className="text-sm text-gray-600">Name: _______________________</p>
//                 <p className="text-sm text-gray-600 mt-1">Sign: _______________________</p>
//                 <p className="text-sm text-gray-600 mt-1">Date: _______________________</p>
//               </div>
//             </div>
//             <div>
//               <p className="text-sm font-bold text-gray-900 mb-8">Verified By:</p>
//               <div className="border-t border-gray-800 pt-2">
//                 <p className="text-sm text-gray-600">Name: _______________________</p>
//                 <p className="text-sm text-gray-600 mt-1">Sign: _______________________</p>
//                 <p className="text-sm text-gray-600 mt-1">Date: _______________________</p>
//               </div>
//             </div>
//           </div>
//           <p className="text-center text-xs text-gray-500 mt-8">— End of Stock Receiving Report —</p>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { getStockInReport, getProducts, stockIn } from "@/lib/actions";
// import Link from "next/link";
// import { FileText, Printer, ArrowLeft, Search, Calendar, ArrowUpFromLine, Loader2, Plus, Package, User, Boxes, X, FileSearch } from "lucide-react";

// export default function StockInReportPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [report, setReport] = useState<any[]>([]);
//   const [products, setProducts] = useState<any[]>([]);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);
//   const [adding, setAdding] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Product search states
//   const [productSearch, setProductSearch] = useState("");
//   const [showProductDropdown, setShowProductDropdown] = useState(false);
//   const productDropdownRef = useRef<HTMLDivElement>(null);

//   // Form states — NO document_no input, DB will handle it
//   const [productId, setProductId] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [reason, setReason] = useState("Stock Received");
//   const [personName, setPersonName] = useState("");
//   const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);

//   // Filter states
//   const [filters, setFilters] = useState({
//     startDate: "",
//     endDate: "",
//     productId: "",
//     documentNo: "",
//   });

//   // Click outside to close dropdown
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node)) {
//         setShowProductDropdown(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const loadProducts = async () => {
//     const data = await getProducts();
//     setProducts(data);
//   };

//   const loadReport = async (override?: any) => {
//     setLoading(true);
//     const f = override || filters;
//     const data = await getStockInReport({
//       startDate: f.startDate || undefined,
//       endDate: f.endDate || undefined,
//       productId: f.productId ? parseInt(f.productId) : undefined,
//       documentNo: f.documentNo || undefined,
//     });
//     setReport(data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadProducts();
//     loadReport();
//   }, []);

//   // Filter products based on search
//   const filteredProducts = productSearch.trim() === ""
//     ? products
//     : products.filter(p =>
//         p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
//         p.sku.toLowerCase().includes(productSearch.toLowerCase())
//       );

//   const handleProductSelect = (product: any) => {
//     setProductId(product.id.toString());
//     setSelectedProduct(product);
//     setProductSearch(`${product.sku} — ${product.name}`);
//     setShowProductDropdown(false);
//   };

//   const clearProduct = () => {
//     setProductId("");
//     setSelectedProduct(null);
//     setProductSearch("");
//   };

//   const handleAddStock = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!productId) {
//       setError("Please select a product");
//       return;
//     }
//     if (!quantity || parseInt(quantity) < 1) {
//       setError("Please enter a valid quantity");
//       return;
//     }
//     if (!personName.trim()) {
//       setError("Please enter your name");
//       return;
//     }

//     setAdding(true);
//     try {
//       // document_no & logbook_name will be auto-generated by server/DB
//       await stockIn({
//         product_id: parseInt(productId),
//         quantity: parseInt(quantity),
//         reason: `${reason} | Added by: ${personName} | Date: ${entryDate}`,
//       });
//       setSuccess("Stock added successfully!");
//       setProductId("");
//       setQuantity("");
//       setSelectedProduct(null);
//       setProductSearch("");
//       loadReport();
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err: any) {
//       setError(err.message || "Failed to add stock");
//     } finally {
//       setAdding(false);
//     }
//   };

//   const handleFilter = (e: React.FormEvent) => {
//     e.preventDefault();
//     loadReport();
//   };

//   const totalQuantity = report.reduce((sum, r) => sum + parseInt(r.quantity), 0);

//   return (
//     <div className="p-8 max-w-7xl mx-auto">
//       {/* SCREEN ONLY: Header */}
//       <div className="no-print">
//         <div className="flex items-center gap-4 mb-6">
//           <Link href="/reports" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700">
//             <ArrowLeft className="w-4 h-4" />
//             Back to Reports
//           </Link>
//         </div>

//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Stock In / Receiving Logbook</h1>
//             <p className="text-gray-500 mt-1">Add stock entries and print receiving reports</p>
//           </div>
//           <div className="flex gap-2">
//             <Link href="/reports" className="btn-danger inline-flex items-center gap-2">
//               <FileText className="w-4 h-4" />
//               Issue Report
//             </Link>
//             <button onClick={() => window.print()} className="btn-primary inline-flex items-center gap-2">
//               <Printer className="w-4 h-4" />
//               Print Report
//             </button>
//           </div>
//         </div>

//         {/* ADD STOCK IN FORM */}
//         <div className="card mb-6 border-2 border-success-200 bg-success-50/30">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//             <Plus className="w-5 h-5 text-success-600" />
//             Add Stock In Entry
//           </h3>

//           {error && (
//             <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-600 text-sm">
//               {error}
//             </div>
//           )}
//           {success && (
//             <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg text-success-600 text-sm">
//               {success}
//             </div>
//           )}

//           <form onSubmit={handleAddStock} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* PRODUCT SEARCH BAR */}
//             <div className="sm:col-span-2" ref={productDropdownRef}>
//               <label className="label flex items-center gap-2">
//                 <Package className="w-4 h-4 text-primary-600" />
//                 Product *
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   className="input-field pl-10 pr-10"
//                   placeholder="Search by name or SKU..."
//                   value={productSearch}
//                   onChange={(e) => {
//                     setProductSearch(e.target.value);
//                     setShowProductDropdown(true);
//                     if (selectedProduct && e.target.value !== `${selectedProduct.sku} — ${selectedProduct.name}`) {
//                       setProductId("");
//                       setSelectedProduct(null);
//                     }
//                   }}
//                   onFocus={() => setShowProductDropdown(true)}
//                 />
//                 {productSearch && (
//                   <button
//                     type="button"
//                     onClick={clearProduct}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
                
//                 {/* Dropdown Results */}
//                 {showProductDropdown && filteredProducts.length > 0 && (
//                   <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                     {filteredProducts.map((p) => (
//                       <button
//                         key={p.id}
//                         type="button"
//                         onClick={() => handleProductSelect(p)}
//                         className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center justify-between"
//                       >
//                         <div>
//                           <div className="font-medium text-gray-900 text-sm">{p.name}</div>
//                           <div className="text-xs text-gray-500">{p.sku}</div>
//                         </div>
//                         <div className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
//                           Stock: {p.current_stock}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//                 {showProductDropdown && productSearch && filteredProducts.length === 0 && (
//                   <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-400 text-sm">
//                     No products found
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div>
//               <label className="label flex items-center gap-2">
//                 <Boxes className="w-4 h-4 text-emerald-600" />
//                 Quantity *
//               </label>
//               <input
//                 type="number"
//                 min="1"
//                 required
//                 className="input-field"
//                 placeholder="0"
//                 value={quantity}
//                 onChange={(e) => setQuantity(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="label flex items-center gap-2">
//                 <Calendar className="w-4 h-4 text-blue-600" />
//                 Date *
//               </label>
//               <input
//                 type="date"
//                 required
//                 className="input-field"
//                 value={entryDate}
//                 onChange={(e) => setEntryDate(e.target.value)}
//               />
//             </div>

//             <div className="sm:col-span-2">
//               <label className="label flex items-center gap-2">
//                 <User className="w-4 h-4 text-purple-600" />
//                 Person Name (Adding Stock) *
//               </label>
//               <input
//                 type="text"
//                 required
//                 className="input-field"
//                 placeholder="e.g. Ahmed Hassan"
//                 value={personName}
//                 onChange={(e) => setPersonName(e.target.value)}
//               />
//             </div>

//             <div className="sm:col-span-2">
//               <label className="label">Reason</label>
//               <input
//                 type="text"
//                 className="input-field"
//                 placeholder="e.g. New Purchase"
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//               />
//             </div>

//             <div className="sm:col-span-2 lg:col-span-4">
//               <button
//                 type="submit"
//                 disabled={adding}
//                 className="btn-success inline-flex items-center gap-2 disabled:opacity-60"
//               >
//                 {adding && <Loader2 className="w-4 h-4 animate-spin" />}
//                 <Plus className="w-4 h-4" />
//                 Add to Stock In
//               </button>
//             </div>
//           </form>

//           {selectedProduct && (
//             <div className="mt-4 p-3 bg-white rounded-lg border border-success-200 flex items-center justify-between">
//               <div>
//                 <span className="text-xs text-gray-500">Selected:</span>
//                 <span className="ml-2 font-medium">{selectedProduct.name}</span>
//                 <span className="ml-2 text-xs text-gray-400">({selectedProduct.sku})</span>
//               </div>
//               <div className="text-sm text-gray-500">
//                 Current Stock: <span className="font-bold text-gray-900">{selectedProduct.current_stock}</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* FILTERS */}
//         <div className="card mb-6">
//           <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-5 gap-4">
//             <div>
//               <label className="label flex items-center gap-2">
//                 <Calendar className="w-4 h-4 text-gray-400" />
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 className="input-field"
//                 value={filters.startDate}
//                 onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
//               />
//             </div>
//             <div>
//               <label className="label flex items-center gap-2">
//                 <Calendar className="w-4 h-4 text-gray-400" />
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 className="input-field"
//                 value={filters.endDate}
//                 onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
//               />
//             </div>
//             <div>
//               <label className="label flex items-center gap-2">
//                 <Package className="w-4 h-4 text-gray-400" />
//                 Product
//               </label>
//               <select
//                 className="input-field"
//                 value={filters.productId}
//                 onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
//               >
//                 <option value="">All Products</option>
//                 {products.map((p) => (
//                   <option key={p.id} value={p.id}>
//                     {p.sku} — {p.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label flex items-center gap-2">
//                 <FileSearch className="w-4 h-4 text-gray-400" />
//                 Document No
//               </label>
//               <input
//                 type="text"
//                 className="input-field"
//                 placeholder="Search Doc No..."
//                 value={filters.documentNo}
//                 onChange={(e) => setFilters({ ...filters, documentNo: e.target.value.toUpperCase() })}
//               />
//             </div>
//             <div className="flex items-end">
//               <button type="submit" className="btn-primary inline-flex items-center gap-2 w-full">
//                 <Search className="w-4 h-4" />
//                 Apply Filters
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* SUMMARY CARDS */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//           <div className="card bg-primary-50 border-primary-200">
//             <div className="text-sm text-primary-600 font-medium">Total Entries</div>
//             <div className="text-2xl font-bold text-primary-900 mt-1">{report.length}</div>
//           </div>
//           <div className="card bg-success-50 border-success-200">
//             <div className="text-sm text-success-600 font-medium">Total Quantity Received</div>
//             <div className="text-2xl font-bold text-success-900 mt-1">{totalQuantity}</div>
//           </div>
//           <div className="card bg-warning-50 border-warning-200">
//             <div className="text-sm text-warning-600 font-medium">Products Affected</div>
//             <div className="text-2xl font-bold text-warning-900 mt-1">
//               {new Set(report.map((r) => r.product_id)).size}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* PRINT HEADER */}
//       <div className="print-only hidden print:block mb-8 text-center">
//         <h1 className="text-2xl font-bold text-gray-900">Stock In / Receiving Logbook</h1>
//         <p className="text-gray-500 mt-1">
//           {filters.startDate && filters.endDate
//             ? `Period: ${filters.startDate} to ${filters.endDate}`
//             : filters.startDate
//             ? `From: ${filters.startDate}`
//             : filters.endDate
//             ? `Until: ${filters.endDate}`
//             : "All Records"}
//         </p>
//         {filters.documentNo && (
//           <p className="text-gray-600 mt-1">Document No: {filters.documentNo}</p>
//         )}
//         <p className="text-gray-400 text-sm mt-1">Printed on: {new Date().toLocaleDateString()}</p>
//       </div>

//       {/* REPORT TABLE */}
//       <div className="card overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-left">
//             <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
//               <tr>
//                 <th className="px-4 py-3">Date</th>
//                 <th className="px-4 py-3">Document No</th>
//                 <th className="px-4 py-3">Product</th>
//                 <th className="px-4 py-3">SKU</th>
//                 <th className="px-4 py-3 text-right">Qty</th>
//                 <th className="px-4 py-3">Reason</th>
//                 <th className="px-4 py-3">Added By</th>
//                 <th className="px-4 py-3 no-print">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {loading ? (
//                 <tr>
//                   <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
//                     <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
//                     Loading report...
//                   </td>
//                 </tr>
//               ) : report.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
//                     <ArrowUpFromLine className="w-8 h-8 mx-auto mb-2 text-gray-300" />
//                     No stock entries found for the selected filters.
//                   </td>
//                 </tr>
//               ) : (
//                 report.map((entry) => (
//                   <tr key={entry.id} className="hover:bg-gray-50/50">
//                     <td className="px-4 py-3 whitespace-nowrap text-gray-900">
//                       {new Date(entry.created_at).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 font-mono text-xs font-semibold border border-orange-200">
//                         <FileSearch className="w-3 h-3" />
//                         {entry.document_no || "N/A"}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 font-medium text-gray-900">
//                       {entry.product?.name || "Unknown"}
//                     </td>
//                     <td className="px-4 py-3 text-gray-500 font-mono text-xs">
//                       {entry.product?.sku || "-"}
//                     </td>
//                     <td className="px-4 py-3 text-right font-bold text-success-600">
//                       +{entry.quantity}
//                     </td>
//                     <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
//                       {entry.reason || "-"}
//                     </td>
//                     <td className="px-4 py-3 text-gray-500 text-xs">
//                       {entry.reason?.split("Added by:")[1]?.split("|")[0]?.trim() || "-"}
//                     </td>
//                     <td className="px-4 py-3 no-print">
//                       <span className="text-xs text-gray-400">
//                         #{entry.id}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//             {report.length > 0 && (
//               <tfoot className="bg-gray-50 font-semibold text-gray-900">
//                 <tr>
//                   <td className="px-4 py-3" colSpan={4}>Total</td>
//                   <td className="px-4 py-3 text-right text-success-600">{totalQuantity}</td>
//                   <td colSpan={3}></td>
//                 </tr>
//               </tfoot>
//             )}
//           </table>
//         </div>
//       </div>

//       {/* PRINT FOOTER */}
//       <div className="print-only hidden print:block mt-8 pt-4 border-t text-center text-gray-400 text-xs">
//         <p>Confidential — Internal Use Only</p>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getStockInReport, getProducts, getDocumentNumbers, stockIn } from "@/lib/actions";
import Link from "next/link";
import { FileText, Printer, ArrowLeft, Search, Calendar, ArrowUpFromLine, Loader2, Plus, Package, User, Boxes, X, FileSearch } from "lucide-react";

export default function StockInReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Product search states
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const productDropdownRef = useRef<HTMLDivElement>(null);

  // Document No search states
  const [docNumbers, setDocNumbers] = useState<string[]>([]);
  const [docNoSearch, setDocNoSearch] = useState("");
  const [showDocNoDropdown, setShowDocNoDropdown] = useState(false);
  const docNoDropdownRef = useRef<HTMLDivElement>(null);

  // Form states
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("Stock Received");
  const [personName, setPersonName] = useState("");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter states
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    productId: "",
    documentNo: "",
  });

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
      if (docNoDropdownRef.current && !docNoDropdownRef.current.contains(event.target as Node)) {
        setShowDocNoDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const loadDocNumbers = async () => {
    const data = await getDocumentNumbers();
    setDocNumbers(data);
  };

  const loadReport = async (override?: any) => {
    setLoading(true);
    const f = override || filters;
    const data = await getStockInReport({
      startDate: f.startDate || undefined,
      endDate: f.endDate || undefined,
      productId: f.productId ? parseInt(f.productId) : undefined,
      documentNo: f.documentNo || undefined,
    });
    setReport(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
    loadDocNumbers();
    loadReport();
  }, []);

  // Filter products based on search (name, SKU, description)
  const filteredProducts = productSearch.trim() === ""
    ? products
    : products.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(productSearch.toLowerCase()))
      );

  // Filter document numbers based on search
  const filteredDocNumbers = docNoSearch.trim() === ""
    ? docNumbers
    : docNumbers.filter(d =>
        d.toLowerCase().includes(docNoSearch.toLowerCase())
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

  const handleDocNoSelect = (docNo: string) => {
    setFilters({ ...filters, documentNo: docNo });
    setDocNoSearch(docNo);
    setShowDocNoDropdown(false);
  };

  const clearDocNo = () => {
    setFilters({ ...filters, documentNo: "" });
    setDocNoSearch("");
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!productId) {
      setError("Please select a product");
      return;
    }
    if (!quantity || parseInt(quantity) < 1) {
      setError("Please enter a valid quantity");
      return;
    }
    if (!personName.trim()) {
      setError("Please enter your name");
      return;
    }

    setAdding(true);
    try {
     await stockIn({
  product_id: parseInt(productId),
  quantity: parseInt(quantity),
  reason: `${reason} | Added by: ${personName} | Date: ${entryDate}`,
  reference: `Stock In - ${entryDate}`,
});
      setSuccess("Stock added successfully!");
      setProductId("");
      setQuantity("");
      setSelectedProduct(null);
      setProductSearch("");
      loadReport();
      loadDocNumbers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to add stock");
    } finally {
      setAdding(false);       
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    loadReport();
  };

  const totalQuantity = report.reduce((sum, r) => sum + parseInt(r.quantity), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* SCREEN ONLY: Header */}
      <div className="no-print">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/reports" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stock In / Receiving Logbook</h1>
            <p className="text-gray-500 mt-1">Add stock entries and print receiving reports</p>
          </div>
          <div className="flex gap-2">
            <Link href="/reports" className="btn-danger inline-flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Issue Report
            </Link>
            <button onClick={() => window.print()} className="btn-primary inline-flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print Report
            </button>
          </div>
        </div>

        {/* ADD STOCK IN FORM */}
        <div className="card mb-6 border-2 border-success-200 bg-success-50/30">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-success-600" />
            Add Stock In Entry
          </h3>

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

          <form onSubmit={handleAddStock} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* PRODUCT SEARCH BAR */}
            <div className="sm:col-span-2" ref={productDropdownRef}>
              <label className="label flex items-center gap-2">
                <Package className="w-4 h-4 text-primary-600" />
                Product *
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  className="input-field pl-10 pr-10"
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

            <div>
              <label className="label flex items-center gap-2">
                <Boxes className="w-4 h-4 text-emerald-600" />
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                required
                className="input-field"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Date *
              </label>
              <input
                type="date"
                required
                className="input-field"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="label flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                Person Name (Adding Stock) *
              </label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Ahmed Hassan"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="label">Reason</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. New Purchase"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <button
                type="submit"
                disabled={adding}
                className="btn-success inline-flex items-center gap-2 disabled:opacity-60"
              >
                {adding && <Loader2 className="w-4 h-4 animate-spin" />}
                <Plus className="w-4 h-4" />
                Add to Stock In
              </button>
            </div>
          </form>

          {selectedProduct && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-success-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">Selected:</span>
                <span className="ml-2 font-medium">{selectedProduct.name}</span>
                <span className="ml-2 text-xs text-gray-400">({selectedProduct.sku})</span>
              </div>
              <div className="text-sm text-gray-500">
                Current Stock: <span className="font-bold text-gray-900">{selectedProduct.current_stock}</span>
              </div>
            </div>
          )}
        </div>

        {/* FILTERS */}
        <div className="card mb-6">
          <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div>
              <label className="label flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Start Date
              </label>
              <input
                type="date"
                className="input-field"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="label flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                End Date
              </label>
              <input
                type="date"
                className="input-field"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            <div>
              <label className="label flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                Product
              </label>
              <select
                className="input-field"
                value={filters.productId}
                onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
              >
                <option value="">All Products</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.sku} — {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DOCUMENT NO SEARCH BAR */}
            <div ref={docNoDropdownRef}>
              <label className="label flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-gray-400" />
                Document No
              </label>
              <div className="relative">
                <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  className="input-field pl-10 pr-10"
                  placeholder="Search Doc No..."
                  value={docNoSearch}
                  onChange={(e) => {
                    setDocNoSearch(e.target.value);
                    setShowDocNoDropdown(true);
                    if (filters.documentNo && e.target.value !== filters.documentNo) {
                      setFilters({ ...filters, documentNo: "" });
                    }
                  }}
                  onFocus={() => setShowDocNoDropdown(true)}
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

                {showDocNoDropdown && filteredDocNumbers.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredDocNumbers.map((docNo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleDocNoSelect(docNo)}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center gap-2"
                      >
                        <FileSearch className="w-3.5 h-3.5 text-orange-500" />
                        <span className="font-mono text-sm text-gray-900">{docNo}</span>
                      </button>
                    ))}
                  </div>
                )}
                {showDocNoDropdown && docNoSearch && filteredDocNumbers.length === 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-400 text-sm">
                    No document numbers found
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-end">
              <button type="submit" className="btn-primary inline-flex items-center gap-2 w-full">
                <Search className="w-4 h-4" />
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card bg-primary-50 border-primary-200">
            <div className="text-sm text-primary-600 font-medium">Total Entries</div>
            <div className="text-2xl font-bold text-primary-900 mt-1">{report.length}</div>
          </div>
          <div className="card bg-success-50 border-success-200">
            <div className="text-sm text-success-600 font-medium">Total Quantity Received</div>
            <div className="text-2xl font-bold text-success-900 mt-1">{totalQuantity}</div>
          </div>
          <div className="card bg-warning-50 border-warning-200">
            <div className="text-sm text-warning-600 font-medium">Products Affected</div>
            <div className="text-2xl font-bold text-warning-900 mt-1">
              {new Set(report.map((r) => r.product_id)).size}
            </div>
          </div>
        </div>
      </div>

      {/* PRINT HEADER */}
      <div className="print-only hidden print:block mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Stock In / Receiving Logbook</h1>
        <p className="text-gray-500 mt-1">
          {filters.startDate && filters.endDate
            ? `Period: ${filters.startDate} to ${filters.endDate}`
            : filters.startDate
            ? `From: ${filters.startDate}`
            : filters.endDate
            ? `Until: ${filters.endDate}`
            : "All Records"}
        </p>
        {filters.documentNo && (
          <p className="text-gray-600 mt-1">Document No: {filters.documentNo}</p>
        )}
        <p className="text-gray-400 text-sm mt-1">Printed on: {new Date().toLocaleDateString()}</p>
      </div>

   {/* REPORT TABLE */}
<div className="card overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
        <tr>
          <th className="px-4 py-3">Date</th>
          <th className="px-4 py-3">Document No</th>
          <th className="px-4 py-3">Product</th>
          <th className="px-4 py-3">SKU</th>
          <th className="px-4 py-3 text-right">Qty</th>
          <th className="px-4 py-3">Reason</th>
          <th className="px-4 py-3">Added By</th>
          <th className="px-4 py-3 no-print">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {loading ? (
          <tr>
            <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading report...
            </td>
          </tr>
        ) : report.length === 0 ? (
          <tr>
            <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
              <ArrowUpFromLine className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              No stock entries found for the selected filters.
            </td>
          </tr>
        ) : (
          report.map((entry) => (
            <tr key={entry.id} className="hover:bg-gray-50/50">
              <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                {new Date(entry.created_at).toLocaleDateString()}
              </td>
             <td className="px-4 py-3">
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 font-mono text-xs font-semibold border border-orange-200">
    <FileSearch className="w-3 h-3" />
    {entry.product?.description || "—"}
  </span>
</td>
              <td className="px-4 py-3 font-medium text-gray-900">
                {entry.product?.name || "Unknown"}
              </td>
              <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                {entry.product?.sku || "-"}
              </td>
              <td className="px-4 py-3 text-right font-bold text-success-600">
                +{entry.quantity}
              </td>
              <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                {entry.reason || "-"}
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">
                {entry.created_by_name || "-"}
              </td>
              <td className="px-4 py-3 no-print">
                <span className="text-xs text-gray-400">
                  #{entry.id}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
      {report.length > 0 && (
        <tfoot className="bg-gray-50 font-semibold text-gray-900">
          <tr>
            <td className="px-4 py-3" colSpan={4}>Total</td>
            <td className="px-4 py-3 text-right text-success-600">{totalQuantity}</td>
            <td colSpan={3}></td>
          </tr>
        </tfoot>
      )}
    </table>
  </div>
</div>

      {/* PRINT FOOTER */}
      <div className="print-only hidden print:block mt-8 pt-4 border-t text-center text-gray-400 text-xs">
        <p>Confidential — Internal Use Only</p>
      </div>
    </div>
  );
}