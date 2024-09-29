"use client";
import React, { useState } from "react";
import { Table, Button, Space, Input } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
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
  { key: "6", name: "Fig", type: "Fruit", quantity: 60 },
  { key: "7", name: "Grape", type: "Fruit", quantity: 120 },
  { key: "8", name: "Honeydew", type: "Fruit", quantity: 90 },
  { key: "9", name: "Iceberg Lettuce", type: "Vegetable", quantity: 110 },
  { key: "10", name: "Jalapeño", type: "Vegetable", quantity: 40 },
  { key: "11", name: "Kiwi", type: "Fruit", quantity: 85 },
  { key: "12", name: "Lemon", type: "Fruit", quantity: 70 },
  { key: "13", name: "Mango", type: "Fruit", quantity: 130 },
  { key: "14", name: "Nectarine", type: "Fruit", quantity: 95 },
  { key: "15", name: "Onion", type: "Vegetable", quantity: 150 },
  { key: "16", name: "Peach", type: "Fruit", quantity: 80 },
  { key: "17", name: "Quinoa", type: "Grain", quantity: 200 },
  { key: "18", name: "Radish", type: "Vegetable", quantity: 120 },
  { key: "19", name: "Spinach", type: "Vegetable", quantity: 140 },
  { key: "20", name: "Tomato", type: "Fruit", quantity: 160 },
  { key: "21", name: "Ugli Fruit", type: "Fruit", quantity: 50 },
  { key: "22", name: "Vanilla Pudding", type: "Dessert", quantity: 30 },
  { key: "23", name: "Watermelon", type: "Fruit", quantity: 180 },
  { key: "24", name: "Xigua", type: "Fruit", quantity: 45 },
  { key: "25", name: "Yam", type: "Vegetable", quantity: 60 },
  { key: "26", name: "Zucchini", type: "Vegetable", quantity: 70 },
  { key: "27", name: "Baguette", type: "Bread", quantity: 100 },
  { key: "28", name: "Croissant", type: "Pastry", quantity: 40 },
  { key: "29", name: "Pineapple", type: "Fruit", quantity: 90 },
  { key: "30", name: "Chard", type: "Vegetable", quantity: 150 },
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
      item.name.toLowerCase().includes(value.toLowerCase()),
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
    <>
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
          <Button type="primary">Tambah Katalog Barang</Button>
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
    </>
  );
};

export default KatalogBarang;
