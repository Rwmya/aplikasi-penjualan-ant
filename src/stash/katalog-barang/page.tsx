export default function KatalogBarang() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl">Katalog barang</h1>
      {[...Array(50)].map((_, index) => (
        <div
          key={index}
          className="bg-slate-100 border-2 border-blue-400 p-4 rounded"
        >
          <p>Item {index + 1}</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      ))}
    </div>
  );
}
