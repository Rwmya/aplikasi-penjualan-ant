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
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      if (result.success) {
        setSortedData(result.data);
      } else {
        throw new Error(result.error || "Failed to fetch data");
      }
    } catch (error) {
      message.error("Failed to fetch data");
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
    try {
      const response = await fetch(`/api/customer/${editingKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        message.success("Customer updated successfully");
        fetchData();
      } else {
        throw new Error("Failed to update customer");
      }
    } catch (error) {
      message.error("Failed to update customer");
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
        message.success("Customer deleted successfully");
        fetchData();
      } else {
        throw new Error("Failed to delete customer");
      }
    } catch (error) {
      message.error("Failed to delete customer");
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
      title: "Field",
      dataIndex: "field",
      key: "field",
    },
    {
      title: "Debt",
      dataIndex: "debt",
      key: "debt",
      sorter: (a, b) => a.debt - b.debt,
      sortDirections: ["ascend", "descend"],
      render: (text) => formatCurrency(text),
    },
    {
      title: "Action",
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
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-3xl">Katalog Customer</h1>
      <div className="flex justify-between md-4">
        <Input
          placeholder="Search by name"
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
          Add Customer
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
              { required: true, message: "Please input the customer name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Field"
            name="field"
            rules={[{ required: true, message: "Please input the field!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Debt"
            name="debt"
            rules={[{ required: true, message: "Please input the debt!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
              <Button onClick={() => setIsEditModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this customer?</p>
      </Modal>
    </div>
  );
};

export default KatalogCustomer;
