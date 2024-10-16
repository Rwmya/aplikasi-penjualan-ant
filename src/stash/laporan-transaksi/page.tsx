"use client";
import React, { useState, useRef } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  DatePicker,
  Select,
  message,
} from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TransactionItem {
  id: number;
  transactionId: number;
  barangId: number;
  jumlah: number;
  barang: {
    id: number;
    namaBarang: string;
    harga: number;
    jumlah: number;
    satuan: string;
  };
}

interface Transaction {
  id: number;
  customerId: number;
  date: string;
  amount: number;
  isPaid: boolean;
  customer: {
    id: number;
    name: string;
    field: string;
    debt: number;
  };
  items: TransactionItem[];
}

const LaporanTransaksi: React.FC = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<string>("semua");
  const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchTransactionData = async (startDate: string, endDate: string) => {
    setLoading(true);
    const url = `/api/transaksi/history-transaksi?startDate=${startDate}&endDate=${endDate}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      message.error("Failed to fetch transaction data");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (
    dates: (Dayjs | null)[] | null,
    dateStrings: [string, string],
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDates([dates[0], dates[1]] as [Dayjs, Dayjs]);
      fetchTransactionData(dateStrings[0], dateStrings[1]);
    } else {
      setDates(null);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Laporan Transaksi</title>
              <style>
                @media print {
                  @page {
                    size: A4;
                    margin: 20mm;
                  }
                  body {
                    font-family: Arial, sans-serif;
                  }
                  table {
                    width: 100%;
                    border-collapse: collapse;
                  }
                  th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                  }
                  th {
                    background-color: #f2f2f2;
                  }
                }
              </style>
            </head>
            <body>
              <div>${printContents}</div>
            </body>
          </html>
        `);
        newWindow.document.close();
        newWindow.print();
      }
    }
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: "Customer",
      dataIndex: ["customer", "name"],
      key: "customerName",
    },
    {
      title: "Tanggal",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Jumlah Harga",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `Rp ${amount.toLocaleString()}`,
    },
    {
      title: "Status Pembayaran",
      dataIndex: "isPaid",
      key: "isPaid",
      render: (isPaid: boolean) => (isPaid ? "Tunai" : "Non Tunai"),
    },
    {
      title: "Detail Barang",
      dataIndex: "items",
      key: "items",
      render: (items: TransactionItem[]) => (
        <div>
          {items.map((item) => (
            <div key={item.id}>
              {item.barang.namaBarang} (x{item.jumlah}) - Rp{" "}
              {item.barang.harga.toLocaleString()}
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Typography.Title level={3}>Laporan Transaksi</Typography.Title>

      <Space style={{ marginBottom: 16 }}>
        <Select
          value={transactionType}
          onChange={(value) => {
            setTransactionType(value);
            setDates(null);
            setData([]);
          }}
        >
          <Option value="semua">Semua Transaksi</Option>
          <Option value="tunai">Transaksi Tunai</Option>
          <Option value="nonTunai">Transaksi Non Tunai</Option>
        </Select>

        <RangePicker value={dates} onChange={handleDateChange} />

        <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
          Print Laporan
        </Button>
      </Space>

      <div ref={printRef}>
        <Table
          columns={columns}
          dataSource={data.map((item) => ({ ...item, key: item.id }))}
          pagination={false}
          bordered
          loading={loading}
        />
      </div>
    </div>
  );
};

export default LaporanTransaksi;
