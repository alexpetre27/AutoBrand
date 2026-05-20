"use client";
import { useState } from "react";

export default function PdfUploader() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8081/api/pdf/upload", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "produse.csv";
    a.click();
  };

  return (
    <div className="p-6 border border-neutral-800 bg-neutral-900/50 rounded-xl">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files![0])}
        className="block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
      />
      <button
        onClick={handleUpload}
        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg text-sm font-medium transition"
      >
        Descarca factura
      </button>
    </div>
  );
}
