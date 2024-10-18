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

interface Customer {
  key: string;
  name: string;
  field: string;
  debt: number;
}

const formatCurrency = (amount: number) => {
  return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

const KatalogCustomer: React.FC = () => {
  const [sortedData, setSortedData] = useState<Customer[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingCustomer) {
      form.setFieldsValue(editingCustomer);
    }
  }, [editingCustomer, form]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/customer/list-customer");
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

    const filteredData = sortedData.filter((customer) =>
      customer.name.toLowerCase().includes(value.toLowerCase()),
    );
    setSortedData(filteredData);
  };

  // Handle Edit
  const handleEdit = (customer: Customer) => {
    setEditingKey(customer.key);
    setEditingCustomer(customer);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (values: Customer) => {
    const payload = {
      ...values,
      debt: Number(values.debt), // Convert debt to a number
    };
    try {
      const response = await fetch(`/api/customer/${editingKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        message.success("Data pelanggan berhasil diperbarui");
        fetchData();
      } else {
        throw new Error("Data pelanggan berhasil diperbarui");
      }
    } catch (error) {
      message.error("Gagal memperbarui data pelanggan");
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
      const response = await fetch(`/api/customer/${deletingKey}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success("Pelanggan berhasil dihapus");
        fetchData();
      } else {
        throw new Error("Pelanggan berhasil dihapus");
      }
    } catch (error) {
      message.error("Gagal menghapus pelanggan");
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  const columns: ColumnsType<Customer> = [
    {
      title: "Nama Customer",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Bidang",
      dataIndex: "field",
      key: "field",
    },
    {
      title: "Hutang",
      dataIndex: "debt",
      key: "debt",
      sorter: (a, b) => a.debt - b.debt,
      sortDirections: ["ascend", "descend"],
      render: (text) => formatCurrency(text),
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
      <h1 className="text-3xl">Kelola Pelanggan</h1>
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
          href="/kelola-customer/tambah-customer"
        >
          Tambah Pelanggan
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
        title="Edit Customer"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleEditSubmit}>
          <Form.Item
            label="Nama Customer"
            name="name"
            rules={[
              { required: true, message: "Tolong isi nama pelanggan!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Field"
            name="field"
            rules={[{ required: true, message: "Tolong input bidang pelanggan!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Debt"
            name="debt"
            rules={[{ required: true, message: "tolong input hutang pelanggan!" }]}
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
        <p>Apa anda yakin ingin menghapus pelanggan ini?</p>
      </Modal>
    </div>
  );
};

export default KatalogCustomer;
