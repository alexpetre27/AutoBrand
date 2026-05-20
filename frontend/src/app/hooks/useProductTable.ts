import { useState, useEffect, useMemo } from "react";
import { Product } from "@/types/product";

export const useProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: "asc" | "desc";
  } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [expandedDescIds, setExpandedDescIds] = useState<number[]>([]);

  const fetchProducts = () => {
    fetch("http://localhost:8081/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Eroare la încărcare:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Sigur ștergi?")) return;
    const res = await fetch(`http://localhost:8081/api/products/${id}`, {
      method: "DELETE",
    });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  };
  const handleSave = async (id: number) => {
    const productToUpdate = filteredAndSorted.find((p) => p.id === id);

    if (!productToUpdate) return;

    const res = await fetch(`http://localhost:8081/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        price: editPrice,
        description: productToUpdate.description,
      }),
    });

    if (res.ok) {
      setEditingId(null);
      fetchProducts();
    }
  };
  const toggleDescription = (id: number) => {
    setExpandedDescIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
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

  const currentExchangeRate =
    products.length > 0 ? products[0].exchangeRate : null;

  return {
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
  };
};
