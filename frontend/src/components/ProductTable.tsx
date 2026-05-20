"use client";
import { Product } from "@/types/product";
import { useEffect, useState, useMemo } from "react";

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: "asc" | "desc";
  } | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState<number>(0);

  const fetchProducts = () => {
    fetch("http://localhost:8081/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Eroare la încărcarea produselor:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Sigur vrei să ștergi acest produs?")) return;
    try {
      const res = await fetch(`http://localhost:8081/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditName(String(product.name));
    setEditPrice(product.price);
  };

  const handleSave = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8081/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, price: editPrice }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] as number;
        const valB = b[sortConfig.key] as number;
        return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      });
    }
    return result;
  }, [products, search, sortConfig]);

  const handleSort = (key: keyof Product) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Extragem cursul valutar din primul produs disponibil
  const currentExchangeRate =
    products.length > 0 ? products[0].exchangeRate : null;

  return (
    <div className="w-full space-y-6">
      <div className="relative">
        <input
          placeholder="Caută produs..."
          className="w-full bg-neutral-900/50 border border-white/5 p-3 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-lg backdrop-blur-md"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="bg-neutral-900/30 border border-white/5 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden">
        <table className="w-full text-sm text-left table-fixed">
          <thead className="bg-neutral-900/60 text-neutral-400 border-b border-white/5">
            <tr>
              <th className="w-[40%] px-6 py-4 font-medium tracking-wide">
                Produs
              </th>
              <th
                className="w-[20%] px-6 py-4 font-medium tracking-wide text-center cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("price")}
              >
                Preț USD ↕
              </th>
              <th className="w-[20%] px-6 py-4 font-medium tracking-wide text-center ">
                <div className="flex flex-col items-center justify-center">
                  <span>Preț RON</span>
                  {currentExchangeRate ? (
                    <span className="text-[10px] text-slate-500/70 mt-0.5 tracking-wider normal-case">
                      (Curs: {currentExchangeRate.toFixed(4)})
                    </span>
                  ) : null}
                </div>
              </th>
              <th className="w-[20%] px-6 py-4 font-medium tracking-wide text-center">
                Acțiuni
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {filteredAndSorted.length > 0 ? (
              filteredAndSorted.map((p) => (
                <tr
                  key={p.id}
                  className="h-[72px] hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-4 truncate text-neutral-200">
                    {editingId === p.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-neutral-950 border border-neutral-700 rounded-md px-3 py-1.5 text-white w-full text-sm focus:outline-none focus:border-indigo-500"
                      />
                    ) : (
                      p.name
                    )}
                  </td>

                  <td className="px-6 py-4 text-center text-neutral-300 font-mono">
                    {editingId === p.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editPrice}
                        onChange={(e) =>
                          setEditPrice(parseFloat(e.target.value) || 0)
                        }
                        className="bg-neutral-950 border border-neutral-700 rounded-md px-3 py-1.5 text-white w-24 text-sm focus:outline-none text-center mx-auto block focus:border-indigo-500"
                      />
                    ) : (
                      `$${p.price.toFixed(2)}`
                    )}
                  </td>

                  <td className="px-6 py-4 text-center font-mono">
                    <span className="font-normal text-gray-300">
                      {p.priceRon ? `${p.priceRon.toFixed(2)} RON` : "-"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-4 opacity-80 group-hover:opacity-100 transition-opacity">
                      {editingId === p.id ? (
                        <>
                          <button
                            onClick={() => handleSave(p.id)}
                            className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold tracking-wide transition"
                          >
                            Salvează
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-neutral-400 hover:text-neutral-300 text-xs font-medium transition"
                          >
                            Anulează
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(p)}
                            className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold tracking-wide transition"
                          >
                            Editează
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-rose-400 hover:text-rose-300 text-xs font-semibold tracking-wide transition"
                          >
                            Șterge
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="h-[144px]">
                <td colSpan={4} className="px-6 text-center text-neutral-500">
                  Niciun produs nu se potrivește căutării.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
