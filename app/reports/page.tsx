// "use client";

// import { useState, useEffect } from "react";
// import { getIssuanceReport, getProducts, getDepartments } from "@/lib/actions";
// import Link from "next/link";
// import { FileText, Printer, ArrowLeft, Search, Calendar } from "lucide-react";

// export default function ReportsPage() {
//   const [loading, setLoading] = useState(false);
//   const [report, setReport] = useState<any[]>([]);
//   const [products, setProducts] = useState<any[]>([]);
//   const [departments, setDepartments] = useState<any[]>([]);
//   const [filters, setFilters] = useState({
//     startDate: "",
//     endDate: "",
//     department: "",
//     productId: "",
//   });

//   useEffect(() => {
//     getProducts().then(setProducts);
//     getDepartments().then(setDepartments);
//     loadReport();
//   }, []);

//   const loadReport = async (override?: any) => {
//     setLoading(true);
//     const f = override || filters;
//     const data = await getIssuanceReport({
//       startDate: f.startDate || undefined,
//       endDate: f.endDate || undefined,
//       department: f.department || undefined,
//       productId: f.productId ? parseInt(f.productId) : undefined,
//     });
//     setReport(data);
//     setLoading(false);
//   };

//   const handleFilter = (e: React.FormEvent) => {
//     e.preventDefault();
//     loadReport();
//   };

//   const totalQuantity = report.reduce((sum, r) => sum + parseInt(r.quantity_out), 0);

//   return (
//     <div className="p-8 max-w-7xl mx-auto">
//       {/* SCREEN ONLY: Header & Filters */}
//       <div className="no-print">
//         <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
//           <ArrowLeft className="w-4 h-4" />
//           Back to Dashboard
//         </Link>

//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Issuance Logbook Report</h1>
//             <p className="text-gray-500 mt-1">Print stock issue records</p>
//           </div>
//           <button
//             onClick={() => window.print()}
//             className="btn-primary inline-flex items-center gap-2 self-start"
//           >
//             <Printer className="w-4 h-4" />
//             Print Report
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="card mb-6">
//           <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//             <div>
//               <label className="label text-xs">Start Date</label>
//               <input
//                 type="date"
//                 className="input-field"
//                 value={filters.startDate}
//                 onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
//               />
//             </div>
//             <div>
//               <label className="label text-xs">End Date</label>
//               <input
//                 type="date"
//                 className="input-field"
//                 value={filters.endDate}
//                 onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
//               />
//             </div>
//             <div>
//               <label className="label text-xs">Department</label>
//               <select
//                 className="input-field"
//                 value={filters.department}
//                 onChange={(e) => setFilters({ ...filters, department: e.target.value })}
//               >
//                 <option value="">All Departments</option>
//                 {departments.map((d) => (
//                   <option key={d.value} value={d.value}>{d.label}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label text-xs">Product</label>
//               <select
//                 className="input-field"
//                 value={filters.productId}
//                 onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
//               >
//                 <option value="">All Products</option>
//                 {products.map((p) => (
//                   <option key={p.id} value={p.id}>{p.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="sm:col-span-4 flex gap-2">
//               <button type="submit" className="btn-primary flex items-center gap-2">
//                 <Search className="w-4 h-4" />
//                 Generate Report
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setFilters({ startDate: "", endDate: "", department: "", productId: "" });
//                   loadReport({ startDate: "", endDate: "", department: "", productId: "" });
//                 }}
//                 className="btn-secondary"
//               >
//                 Reset
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* PRINT + SCREEN: Report Content */}
//       <div className="card">
//         {/* PRINT HEADER */}
//         <div className="print-only text-center mb-6 pb-4 border-b-2 border-gray-800">
//           <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">Stock Issue Logbook</h1>
//           <div className="mt-3 text-sm text-gray-600 space-y-1">
//             <p className="flex items-center justify-center gap-2">
//               <Calendar className="w-4 h-4" />
//               Period: {filters.startDate || "Beginning"} to {filters.endDate || "Today"}
//             </p>
//             <p>Generated on: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
//             {filters.department && <p>Department: {filters.department}</p>}
//           </div>
//         </div>

