"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Form, Select, InputNumber, Button, Typography, Row, Col } from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Option } = Select;
const { Title } = Typography;

interface OrderItem {
  itemId: number | null;
  quantity: number;
}

interface FormValues {
  customerId: number;
  transactionType: "tunai" | "non tunai";
  orderItems: OrderItem[];
}

const PlaceOrderPage: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { itemId: null, quantity: 1 },
  ]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customers, setCustomers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  // Fetch items from API
  const fetchItems = async () => {
    try {
      const res = await fetch("/api/barang/list-barang");
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customer/list-customer");
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  // Calculate total price
  const calculateTotalPrice = useCallback(() => {
    const formValues = form.getFieldsValue();
    const total =
      formValues.orderItems?.reduce((sum, item) => {
        if (item && item.itemId !== null && item.quantity !== null) {
          const itemPrice =
            items.find((i) => i.key === item.itemId)?.harga || 0;
          return sum + itemPrice * item.quantity;
        }
        return sum;
      }, 0) || 0;
    setTotalPrice(total);
  }, [form, items]);

  useEffect(() => {
    fetchItems();
    fetchCustomers();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  const handleValuesChange = () => {
    calculateTotalPrice();
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { itemId: null, quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
    form.setFieldsValue({ orderItems: newItems });
    calculateTotalPrice();
  };

  const handlePlaceOrder = (values: FormValues) => {
    console.log("Form values:", values);
    console.log("Total price:", totalPrice);
  };

  const handleReset = () => {
    form.resetFields();
    setOrderItems([{ itemId: null, quantity: 1 }]);
    setTotalPrice(0);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Buat Pesanan</h1>

      <Form
        form={form}
        onFinish={handlePlaceOrder}
        layout="vertical"
        onValuesChange={handleValuesChange}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="customerId"
              rules={[{ required: true, message: "Mohon pilih pelanggan!" }]}
            >
              <Select
                showSearch
                placeholder="Pilih Pelanggan"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {customers.map((customer) => (
                  <Option key={customer.key} value={customer.key}>
                    {customer.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="transactionType"
              rules={[
                { required: true, message: "Mohon pilih jenis transaksi!" },
              ]}
              style={{ width: "calc(100% - 133px)" }}
            >
              <Select placeholder="Jenis Transaksi">
                <Option value="tunai">Tunai</Option>
                <Option value="non tunai">Non Tunai</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.List name="orderItems" initialValue={orderItems}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div key={field.key} className="mb-6 flex items-center">
                  <Form.Item
                    name={[field.name, "itemId"]}
                    rules={[{ required: true, message: "Mohon pilih item!" }]}
                    className="mb-0 mr-2"
                    style={{ width: "calc(100% - 230px)" }}
                  >
                    <Select
                      showSearch
                      placeholder="Pilih Item"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.children as unknown as string)
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {items.map((i) => (
                        <Option key={i.key} value={i.key}>
                          {i.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "quantity"]}
                    rules={[
                      { required: true, message: "Mohon masukkan jumlah!" },
                    ]}
                    initialValue={1}
                    className="mb-0 mr-2"
                    style={{ width: "100px" }}
                  >
                    <InputNumber min={1} />
                  </Form.Item>
                  {index > 0 && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        remove(field.name);
                        handleRemoveItem(index);
                      }}
                    >
                      Hapus
                    </Button>
                  )}
                </div>
              ))}
              <Button
                onClick={() => {
                  add();
                  handleAddItem();
                }}
                className="mb-4"
                icon={<PlusOutlined />}
              >
                Tambah Item
              </Button>
            </>
          )}
        </Form.List>

        <div className="mb-4">
          <Title level={3}>
            Total Harga: Rp {totalPrice.toLocaleString("id-ID")}
          </Title>
        </div>

        <div className="flex justify-start gap-4">
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            htmlType="submit"
          >
            Buat Pesanan
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
          <Link href="/">
            <Button icon={<ArrowLeftOutlined />}>Kembali ke Dashboard</Button>
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default PlaceOrderPage;
