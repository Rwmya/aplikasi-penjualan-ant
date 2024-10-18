"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Space, Input, message, Modal, Form } from "antd";
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
  satuan: string;
  harga: number;
}

const formatCurrency = (amount: number) => {
  return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

const KatalogBarang: React.FC = () => {
  const [sortedData, setSortedData] = useState<Item[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingItem) {
      form.setFieldsValue(editingItem);
    }
  }, [editingItem, form]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/barang/list-barang");
      if (!response.ok) {
        throw new Error("Gagal mengambil data");
      }
      const result = await response.json();
      if (result.success) {
        setSortedData(result.data);
      } else {
        throw new Error(result.error || "Gagal mengambil data");
      }
    } catch (error) {
      message.error("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);

    const filteredData = sortedData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()),
    );
    setSortedData(filteredData);
  };

  // Handle Edit
  const handleEdit = (item: Item) => {
    setEditingKey(item.key);
    setEditingItem(item);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (values: Item) => {
    try {
      const response = await fetch(`/api/barang/${editingKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        message.success("Barang sukses diperbarui");
        fetchData();
      } else {
        throw new Error("Gagal memperbarui barang");
      }
    } catch (error) {
      message.error("Gagal memperbarui barang");
    } finally {
      setIsEditModalVisible(false);
    }
  };

  // Handle delete confirmation modal
  const confirmDelete = (key: string) => {
    setDeletingKey(key);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/barang/${deletingKey}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success("Barang berhasil dihapus");
        fetchData();
      } else {
        throw new Error("Gagal menghapus barang");
      }
    } catch (error) {
      message.error("Gagal menghapus barang");
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  const columns: ColumnsType<Item> = [
    {
      title: "Nama Barang",
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
      title: "Harga",
      dataIndex: "harga",
      key: "harga",
      sorter: (a, b) => a.harga - b.harga,
      sortDirections: ["ascend", "descend"],
      render: (text) => formatCurrency(text),
    },
    {
      title: "Ditambahkan pada",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => {
        const date = new Date(text);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
        const year = String(date.getFullYear()); // Get last two digits of the year
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: "Aksi",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            style={{ backgroundColor: "#faad14", borderColor: "#faad14" }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete(record.key)}
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-3xl">Katalog Barang</h1>
      <div className="flex justify-between md-4">
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
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
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 15, 20],
          onShowSizeChange: (_current, size) => setPageSize(size),
        }}
        bordered
        loading={loading}
      />
      {/* Edit Modal */}
      <Modal
        title="Edit barang"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleEditSubmit}>
          <Form.Item
            label="Nama Barang"
            name="name"
            rules={[{ required: true, message: "Tolong masukan nama barang!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Satuan"
            name="satuan"
            rules={[{ required: true, message: "Tolong masukan satuan!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Harga"
            name="harga"
            rules={[{ required: true, message: "Tolong masukan harga!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Simpan
              </Button>
              <Button onClick={() => setIsEditModalVisible(false)}>
                Batal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        title="Konfirmasi Hapus"
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Hapus"
        cancelText="Batal"
        okButtonProps={{ danger: true }}
      >
        <p>Apakah anda yakin akan menghapus barang ini?</p>
      </Modal>
    </div>
  );
};

export default KatalogBarang;