//         {/* SCREEN HEADER */}
//         <div className="no-print flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//             <FileText className="w-5 h-5 text-primary-600" />
//             Issue Records
//           </h3>
//           <div className="text-sm text-gray-500">
//             Records: <span className="font-bold text-gray-900">{report.length}</span> | 
//             Total Qty: <span className="font-bold text-gray-900">{totalQuantity}</span>
//           </div>
//         </div>

//         {loading ? (
//           <div className="text-center py-12 text-gray-500 no-print">
//             <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
//             Loading...
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="border-b-2 border-gray-800">
//                   <th className="px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">#</th>
//                   <th className="px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Date</th>
//                   <th className="px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Product</th>
//                   <th className="px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">SKU</th>
//                   <th className="px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Qty</th>
//                   <th className="px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Receiver</th>
//                   <th className="px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Department</th>
//                   <th className="px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Purpose</th>
//                   <th className="px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Issuer</th>
//                   <th className="px-3 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Sign</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {report.length === 0 ? (
//                   <tr>
//                     <td colSpan={10} className="px-3 py-8 text-center text-gray-500">
//                       <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300 no-print" />
//                       No records found
//                     </td>
//                   </tr>
//                 ) : (
//                   report.map((r, idx) => (
//                     <tr key={r.id} className="border-b border-gray-200 hover:bg-gray-50">
//                       <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
//                       <td className="px-3 py-2 text-sm whitespace-nowrap">
//                         {new Date(r.issue_date).toLocaleDateString('en-GB')}
//                       </td>
//                       <td className="px-3 py-2 text-sm font-medium">{r.product_name}</td>
//                       <td className="px-3 py-2 text-sm text-gray-500 font-mono">{r.product_sku}</td>
//                       <td className="px-3 py-2 text-sm font-medium">{r.quantity_out} {r.unit}</td>
//                       <td className="px-3 py-2 text-sm">{r.receiver_name}</td>
//                       <td className="px-3 py-2 text-sm">
//                         <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
//                           {r.receiver_department}
//                         </span>
//                       </td>
//                       <td className="px-3 py-2 text-sm text-gray-500 max-w-xs truncate">{r.issue_purpose || "—"}</td>
//                       <td className="px-3 py-2 text-sm font-medium">{r.issuer_name}</td>
//                       <td className="px-3 py-2 text-sm font-mono text-gray-500">{r.issuer_signature}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* PRINT FOOTER */}
//         <div className="print-only mt-8 pt-4 border-t-2 border-gray-800 text-center text-xs text-gray-500">
//           <p className="font-medium">— End of Report —</p>
//           <p className="mt-1">This is a computer generated logbook report from Inventory System.</p>
//           <p className="mt-1">Printed on: {new Date().toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { getIssuanceReport, getProducts, getDepartments } from "@/lib/actions";
// import Link from "next/link";
// import { FileText, Printer, ArrowLeft, Search, Calendar, BookOpen } from "lucide-react";

// export default function ReportsPage() {
//   const [loading, setLoading] = useState(false);
//   const [report, setReport] = useState<any[]>([]);
//   const [products, setProducts] = useState<any[]>([]);
//   const [departments, setDepartments] = useState<any[]>([]);
//   const [filters, setFilters] = useState({
//     startDate: "",
//     endDate: "",
//     department: "",
//     productId: "",
//   });

//   useEffect(() => {
//     getProducts().then(setProducts);
//     getDepartments().then(setDepartments);
//     loadReport();
//   }, []);

//   const loadReport = async (override?: any) => {
//     setLoading(true);
//     const f = override || filters;
//     const data = await getIssuanceReport({
//       startDate: f.startDate || undefined,
//       endDate: f.endDate || undefined,
//       department: f.department || undefined,
//       productId: f.productId ? parseInt(f.productId) : undefined,
//     });
//     setReport(data);
//     setLoading(false);
//   };

//   const handleFilter = (e: React.FormEvent) => {
//     e.preventDefault();
//     loadReport();
//   };

