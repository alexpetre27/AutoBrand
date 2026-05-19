import ProductTable from "@/components/ProductTable";
import PdfUploader from "@/components/PdfUploader";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">StackStory Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <PdfUploader />
          </div>
          <div className="md:col-span-2">
            <ProductTable />
          </div>
        </div>
      </div>
    </main>
  );
}
