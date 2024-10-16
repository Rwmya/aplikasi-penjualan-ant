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

interface User {
  key: string;
  username: string;
  password: string; // Include password
  createdAt: Date;
  updatedAt: Date;
}

const KelolaAdmin: React.FC = () => {
  const [sortedData, setSortedData] = useState<User[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingUser) {
      form.setFieldsValue(editingUser);
    }
  }, [editingUser, form]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/list-admin");
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

    const filteredData = sortedData.filter((user) =>
      user.username.toLowerCase().includes(value.toLowerCase()),
    );
    setSortedData(filteredData);
  };

  const handleEdit = (user: User) => {
    setEditingKey(user.key);
    setEditingUser(user);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (values: User) => {
    const payload = {
      username: values.username,
      password: values.password,
    };
    try {
      const response = await fetch(`/api/admin/${editingKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        message.success("Admin updated successfully");
        fetchData();
      } else {
        throw new Error("Failed to update admin");
      }
    } catch (error) {
      message.error("Failed to update admin");
    } finally {
      setIsEditModalVisible(false);
    }
  };

  const confirmDelete = (key: string) => {
    setDeletingKey(key);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/${deletingKey}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success("Admin deleted successfully");
        fetchData();
      } else {
        throw new Error("Failed to delete admin");
      }
    } catch (error) {
      message.error("Failed to delete admin");
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  // New function to handle adding an admin
  const handleAddSubmit = async (values: User) => {
    const payload = {
      username: values.username,
      password: values.password,
    };
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        message.success("Admin added successfully");
        fetchData();
      } else {
        throw new Error("Failed to add admin");
      }
    } catch (error) {
      message.error("Failed to add admin");
    } finally {
      setIsAddModalVisible(false);
      form.resetFields();
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
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
      <h1 className="text-3xl">Kelola Admin</h1>
      <div className="flex justify-between md-4">
        <Input
          placeholder="Search by username"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
          style={{ width: 200, marginRight: 16 }}
        />
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => setIsAddModalVisible(true)} // Open Add Admin modal
        >
          Add Admin
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={sortedData}
        pagination={{ pageSize: 5, showSizeChanger: true }}
        bordered
        loading={loading}
      />
      {/* Edit Modal */}
      <Modal
        title="Edit Admin"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleEditSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input the username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input the password!" }]}
          >
            <Input.Password />
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
      {/* Add Admin Modal */}
      <Modal
        title="Add Admin"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input the username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input the password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
              <Button onClick={() => setIsAddModalVisible(false)}>
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
        <p>Are you sure you want to delete this admin?</p>
      </Modal>
    </div>
  );
};

export default KelolaAdmin;