//   const totalQuantity = report.reduce((sum, r) => sum + parseInt(r.quantity_out), 0);

//   return (
//     <div className="p-8 max-w-7xl mx-auto">
//       {/* SCREEN ONLY */}
//       <div className="no-print">
//         <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
//           <ArrowLeft className="w-4 h-4" />
//           Back to Dashboard
//         </Link>

//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Issuance Logbook Report</h1>
//             <p className="text-gray-500 mt-1">Print stock issue records</p>
//           </div>
//           <button onClick={() => window.print()} className="btn-primary inline-flex items-center gap-2 self-start">
//             <Printer className="w-4 h-4" />
//             Print Report
//           </button>
//         </div>

//         <div className="card mb-6">
//           <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//             <div>
//               <label className="label text-xs">Start Date</label>
//               <input type="date" className="input-field" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
//             </div>
//             <div>
//               <label className="label text-xs">End Date</label>
//               <input type="date" className="input-field" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
//             </div>
//             <div>
//               <label className="label text-xs">Department</label>
//               <select className="input-field" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
//                 <option value="">All Departments</option>
//                 {departments.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="label text-xs">Product</label>
//               <select className="input-field" value={filters.productId} onChange={(e) => setFilters({ ...filters, productId: e.target.value })}>
//                 <option value="">All Products</option>
//                 {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//               </select>
//             </div>
//             <div className="sm:col-span-4 flex gap-2">
//               <button type="submit" className="btn-primary flex items-center gap-2"><Search className="w-4 h-4" />Generate</button>
//               <button type="button" onClick={() => { setFilters({ startDate: "", endDate: "", department: "", productId: "" }); loadReport({ startDate: "", endDate: "", department: "", productId: "" }); }} className="btn-secondary">Reset</button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* PRINT + SCREEN */}
//       <div className="card">
//         <div className="print-only text-center mb-6 pb-4 border-b-2 border-gray-800">
//           <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">Stock Issue Logbook</h1>
//           <div className="mt-3 text-sm text-gray-600 space-y-1">
//             <p className="flex items-center justify-center gap-2"><Calendar className="w-4 h-4" />Period: {filters.startDate || "Beginning"} to {filters.endDate || "Today"}</p>
//             <p>Generated: {new Date().toLocaleDateString('en-GB')}</p>
//           </div>
//         </div>

