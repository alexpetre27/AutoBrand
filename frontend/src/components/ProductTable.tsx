"use client";

import { useProductTable } from "@/app/hooks/useProductTable";

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
    <div className="w-full space-y-6">
      <input
        placeholder="Caută produs"
        className="w-full bg-neutral-900/50 border border-white/5 p-3 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500/50 transition-all shadow-lg backdrop-blur-md"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-neutral-900/30 border border-white/5 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden min-h-[300px]">
        <table className="w-full text-sm text-left table-fixed">
          <thead className="bg-neutral-900/60 text-neutral-400 border-b border-white/5">
            <tr>
              <th className="w-[45%] px-6 py-4 font-medium">Produs</th>
              <th
                className="w-[15%] px-6 py-4 font-medium text-center cursor-pointer hover:text-white"
                onClick={() => handleSort("price")}
              >
                Preț USD ↕
              </th>
              <th className="w-[20%] px-6 py-4 font-medium text-center">
                Preț RON{" "}
                {currentExchangeRate && (
                  <span className="block text-[10px] text-slate-500">
                    (Curs: {currentExchangeRate.toFixed(2)})
                  </span>
                )}
              </th>
              <th className="w-[20%] px-6 py-4 font-medium text-center">
                Acțiuni
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredAndSorted.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-white/[0.02] transition-colors align-top"
              >
                <td className="px-6 py-4">
                  {editingId === p.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-neutral-950 border border-neutral-700 rounded-md px-3 py-1.5 w-full text-sm focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-start space-x-4">
                      {p.imageUrl && (
                        <img
                          src={p.imageUrl}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate">{p.name}</span>
                        {p.description && (
                          <span
                            onClick={() => toggleDescription(p.id)}
                            className={`text-[11px] text-neutral-500 mt-1 cursor-pointer hover:text-neutral-400 transition-all ${expandedDescIds.includes(p.id) ? "whitespace-normal" : "truncate max-w-[280px]"}`}
                          >
                            {p.description}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {editingId === p.id ? (
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(parseFloat(e.target.value))}
                      className="bg-neutral-950 border border-neutral-700 rounded-md px-3 py-1.5 w-20 text-center"
                    />
                  ) : (
                    `$${p.price.toFixed(2)}`
                  )}
                </td>
                <td className="px-6 py-4 text-center font-medium ">
                  {p.priceRon?.toFixed(2)} RON
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    {editingId === p.id ? (
                      <button
                        onClick={() => handleSave(p.id)}
                        className="text-emerald-400 text-xs"
                      >
                        Salvează
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(p.id);
                          setEditName(p.name);
                          setEditPrice(p.price);
                        }}
                        className="text-indigo-400 text-xs"
                      >
                        Editează
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-rose-400 text-xs"
                    >
                      Șterge
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
