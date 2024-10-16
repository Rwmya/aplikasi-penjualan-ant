"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Space, Input, message } from "antd";
import {
  CloseOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface Item {
  key: string;
  id: number;
  name: string;
  satuan: string;
  quantity: number;
}

const StokBarang: React.FC = () => {
  const [sortedData, setSortedData] = useState<Item[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(5);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [count, setCount] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/barang/list-barang");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      if (result.success) {
        setSortedData(result.data);
      } else {
        throw new Error(result.error || "Failed to fetch data");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCountChange = (value: number, key: string) => {
    setCount((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
    const filteredData = sortedData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()),
    );
    setSortedData(filteredData);
  };

  const handleKelolaClick = (key: string) => {
    setEditingKey(editingKey === key ? null : key);
    setCount((prev) => ({ ...prev, [key]: 0 }));
  };

  const handleQuantityChange = async (
    id: number,
    quantity: number,
    action: "tambah" | "kurangi",
  ) => {
    if (quantity < 1) {
      message.error("Error jumlah tidak bisa nol");
      return;
    }
    try {
      console.log(id, quantity, action);
      const response = await fetch("/api/barang/ubah-stok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity, action }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const result = await response.json();
      if (result.success) {
        message.success(
          `Quantity ${action === "tambah" ? "increased" : "decreased"} successfully`,
        );
        fetchData(); // Refresh the data
      } else {
        throw new Error(result.error || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Failed to update quantity");
    }
  };

  const columns: ColumnsType<Item> = [
    {
      title: "Nama barang",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Satuan",
      dataIndex: "satuan",
      key: "satuan",
    },
    {
      title: "Jumlah",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Aksi",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {editingKey === record.key ? (
            <>
              <Input
                type="number"
                placeholder="Jumlah"
                value={count[record.key] || 0}
                min={0}
                onChange={(e) =>
                  handleCountChange(Number(e.target.value), record.key)
                }
                style={{ width: 100 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  handleQuantityChange(
                    parseInt(record.key),
                    count[record.key] || 0,
                    "tambah",
                  );
                  handleKelolaClick(record.key);
                }}
              >
                Tambah
              </Button>
              <Button
                type="primary"
                icon={<MinusOutlined />}
                onClick={() => {
                  handleQuantityChange(
                    parseInt(record.key),
                    count[record.key] || 0,
                    "kurangi",
                  );
                  handleKelolaClick(record.key);
                }}
                danger
              >
                Kurangi
              </Button>
            </>
          ) : null}

          <Button
            type="primary"
            icon={
              editingKey === record.key ? <CloseOutlined /> : <EditOutlined />
            }
            style={{
              backgroundColor: "#faad14",
              borderColor: "#faad14",
            }}
            onClick={() => handleKelolaClick(record.key)}
          >
            {editingKey === record.key ? "Batal" : "Kelola"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-3xl">Stok Barang</h1>
        <div className="flex justify-between md-4">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 200, marginRight: 16 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={sortedData}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 15, 20],
            onShowSizeChange: (_current, size) => setPageSize(size),
          }}
          bordered
          loading={loading}
        />
      </div>
    </>
  );
};

export default StokBarang;
