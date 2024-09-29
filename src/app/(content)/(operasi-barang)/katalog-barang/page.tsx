"use client";
import React, { useState } from "react";
import { Table, Button, Space, Input, ConfigProvider } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface Item {
  key: string;
  name: string;
  type: string;
  quantity: number;
}

const data: Item[] = [
  { key: "1", name: "Apple", type: "Fruit", quantity: 100 },
  { key: "2", name: "Banana", type: "Fruit", quantity: 150 },
  { key: "3", name: "Carrot", type: "Vegetable", quantity: 200 },
  { key: "4", name: "Doughnut", type: "Pastry", quantity: 50 },
  { key: "5", name: "Eggplant", type: "Vegetable", quantity: 75 },
];

const KatalogBarang: React.FC = () => {
  const [sortedData, setSortedData] = useState<Item[]>(data);
  const [searchText, setSearchText] = useState<string>(""); // State for search text
  const [pageSize, setPageSize] = useState<number>(5); // State for page size

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);

    // Filter data based on search input
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setSortedData(filteredData);
  };

  const columns: ColumnsType<Item> = [
    {
      title: "Item Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name), // Sorting by name
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Item Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity, // Sorting by quantity
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            style={{ backgroundColor: "#faad14", borderColor: "#faad14" }}
          >
            Edit
          </Button>
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {borderColor: "#475569"}
        },
      }}
    >
      <div className="space-y-4">
        <h1 className="text-3xl">Katalog Barang</h1>
        <div className="flex justify-between md-4">
          <Input
            placeholder="Search by name"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch} // Update search value
            style={{ width: 200, marginRight: 16 }}
          />
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            href="/katalog-barang/tambah-katalog"
          >
            Katalog Barang
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={sortedData}
          pagination={{
            pageSize: pageSize, // Set the number of items per page
            showSizeChanger: true, // Allows the user to change page size
            pageSizeOptions: [5, 10, 15, 20], // Options for changing page size
            onShowSizeChange: (_current, size) => setPageSize(size),
          }}
          bordered
        />
      </div>
    </ConfigProvider>
  );
};

export default KatalogBarang;
