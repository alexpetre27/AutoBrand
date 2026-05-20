import { useState } from "react";

export const usePdfUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8081/api/pdf/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Eroare la procesarea PDF-ului");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "produse.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error:", error);
      alert("A apărut o eroare la procesarea fișierului.");
    } finally {
      setIsUploading(false);
    }
  };

  return { setFile, handleUpload, isUploading };
};
