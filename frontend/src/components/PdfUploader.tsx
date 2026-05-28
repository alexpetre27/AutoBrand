"use client";

import { useState } from "react";
import { usePdfUploader } from "@/app/hooks/usePdfUploader";
import { FileText, Info, X } from "lucide-react";

export default function PdfUploader() {
  const { setFile, handleUpload, isUploading } = usePdfUploader();
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFile(file);
    setSelectedFileName(file ? file.name : null);
  };

  const clearFile = () => {
    setFile(null);
    setSelectedFileName(null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-2">
        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer p-2 rounded-xl hover:bg-neutral-100 transition-colors">
            <input type="file" onChange={handleFileChange} className="hidden" />

            <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-neutral-400" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-900 truncate">
                {selectedFileName || "Alege un fișier PDF"}
              </p>
              <p className="text-xs text-neutral-400">
                {selectedFileName
                  ? "Fișier selectat"
                  : "Click pentru a încărca"}
              </p>
            </div>
          </label>

          {selectedFileName && (
            <button
              onClick={clearFile}
              className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-neutral-400 text-xs px-1">
        <Info className="w-3 h-3" />
        <span>Documentele PDF sunt procesate securizat.</span>
      </div>

      <button
        onClick={handleUpload}
        disabled={isUploading || !selectedFileName}
        className={`w-full h-12 rounded-xl text-white font-medium transition-all ${
          isUploading || !selectedFileName
            ? "bg-neutral-300 cursor-not-allowed"
            : "bg-neutral-900 hover:bg-black shadow-md hover:shadow-lg"
        }`}
      >
        {isUploading ? "Se procesează..." : "Extrage produsele"}
      </button>
    </div>
  );
}