//         <div className="no-print flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-primary-600" />Issue Records</h3>
//           <div className="text-sm text-gray-500">Records: <span className="font-bold text-gray-900">{report.length}</span> | Total Qty: <span className="font-bold text-gray-900">{totalQuantity}</span></div>
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
//                   {/* NEW COLUMNS */}
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Logbook</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Doc No</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Code (SKU)</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Qty</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Receiver</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Dept</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Purpose</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Issuer</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Sign</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {report.length === 0 ? (
//                   <tr><td colSpan={11} className="px-3 py-8 text-center text-gray-500"><FileText className="w-12 h-12 mx-auto mb-3 text-gray-300 no-print" />No records found</td></tr>
//                 ) : (
//                   report.map((r, idx) => (
//                     <tr key={r.id} className="border-b border-gray-200 hover:bg-gray-50">
//                       <td className="px-2 py-2 text-sm text-gray-500">{idx + 1}</td>
//                       <td className="px-2 py-2 text-sm whitespace-nowrap">{new Date(r.issue_date).toLocaleDateString('en-GB')}</td>
//                       {/* NEW DATA */}
//                       <td className="px-2 py-2 text-sm font-medium text-purple-700">{r.logbook_name}</td>
//                       <td className="px-2 py-2 text-sm font-mono font-medium text-gray-900">{r.document_no}</td>
//                       <td className="px-2 py-2 text-sm font-mono text-gray-500">{r.product_sku}</td>
//                       <td className="px-2 py-2 text-sm font-medium">{r.quantity_out} {r.unit}</td>
//                       <td className="px-2 py-2 text-sm">{r.receiver_name}</td>
//                       <td className="px-2 py-2 text-sm"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">{r.receiver_department}</span></td>
//                       <td className="px-2 py-2 text-sm text-gray-500 max-w-xs truncate">{r.issue_purpose || "—"}</td>
//                       <td className="px-2 py-2 text-sm font-medium">{r.issuer_name}</td>
//                       <td className="px-2 py-2 text-sm font-mono text-gray-500">{r.issuer_signature}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div className="print-only mt-8 pt-4 border-t-2 border-gray-800 text-center text-xs text-gray-500">
//           <p className="font-medium">— End of Report —</p>
//           <p className="mt-1">Computer generated logbook report. Printed: {new Date().toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { getIssuanceReport, getProducts, getDepartments } from "@/lib/actions";
// import Link from "next/link";
// import { FileText, Printer, ArrowLeft, Search, Calendar, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

// export default function ReportsPage() {
//   const [loading, setLoading] = useState(false);
//   const [report, setReport] = useState<any[]>([]);
//   const [products, setProducts] = useState<any[]>([]);
//   const [departments, setDepartments] = useState<any[]>([]);
//   const [filters, setFilters] = useState({
//     startDate: "",
//     endDate: "",
//     department: "",
//     productId: "",
//   });

//   useEffect(() => {
//     getProducts().then(setProducts);
//     getDepartments().then(setDepartments);
//     loadReport();
//   }, []);

//   const loadReport = async (override?: any) => {
//     setLoading(true);
//     const f = override || filters;
//     const data = await getIssuanceReport({
//       startDate: f.startDate || undefined,
//       endDate: f.endDate || undefined,
//       department: f.department || undefined,
//       productId: f.productId ? parseInt(f.productId) : undefined,
//     });
//     setReport(data);
//     setLoading(false);
//   };

//   const handleFilter = (e: React.FormEvent) => {
//     e.preventDefault();
//     loadReport();
//   };

//   const totalQuantity = report.reduce((sum, r) => sum + parseInt(r.quantity_out), 0);

//   return (
//     <div className="p-8 max-w-7xl mx-auto">
//       <div className="no-print">
//         <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
//           <ArrowLeft className="w-4 h-4" />
//           Back to Dashboard
//         </Link>

//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Issuance / Stock Out Report</h1>
//             <p className="text-gray-500 mt-1">Print stock issue records for verification & sign</p>
//           </div>
//           <div className="flex gap-2">
//             <Link href="/reports/stock-in" className="btn-success inline-flex items-center gap-2">
//               <ArrowUpFromLine className="w-4 h-4" />
//               Stock In Report
//             </Link>
//             <button onClick={() => window.print()} className="btn-primary inline-flex items-center gap-2">
//               <Printer className="w-4 h-4" />
//               Print Report
//             </button>
//           </div>
//         </div>

//         <div className="card mb-6">
//           <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//             <div>
//               <label className="label text-xs">Start Date</label>
//               <input type="date" className="input-field" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
//             </div>
//             <div>
//               <label className="label text-xs">End Date</label>
//               <input type="date" className="input-field" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
//             </div>
//             <div>
//               <label className="label text-xs">Department</label>
//               <select className="input-field" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
//                 <option value="">All Departments</option>
//                 {departments.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="label text-xs">Product</label>
//               <select className="input-field" value={filters.productId} onChange={(e) => setFilters({ ...filters, productId: e.target.value })}>
//                 <option value="">All Products</option>
//                 {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//               </select>
//             </div>
//             <div className="sm:col-span-4 flex gap-2">
//               <button type="submit" className="btn-primary flex items-center gap-2"><Search className="w-4 h-4" />Generate Report</button>
//               <button type="button" onClick={() => { setFilters({ startDate: "", endDate: "", department: "", productId: "" }); loadReport({ startDate: "", endDate: "", department: "", productId: "" }); }} className="btn-secondary">Reset</button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <div className="card">
//         <div className="print-only text-center mb-6 pb-4 border-b-2 border-gray-800">
//           <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">Stock Issue Logbook</h1>
//           <div className="mt-3 text-sm text-gray-600 space-y-1">
//             <p className="flex items-center justify-center gap-2"><Calendar className="w-4 h-4" />Period: {filters.startDate || "Beginning"} to {filters.endDate || "Today"}</p>
//             <p>Generated: {new Date().toLocaleDateString('en-GB')}</p>
//             {filters.department && <p>Department: {filters.department}</p>}
//           </div>
//         </div>

//         <div className="no-print flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//             <ArrowDownToLine className="w-5 h-5 text-danger-600" />
//             Issue Records
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
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Qty</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Receiver</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Dept</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Purpose</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Issuer</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Sign</th>
//                   <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100 w-32">Verify Sign</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {report.length === 0 ? (
//                   <tr><td colSpan={12} className="px-3 py-8 text-center text-gray-500"><FileText className="w-12 h-12 mx-auto mb-3 text-gray-300 no-print" />No records found</td></tr>
//                 ) : (
//                   report.map((r, idx) => (
//                     <tr key={r.id} className="border-b border-gray-200 hover:bg-gray-50">
//                       <td className="px-2 py-2 text-sm text-gray-500">{idx + 1}</td>
//                       <td className="px-2 py-2 text-sm whitespace-nowrap">{new Date(r.issue_date).toLocaleDateString('en-GB')}</td>
//                       <td className="px-2 py-2 text-sm font-medium text-purple-700">{r.logbook_name}</td>
//                       <td className="px-2 py-2 text-sm font-mono font-medium text-gray-900">{r.document_no}</td>
//                       <td className="px-2 py-2 text-sm font-mono text-gray-500">{r.product_sku}</td>
//                       <td className="px-2 py-2 text-sm font-medium">{r.quantity_out} {r.unit}</td>
//                       <td className="px-2 py-2 text-sm">{r.receiver_name}</td>
//                       <td className="px-2 py-2 text-sm"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">{r.receiver_department}</span></td>
//                       <td className="px-2 py-2 text-sm text-gray-500 max-w-xs truncate">{r.issue_purpose || "—"}</td>
//                       <td className="px-2 py-2 text-sm font-medium">{r.issuer_name}</td>
//                       <td className="px-2 py-2 text-sm font-mono text-gray-500">{r.issuer_signature}</td>
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
//               <p className="text-sm font-bold text-gray-900 mb-8">Issued By:</p>
//               <div className="border-t border-gray-800 pt-2">
//                 <p className="text-sm text-gray-600">Name: _______________________</p>
//                 <p className="text-sm text-gray-600 mt-1">Sign: _______________________</p>
//                 <p className="text-sm text-gray-600 mt-1">Date: _______________________</p>
//               </div>
//             </div>
//             <div>
//               <p className="text-sm font-bold text-gray-900 mb-8">Received By:</p>
//               <div className="border-t border-gray-800 pt-2">
//                 <p className="text-sm text-gray-600">Name: _______________________</p>
//                 <p className="text-sm text-gray-600 mt-1">Sign: _______________________</p>
//                 <p className="text-sm text-gray-600 mt-1">Date: _______________________</p>
//               </div>
//             </div>
//           </div>
//           <p className="text-center text-xs text-gray-500 mt-8">— End of Stock Issue Report —</p>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getIssuanceReport, getProducts, getDepartments, getDocumentNumbers } from "@/lib/actions";
import Link from "next/link";
import { FileText, Printer, ArrowLeft, Search, Calendar, ArrowDownToLine, ArrowUpFromLine, X, FileSearch } from "lucide-react";

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  
  // Document No search states
  const [docNumbers, setDocNumbers] = useState<string[]>([]);
  const [docNoSearch, setDocNoSearch] = useState("");
  const [showDocNoDropdown, setShowDocNoDropdown] = useState(false);
  const docNoDropdownRef = useRef<HTMLDivElement>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    department: "",
    productId: "",
    documentNo: "",
  });

  useEffect(() => {
    getProducts().then(setProducts);
    getDepartments().then(setDepartments);
    loadDocNumbers();
    loadReport();
  }, []);

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

  const loadDocNumbers = useCallback(async () => {
    const data = await getDocumentNumbers();
    setDocNumbers(data);
  }, []);

  const loadReport = async (override?: any) => {
    setLoading(true);
    const f = override || filters;
    const data = await getIssuanceReport({
      startDate: f.startDate || undefined,
      endDate: f.endDate || undefined,
      department: f.department || undefined,
      productId: f.productId ? parseInt(f.productId) : undefined,
      documentNo: f.documentNo || undefined,
    });
    setReport(data);
    setLoading(false);
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadReport();
  };

  // Document No filter logic
  const filteredDocNumbers = docNoSearch.trim() === ""
    ? docNumbers
    : docNumbers.filter(d =>
        d.toLowerCase().includes(docNoSearch.toLowerCase())
      );

  const handleDocNoSelect = (docNo: string) => {
    setFilters({ ...filters, documentNo: docNo });
    setDocNoSearch(docNo);
    setShowDocNoDropdown(false);
    setCurrentPage(1);
  };

  const clearDocNo = () => {
    setFilters({ ...filters, documentNo: "" });
    setDocNoSearch("");
    setCurrentPage(1);
  };

  const totalQuantity = report.reduce((sum, r) => sum + parseInt(r.quantity_out), 0);

  // Pagination logic
  const totalPages = Math.ceil(report.length / itemsPerPage);
  const paginatedReport = report.slice(
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
      <div className="no-print">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Issuance / Stock Out Report</h1>
            <p className="text-gray-500 mt-1">Print stock issue records for verification & sign</p>
          </div>
          <div className="flex gap-2">
            <Link href="/reports/stock-in" className="btn-success inline-flex items-center gap-2">
              <ArrowUpFromLine className="w-4 h-4" />
              Stock In Report
            </Link>
            <button onClick={() => window.print()} className="btn-primary inline-flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print Report
            </button>
          </div>
        </div>

        <div className="card mb-6">
          <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div>
              <label className="label text-xs">Start Date</label>
              <input type="date" className="input-field" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
            </div>
            <div>
              <label className="label text-xs">End Date</label>
              <input type="date" className="input-field" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
            </div>
            <div>
              <label className="label text-xs">Department</label>
              <select className="input-field" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
                <option value="">All Departments</option>
                {departments.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label text-xs">Product</label>
              <select className="input-field" value={filters.productId} onChange={(e) => setFilters({ ...filters, productId: e.target.value })}>
                <option value="">All Products</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            {/* Document No Search Bar */}
            <div ref={docNoDropdownRef}>
              <label className="label text-xs flex items-center gap-1">
                <FileSearch className="w-3 h-3" />
                Document No
              </label>
              <div className="relative">
                <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  className="input-field pl-9 pr-8 w-full"
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {showDocNoDropdown && filteredDocNumbers.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredDocNumbers.map((docNo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleDocNoSelect(docNo)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center gap-2"
                      >
                        <FileSearch className="w-3 h-3 text-orange-500" />
                        <span className="font-mono text-sm text-gray-900">{docNo}</span>
                      </button>
                    ))}
                  </div>
                )}
                {showDocNoDropdown && docNoSearch && filteredDocNumbers.length === 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-center text-gray-400 text-sm">
                    No document numbers found
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-5 flex gap-2">
              <button type="submit" className="btn-primary flex items-center gap-2"><Search className="w-4 h-4" />Generate Report</button>
              <button type="button" onClick={() => { 
                setFilters({ startDate: "", endDate: "", department: "", productId: "", documentNo: "" }); 
                setDocNoSearch("");
                setCurrentPage(1);
                loadReport({ startDate: "", endDate: "", department: "", productId: "", documentNo: "" }); 
              }} className="btn-secondary">Reset</button>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="print-only text-center mb-6 pb-4 border-b-2 border-gray-800">
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide"> Issue Logbook</h1>
          <div className="mt-3 text-sm text-gray-600 space-y-1">
            <p className="flex items-center justify-center gap-2"><Calendar className="w-4 h-4" /> {filters.startDate || "Beginning"} to {filters.endDate || "Today"}</p>
            <p>Generated: {new Date().toLocaleDateString('en-GB')}</p>
            {filters.department && <p>Department: {filters.department}</p>}
            {filters.documentNo && <p>Document No: {filters.documentNo}</p>}
          </div>
        </div>

        <div className="no-print flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ArrowDownToLine className="w-5 h-5 text-danger-600" />
            Issue Records
          </h3>
          <div className="text-sm text-gray-500">
            Records: <span className="font-bold text-gray-900">{report.length}</span> | 
            Total Qty: <span className="font-bold text-gray-900">{totalQuantity}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 no-print"><div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">#</th>
                  <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Date</th>
                  <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Doc No</th>
                  <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Product</th>
                  <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Code (SKU)</th>
                  <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Qty</th>
                  <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Receiver</th>
                  <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Dept</th>
                  <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Purpose</th>
                  <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Issuer</th>
                  <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100">Sign</th>
                  <th className="px-2 py-2 text-left text-xs font-bold text-gray-900 uppercase bg-gray-100 w-32">Verify Sign</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReport.length === 0 ? (
                  <tr><td colSpan={12} className="px-3 py-8 text-center text-gray-500"><FileText className="w-12 h-12 mx-auto mb-3 text-gray-300 no-print" />No records found</td></tr>
                ) : (
                  paginatedReport.map((r, idx) => (
                    <tr key={r.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-2 py-2 text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td className="px-2 py-2 text-sm whitespace-nowrap">{new Date(r.issue_date).toLocaleDateString('en-GB')}</td>
                      <td className="px-2 py-2 text-sm font-mono font-medium text-orange-700 bg-orange-50 rounded">{r.document_no || "—"}</td>
                      <td className="px-2 py-2 text-sm font-medium text-gray-900">{r.product_name || "Unknown"}</td>
                      <td className="px-2 py-2 text-sm font-mono text-gray-500">{r.product_sku}</td>
                      <td className="px-2 py-2 text-sm font-medium">{r.quantity_out} {r.unit}</td>
                      <td className="px-2 py-2 text-sm">{r.receiver_name}</td>
                      <td className="px-2 py-2 text-sm"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">{r.receiver_department}</span></td>
                      <td className="px-2 py-2 text-sm text-gray-500 max-w-xs truncate">{r.issue_purpose || "—"}</td>
                      <td className="px-2 py-2 text-sm font-medium">{r.issuer_name}</td>
                      <td className="px-2 py-2 text-sm font-mono text-gray-500">{r.issuer_signature}</td>
                      <td className="px-2 py-2 text-sm border-l border-gray-300"><div className="h-8 border-b border-gray-400"></div></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && report.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100 no-print">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, report.length)}</span> of <span className="font-medium text-gray-900">{report.length}</span> results
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700">Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => goToPage(page)} className={`w-8 h-8 text-sm rounded-lg ${currentPage === page ? "bg-primary-600 text-white font-medium" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>{page}</button>
              ))}
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700">Next</button>
            </div>
          </div>
        )}

        <div className="print-only mt-8 pt-4 border-t-2 border-gray-800">
          <div className="grid grid-cols-2 gap-8 mt-4">
             <div>
              {/* <p className="text-sm font-bold text-gray-900 mb-8">Issued By:</p> */}
              <div className="border-t border-gray-800 pt-2">
                {/* <p className="text-sm text-gray-600">Name: _______________________</p>
                <p className="text-sm text-gray-600 mt-1">Sign: _______________________</p>
                <p className="text-sm text-gray-600 mt-1">Date: _______________________</p> */}
              </div> 
            </div>
            <div>
              {/* <p className="text-sm font-bold text-gray-900 mb-8">Received By:</p> */}
               <div className="border-t border-gray-800 pt-2">
                {/* <p className="text-sm text-gray-600">Name: _______________________</p>
                <p className="text-sm text-gray-600 mt-1">Sign: _______________________</p>
                <p className="text-sm text-gray-600 mt-1">Date: _______________________</p> */}
              </div> 
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-8">— Developed By SE Sadddam —</p>
        </div>
      </div>
    </div>
  );
}