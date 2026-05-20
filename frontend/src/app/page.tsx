import ProductTable from "@/components/ProductTable";
import PdfUploader from "@/components/PdfUploader";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#f5f5f3] px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-[32px] border border-black/[0.04] shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-8">
          <div className="mb-6">
            <h1 className="text-[34px] leading-none font-semibold tracking-tight text-neutral-900">
              Procesare factură PDF
            </h1>

            <p className="text-neutral-500 mt-3 text-[15px]">
              Încarcă factura pentru extragerea automată a produselor.
            </p>
          </div>

          <PdfUploader />
        </div>

        <ProductTable />
      </div>
    </main>
  );
}
