"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProductById, updateProduct, getCategories } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, Pencil, Loader2 } from "lucide-react";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [productId, setProductId] = useState<number | null>(null);

  useEffect(() => {
    params.then(async (p) => {
      const id = parseInt(p.id);
      setProductId(id);
      const [prod, cats] = await Promise.all([getProductById(id), getCategories()]);
      setProduct(prod);
      setCategories(cats);
    });
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productId) return;
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await updateProduct(productId, {
        sku: formData.get("sku") as string,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        category_id: formData.get("category_id") ? parseInt(formData.get("category_id") as string) : null,
        unit_price: parseFloat(formData.get("unit_price") as string) || 0,
        cost_price: parseFloat(formData.get("cost_price") as string) || 0,
        reorder_level: parseInt(formData.get("reorder_level") as string) || 10,
        unit: formData.get("unit") as string,
      });
      router.push("/products");
    } catch (err: any) {
      setError(err.message || "Failed to update product");
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Pencil className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-500 text-sm">Update product details</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">SKU *</label>
              <input name="sku" defaultValue={product.sku} required className="input-field" />
            </div>
            <div>
              <label className="label">Product Name *</label>
              <input name="name" defaultValue={product.name} required className="input-field" />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea name="description" rows={3} defaultValue={product.description || ""} className="input-field" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Category</label>
              <select name="category_id" defaultValue={product.category_id || ""} className="input-field">
                <option value="">Select Category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Unit</label>
              <select name="unit" defaultValue={product.unit} className="input-field">
                <option value="pcs">Pieces (pcs)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="litre">Litres (litre)</option>
                <option value="pack">Pack</option>
                <option value="box">Box</option>
                <option value="ream">Ream</option>
                <option value="bottle">Bottle</option>
                <option value="set">Set</option>
                <option value="set">logbook</option>

              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="label">Unit Price ($)</label>
              <input name="unit_price" type="number" step="0.01" min="0" defaultValue={product.unit_price} className="input-field" />
            </div>
            <div>
              <label className="label">Cost Price ($)</label>
              <input name="cost_price" type="number" step="0.01" min="0" defaultValue={product.cost_price} className="input-field" />
            </div>
            <div>
              <label className="label">Reorder Level</label>
              <input name="reorder_level" type="number" min="0" defaultValue={product.reorder_level} className="input-field" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Current Stock:</span> {product.current_stock} {product.unit}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Product
            </button>
            <Link href="/products" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
