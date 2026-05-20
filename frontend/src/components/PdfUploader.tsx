"use client";

import { usePdfUploader } from "@/app/hooks/usePdfUploader";

export default function PdfUploader() {
  const { setFile, handleUpload, isUploading } = usePdfUploader();

  return (
    <div className="p-6 border border-neutral-800 bg-neutral-900/50 rounded-xl">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        className="block w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
      />
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className={`mt-4 w-full py-3 rounded-lg text-sm font-medium transition ${
          isUploading
            ? "bg-neutral-700 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500"
        }`}
      >
        {isUploading ? "Se procesează..." : "Descarcă factura"}
      </button>
    </div>
  );
}
