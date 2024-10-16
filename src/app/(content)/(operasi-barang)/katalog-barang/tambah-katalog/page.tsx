"use client";
import React, { useState } from "react";
import { Button, Form, Input, Row, Col, Space, Card, message } from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const TambahKatalog: React.FC = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([{ name: "", satuan: "", harga: "" }]);
  const [loading, setLoading] = useState(false);

  // Add more items
  const addItem = () => {
    setItems([...items, { name: "", satuan: "", harga: "" }]);
  };

  // Remove an item
  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Handle input change
  const handleInputChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Reset the form
  const resetForm = () => {
    setItems([{ name: "", satuan: "", harga: "" }]);
    form.resetFields();
  };

  // Save form and post data to the API
  const saveForm = async () => {
    try {
      await form.validateFields();
      setLoading(true);

      const response = await fetch("/api/barang/tambah-katalog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: items }),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan Katalog");
      }

      const result = await response.json();
      message.success("Berhasil Menyimpan Katalog");
      console.log(result);

      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card
        title="Tambah Katalog Barang"
        className="bg-slate-100"
        style={{ backgroundColor: "#f1f5f9" }} // Tailwind's bg-slate-100 equivalent
      >
        <Form form={form} layout="vertical">
          {items.map((item, index) => (
            <Row
              key={index}
              gutter={16}
              align="middle"
              style={{ marginBottom: 16 }}
            >
              <Col span={8}>
                <Form.Item
                  label="Nama Barang"
                  name={`name-${index}`}
                  rules={[{ required: true, message: "Tolong Input Nama!" }]}
                >
                  <Input
                    placeholder="Nama Barang"
                    value={item.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Satuan"
                  name={`satuan-${index}`}
                  rules={[{ required: true, message: "Tolong Input satuan!" }]}
                >
                  <Input
                    placeholder="Satuan"
                    value={item.satuan}
                    onChange={(e) =>
                      handleInputChange(index, "satuan", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="Harga"
                  name={`harga-${index}`}
                  rules={[{ required: true, message: "Tolong Input harga!" }]}
                >
                  <Input
                    prefix="Rp."
                    placeholder="Harga"
                    type="number"
                    value={item.harga}
                    onChange={(e) =>
                      handleInputChange(index, "harga", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                {index > 0 && (
                  <Button
                    type="text"
                    icon={<MinusCircleOutlined />}
                    onClick={() => removeItem(index)}
                    danger
                  >
                    Hapus
                  </Button>
                )}
              </Col>
            </Row>
          ))}

          <Form.Item>
            <Button type="dashed" onClick={addItem} icon={<PlusOutlined />}>
              Tambah Lebih banyak barang
            </Button>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                onClick={saveForm}
                loading={loading}
                icon={<SaveOutlined />}
              >
                Simpan
              </Button>
              <Button
                htmlType="button"
                onClick={resetForm}
                icon={<ReloadOutlined />}
              >
                Reset
              </Button>
              <Button
                type="default"
                href="/katalog-barang"
                icon={<ArrowLeftOutlined />}
              >
                Kembali
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TambahKatalog;
