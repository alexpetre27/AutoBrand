"use client";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8081/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Eroare API:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="p-8 text-center text-neutral-500">
        Se încarcă datele...
      </div>
    );

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-md overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-neutral-950/50 text-neutral-400 uppercase text-[10px] tracking-widest">
          <tr>
            <th className="px-6 py-4">Produs</th>
            <th className="px-6 py-4 text-right">Preț USD</th>
            <th className="px-6 py-4 text-right">Preț RON</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium">{p.name || "N/A"}</td>
                <td className="px-6 py-4 text-right font-mono text-emerald-400">
                  ${(p.price ?? 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right font-mono text-indigo-400">
                  {(p.priceRon ?? 0).toFixed(2)} RON
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className="px-6 py-8 text-center text-neutral-500"
              >
                Nu există produse în bază.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
