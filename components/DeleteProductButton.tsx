"use client";

import { useState } from "react";
import { deleteProduct } from "@/lib/actions";
import { Trash2 } from "lucide-react";

export function DeleteProductButton({ id, name }: { id: number; name: string }) {
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    await deleteProduct(id);
    window.location.reload();
  };

  return (
    <button
      onClick={handleDelete}
      className={`p-1.5 rounded-lg transition-colors ${
        confirming
          ? "bg-danger-100 text-danger-700"
          : "text-gray-400 hover:text-danger-600 hover:bg-danger-50"
      }`}
      title={confirming ? "Click again to confirm" : "Delete"}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
