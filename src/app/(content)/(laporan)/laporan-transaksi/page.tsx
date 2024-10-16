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

interface Barang {
  id: number;
  namaBarang: string;
  harga: number;
  satuan: string;
}

interface TransactionItem {
  id: number;
  transactionId: number;
  barangId: number;
  jumlah: number;
  barang: Barang;
}

interface Customer {
  id: number;
  name: string;
  field: string;
  debt: number;
}

interface Transaction {
  id: number;
  customerId: number;
  date: string;
  amount: number;
  isPaid: boolean;
  customer: Customer;
  items: TransactionItem[];
}

interface GroupedTransaction {
  id: number;
  customerId: number;
  date: string;
  isPaid: boolean;
  customer: Customer;
  items: TransactionItem[];
  amount: number; // Total amount for the grouped items
}

const LaporanTransaksi: React.FC = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [filteredData, setFilteredData] = useState<GroupedTransaction[]>([]);
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
        filterData(result.data, transactionType);
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

  const filterData = (data: Transaction[], type: string) => {
    const filtered =
      type === "semua"
        ? data
        : data.filter(
            (transaction) => transaction.isPaid === (type === "tunai"),
          );

    const groupedData: { [key: string]: GroupedTransaction } = {};

    filtered.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      const key = `${transaction.customer.name}_${date}`;

      if (!groupedData[key]) {
        groupedData[key] = {
          ...transaction,
          items: [],
          amount: 0,
        };
      }

      const groupedItems = groupItems([
        ...groupedData[key].items,
        ...transaction.items,
      ]);
      groupedData[key].items = groupedItems;

      // Calculate the total amount based on the grouped items
      groupedData[key].amount = groupedItems.reduce(
        (sum, item) => sum + item.jumlah * item.barang.harga,
        0,
      );
    });

    setFilteredData(Object.values(groupedData));
  };

  const groupItems = (items: TransactionItem[]) => {
    const grouped: { [key: string]: TransactionItem } = {};

    items.forEach((item) => {
      const key = item.barang.namaBarang;
      if (!grouped[key]) {
        grouped[key] = { ...item, jumlah: 0 };
      }
      grouped[key].jumlah += item.jumlah;
    });

    return Object.values(grouped);
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
      setData([]);
      setFilteredData([]);
    }
  };

  const handleTransactionTypeChange = (value: string) => {
    setTransactionType(value);
    filterData(data, value);
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const title = getDynamicTitle();
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(
          `<html>
            <head>
              <title>${title}</title>
              <style>
                @media print {
                  @page {
                    size: A4;
                    margin: 20mm;
                  }
                  body {
                    font-family: Arial, sans-serif;
                    color: #333;
                  }
                  .header {
                    text-align: center;
                    padding: 10px 0;
                    border-bottom: 2px solid #333;
                  }
                  .header h1 {
                    margin: 0;
                    font-size: 24px;
                  }
                  .header p {
                    margin: 5px 0 0;
                    font-size: 14px;
                  }
                  .content {
                    margin-top: 20px;
                  }
                  table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
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
              <div class="header">
                <h1>${title}</h1>
                <p>Periode: ${dates ? `${dates[0].format("DD/MM/YYYY")} - ${dates[1].format("DD/MM/YYYY")}` : "Semua Waktu"}</p>
                <p>Dicetak pada: ${new Date().toLocaleString()}</p>
              </div>
              <div class="content">${printContents}</div>
            </body>
          </html>`,
        );
        newWindow.document.close();
        setTimeout(() => {
          newWindow.print();
          newWindow.close();
        }, 250);
      }
    }
  };

  const getDynamicTitle = () => {
    switch (transactionType) {
      case "tunai":
        return "Laporan Transaksi Tunai";
      case "nonTunai":
        return "Laporan Transaksi Non Tunai";
      default:
        return "Laporan Semua Transaksi";
    }
  };

  const columns: ColumnsType<GroupedTransaction> = [
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customerName",
      render: (customer: Customer) => customer.name,
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
            <div key={item.barang.id}>
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
      <Typography.Title level={3}>{getDynamicTitle()}</Typography.Title>

      <Space style={{ marginBottom: 16 }}>
        <Select
          style={{ width: 200 }}
          value={transactionType}
          onChange={handleTransactionTypeChange}
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
          dataSource={filteredData.map((item) => ({ ...item, key: item.id }))}
          pagination={false}
          bordered
          loading={loading}
        />
      </div>
    </div>
  );
};

export default LaporanTransaksi;
