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

const TambahCustomer: React.FC = () => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([{ name: "", field: "" }]);
  const [loading, setLoading] = useState(false);

  // Add more customers
  const addCustomer = () => {
    setCustomers([...customers, { name: "", field: "" }]);
  };

  // Remove a customer
  const removeCustomer = (index: number) => {
    const newCustomers = customers.filter((_, i) => i !== index);
    setCustomers(newCustomers);
  };

  // Handle input change
  const handleInputChange = (index: number, field: string, value: string) => {
    const newCustomers = [...customers];
    newCustomers[index] = { ...newCustomers[index], [field]: value };
    setCustomers(newCustomers);
  };

  // Reset the form
  const resetForm = () => {
    setCustomers([{ name: "", field: "" }]);
    form.resetFields();
  };

  // Save form and post data to the API
  const saveForm = async () => {
    try {
      await form.validateFields();
      setLoading(true);

      const response = await fetch("/api/customer/tambah-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: customers }),
      });

      if (!response.ok) {
        throw new Error("Failed to save customers");
      }

      const result = await response.json();
      message.success("Customers successfully added");
      console.log(result);

      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card title="Tambah Customer" className="bg-slate-100">
        <Form form={form} layout="vertical">
          {customers.map((customer, index) => (
            <Row
              key={index}
              gutter={16}
              align="middle"
              style={{ marginBottom: 16 }}
            >
              <Col span={10}>
                <Form.Item
                  label="Nama Customer"
                  name={`name-${index}`}
                  rules={[
                    { required: true, message: "Please input customer name!" },
                  ]}
                >
                  <Input
                    placeholder="Nama Customer"
                    value={customer.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="Field"
                  name={`field-${index}`}
                  rules={[
                    { required: true, message: "Please input customer field!" },
                  ]}
                >
                  <Input
                    placeholder="Field"
                    value={customer.field}
                    onChange={(e) =>
                      handleInputChange(index, "field", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                {index > 0 && (
                  <Button
                    type="text"
                    icon={<MinusCircleOutlined />}
                    onClick={() => removeCustomer(index)}
                    danger
                  >
                    Remove
                  </Button>
                )}
              </Col>
            </Row>
          ))}

          <Form.Item>
            <Button type="dashed" onClick={addCustomer} icon={<PlusOutlined />}>
              Add More Customer
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
                Save
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
                href="/customers"
                icon={<ArrowLeftOutlined />}
              >
                Back
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TambahCustomer;
