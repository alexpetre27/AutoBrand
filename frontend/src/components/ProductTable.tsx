"use client";
import { useEffect, useState, useMemo } from "react";
import { Product } from "@/types/product";

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    fetch("http://localhost:8081/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []));
  }, []);

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

  return (
    <div className="w-full space-y-4">
      <input
        placeholder="Caută produs..."
        className="w-full bg-neutral-900 border border-neutral-800 p-2 rounded text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Wrapper cu înălțime minimă pentru a opri elementele să sară în sus */}
      <div className="min-h-[300px]">
        {/* table-fixed forțează coloanele să respecte lățimea dată în <th>, indiferent de conținut */}
        <table className="w-full text-sm text-left border border-neutral-800 rounded-lg overflow-hidden table-fixed">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr>
              {/* Alocăm 70% din spațiu pentru Produs și 30% pentru Preț */}
              <th className="w-[70%] px-6 py-3">Produs</th>
              <th
                className="w-[30%] px-6 py-3 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("price")}
              >
                Preț USD ↕
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {filteredAndSorted.length > 0 ? (
              filteredAndSorted.map((p) => (
                <tr key={p.id}>
                  {/* truncate adaugă "..." dacă numele e prea lung și evită stricarea tabelului */}
                  <td className="px-6 py-3 truncate">{p.name}</td>
                  <td className="px-6 py-3">${p.price.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              /* Fallback afișat când căutarea nu are rezultate (ex: "ffff") */
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-12 text-center text-neutral-500"
                >
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
