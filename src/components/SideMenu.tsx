"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Logout } from "@/utils/apiAuth";
import { Menu } from "antd";
import PopUp from "./Konfirm";
import {
  DashboardOutlined,
  FileTextOutlined,
  InboxOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface keys {
  key: string;
}

export default function SideMenu() {
  const router = useRouter();
  const pathname = usePathname();

  function handleClick(keys: keys) {
    const dedKey = keys.key.includes("demd");

    if (keys.key === "logout") {
      const title = "Apa anda yakin ingin logout?";
      const content = "Anda akan keluar dari akun Anda.";
      PopUp(title, content, Logout);
    } else if (!dedKey && keys.key !== pathname) {
      console.log("path: ", pathname);
      console.log("Key: ", keys.key);
      router.push(keys.key);
    }
  }
  return (
    <>
      <div>
        <Menu
          className="min-h-screen w-60 text-md bg-slate-100"
          mode="inline"
          onClick={(key: keys) => handleClick(key)}
          items={[
            {
              key: "/",
              label: "Dashboard",
              icon: <DashboardOutlined style={{ fontSize: 26 }} />,
            },
            {
              key: "/buat-pesanan",
              label: "Buat pesanan",
              icon: <ShoppingCartOutlined style={{ fontSize: 26 }} />,
            },
            {
              key: "ob-demd",
              label: "Operasi barang",
              icon: <InboxOutlined style={{ fontSize: 26 }} />,
              children: [
                { label: "Stock barang", key: "/stok-barang" },
                { label: "Katalog barang", key: "/katalog-barang" },
              ],
            },
            {
              key: "l-demd",
              label: "Laporan",
              icon: <FileTextOutlined style={{ fontSize: 26 }} />,
              children: [
                { label: "Laporan stock barang", key: "/laporan-stok-barang" },
                { label: "Laporan transaksi", key: "/laporan-transaksi" },
              ],
            },
            {
              key: "usr-demd",
              label: "Admin & Pelanggan",
              icon: <UserOutlined style={{ fontSize: 26 }} />,
              children: [
                { label: "Kelola Admin", key: "/kelola-admin" },
                { label: "Kelola Pelanggan", key: "/kelola-customer" },
              ],
            },
            {
              key: "logout",
              label: "Logout",
              icon: <LogoutOutlined style={{ fontSize: 26 }} />,
              danger: true,
            },
          ]}
        />
      </div>
    </>
  );
}
