import Image from "next/image";

function Header() {
  return (
    <>
      <header className="flex items-center justify-between h-14 bg-slate-100 text-black shadow-md p-4">
        <div className="flex items-center mx-3">
          <Image src="/icon.png" width={30} height={38} alt="Logo" />
          <span className="text-2xl font-sans ml-2">Dinas Koperasi</span>
        </div>
        <span className="text-2xl font-sans">Aplikasi Penjualan</span>
      </header>
    </>
  );
}

export default Header;
