import ProductTable from "@/components/ProductTable";
import PdfUploader from "@/components/PdfUploader";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center pt-32 px-6 pb-6">
      <div className="w-full max-w-4xl flex flex-col items-center gap-8">
        <div className="w-full max-w-sm p-6 rounded-2xl border border-neutral-800 bg-neutral-900/30">
          <h2 className="text-[10px] tracking-[0.2em] font-bold text-neutral-500 mb-4 uppercase text-center">
            Procesare Factură
          </h2>
          <PdfUploader />
        </div>

        <div className="w-full">
          <ProductTable />
        </div>
      </div>
    </main>
  );
}
