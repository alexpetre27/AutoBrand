"use client";

import { useProductTable } from "@/app/hooks/useProductTable";
import { Pencil, Search, Trash2, Check } from "lucide-react";

export default function ProductTable() {
  const {
    search,
    setSearch,
    editingId,
    setEditingId,
    editName,
    setEditName,
    editPrice,
    setEditPrice,
    expandedDescIds,
    handleDelete,
    handleSave,
    toggleDescription,
    filteredAndSorted,
    handleSort,
    currentExchangeRate,
  } = useProductTable();

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black-300" />
        <input
          placeholder="Caută"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-400 transition-all"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-[45%]" />
            <col className="w-[20%]" />
            <col className="w-[20%]" />
            <col className="w-[15%]" />
          </colgroup>
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr className="text-left text-neutral-500">
              <th className="px-6 py-4 font-medium">Produs</th>
              <th
                onClick={() => handleSort("price")}
                className="px-4 py-4 text-center cursor-pointer hover:text-neutral-900"
              >
                Preț USD ↕
              </th>
              <th className="px-4 py-4 text-center font-medium">RON</th>
              <th className="px-4 py-4 text-center">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredAndSorted.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50/50 transition">
                <td className="px-6 py-4">
                  {editingId === p.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-blue-200 bg-blue-50 text-neutral-900 font-medium outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      {p.imageUrl && (
                        <img
                          src={p.imageUrl}
                          className="w-10 h-10 rounded-lg object-cover border border-neutral-100"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-900 truncate">
                          {p.name}
                        </p>
                        {p.description && (
                          <p
                            onClick={() => toggleDescription(p.id)}
                            className={`text-xs text-neutral-500 mt-0.5 cursor-pointer ${expandedDescIds.includes(p.id) ? "whitespace-normal" : "truncate"}`}
                          >
                            {p.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 text-center text-neutral-900">
                  {editingId === p.id ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(parseFloat(e.target.value))}
                      className="w-24 p-2 rounded-lg border border-blue-200 bg-blue-50 text-center outline-none focus:ring-2 focus:ring-blue-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  ) : (
                    `$${p.price.toFixed(2)}`
                  )}
                </td>
                <td className="px-4 py-4 text-center text-neutral-600 font-medium">
                  {p.priceRon?.toFixed(2)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {editingId === p.id ? (
                      <button
                        onClick={() => handleSave(p.id)}
                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(p.id);
                          setEditName(p.name);
                          setEditPrice(p.price);
                        }}
                        className="p-2 text-neutral-500 hover:bg-neutral-200 rounded-lg transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
