"use client";
import React, { useState, useEffect, useRef } from "react";
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

interface StockItem {
  key: string;
  name: string;
  satuan: string;
  quantity: number;
  harga: number;
}

interface HistoryItem {
  namaBarang: string;
  jumlah: number;
  action: string;
  changedAt: string;
}

interface GroupedItem {
  namaBarang: string;
  jumlah: number;
  action: string;
  changedAt: string;
}

type Item = StockItem | HistoryItem;

const ReportBarang: React.FC = () => {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<string>("stok");
  const [dates, setDates] = useState<[Dayjs, Dayjs] | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [groupedData, setGroupedData] = useState<GroupedItem[]>([]);
  const [totalData, setTotalData] = useState<{ [key: string]: number }>({});

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/barang/list-barang");
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      message.error("Failed to fetch stock data");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoryData = async (startDate: string, endDate: string) => {
    setLoading(true);
    const url = `/api/barang/history-barang?startDate=${startDate}&endDate=${endDate}&action=${reportType === "masuk" ? "tambah" : "kurangi"}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      if (result.success) {
        setData(result.data);
        groupAndAccumulateData(result.data);
      } else {
        throw new Error(result.error || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching history data:", error);
      message.error("Failed to fetch history data");
    } finally {
      setLoading(false);
    }
  };

  const groupAndAccumulateData = (items: HistoryItem[]) => {
    const grouped: { [key: string]: GroupedItem } = {};
    const total: { [key: string]: number } = {};

    items.forEach((item) => {
      // Parse the date string to ensure it's in a valid format
      const date = new Date(item.changedAt);
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const key = `${formattedDate}_${item.namaBarang}`;

      if (!grouped[key]) {
        grouped[key] = {
          namaBarang: item.namaBarang,
          jumlah: 0,
          action: item.action,
          changedAt: formattedDate,
        };
      }
      grouped[key].jumlah += item.jumlah;

      if (!total[item.namaBarang]) {
        total[item.namaBarang] = 0;
      }
      total[item.namaBarang] += item.jumlah;
    });

    setGroupedData(Object.values(grouped));
    setTotalData(total);
  };

  useEffect(() => {
    if (reportType === "stok") {
      fetchStockData();
    } else {
      setData([]);
    }
  }, [reportType]);

  const handleDateChange = (
    dates: (Dayjs | null)[] | null,
    dateStrings: [string, string],
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDates([dates[0], dates[1]] as [Dayjs, Dayjs]);
      fetchHistoryData(dateStrings[0], dateStrings[1]);
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
                  <title>Laporan ${reportType === "stok" ? "Stok Barang" : reportType === "masuk" ? "Barang Masuk" : "Barang Keluar"}</title>
                  <style>
                    @media print {
                      @page {
                        size: A4;
                        margin: 20mm 15mm 20mm 15mm;
                      }
                      body {
                        font-family: Arial, sans-serif;
                        color: #333;
                      }
                      .header {
                        width: 100%;
                        text-align: center;
                        padding: 10px 0;
                        border-bottom: 2px solid #333;
                      }
                      .header h1 {
                        margin: 0;
                        font-size: 24px;
                        color: #333;
                      }
                      .header p {
                        margin: 5px 0 0;
                        font-size: 14px;
                        color: #666;
                      }
                      .content {
                        margin-top: 20px;
                      }
                      table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                        page-break-inside: auto;
                      }
                      tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                      }
                      th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                        font-size: 12px;
                      }
                      th {
                        background-color: #f2f2f2;
                        font-weight: bold;
                        text-transform: uppercase;
                      }
                      .footer {
                        width: 100%;
                        text-align: center;
                        font-size: 10px;
                        color: #666;
                        padding: 10px 0;
                        border-top: 1px solid #ddd;
                      }
                      .total-row {
                        font-weight: bold;
                        background-color: #e6f7ff;
                      }
                    }
                  </style>
                </head>
                <body>
                  <div class="header">
                    <h1>Laporan ${reportType === "stok" ? "Stok Barang" : reportType === "masuk" ? "Barang Masuk" : "Barang Keluar"}</h1>
                    <p>Periode: ${dates ? `${dates[0].format("DD/MM/YYYY")} - ${dates[1].format("DD/MM/YYYY")}` : "Semua Waktu"}</p>
                  </div>
                  <div class="content">
                    ${printContents}
                  </div>
                  <div class="footer">
                    <p>Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span></p>
                    <p>Dicetak pada ${new Date().toLocaleString()}</p>
                  </div>
                  <script>
                    (function() {
                      var totalPages = Math.ceil(document.body.scrollHeight / 1123); // A4 height in pixels at 96 DPI
                      var pageNumElements = document.getElementsByClassName('pageNumber');
                      var totalPagesElements = document.getElementsByClassName('totalPages');
                      for (var i = 0; i < pageNumElements.length; i++) {
                        var pageNum = document.createElement('span');
                        pageNum.className = 'pageNumber';
                        pageNum.innerHTML = '<span></span>';
                        pageNumElements[i].parentNode.replaceChild(pageNum, pageNumElements[i]);
                      }
                      for (var i = 0; i < totalPagesElements.length; i++) {
                        totalPagesElements[i].textContent = totalPages;
                      }
                    })();
                  </script>
                </body>
              </html>
            `);
        newWindow.document.close();
        setTimeout(() => {
          newWindow.print();
          newWindow.close();
        }, 250);
      }
    }
  };

  const stockColumns: ColumnsType<Item> = [
    {
      title: "Nama Barang",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) =>
        (a as StockItem).name.localeCompare((b as StockItem).name),
    },
    {
      title: "Satuan",
      dataIndex: "satuan",
      key: "satuan",
    },
    {
      title: "Jumlah",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => (a as StockItem).quantity - (b as StockItem).quantity,
    },
    {
      title: "Harga",
      dataIndex: "harga",
      key: "harga",
      render: (harga) => `Rp ${(harga as number).toLocaleString()}`,
    },
  ];

  const historyColumns: ColumnsType<Item> = [
    {
      title: "Nama Barang",
      dataIndex: "namaBarang",
      key: "namaBarang",
      sorter: (a, b) =>
        (a as HistoryItem).namaBarang.localeCompare(
          (b as HistoryItem).namaBarang,
        ),
    },
    {
      title: "Jumlah",
      dataIndex: "jumlah",
      key: "jumlah",
      sorter: (a, b) => (a as HistoryItem).jumlah - (b as HistoryItem).jumlah,
    },
    {
      title: "Aksi",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Tanggal",
      dataIndex: "changedAt",
      key: "changedAt",
      sorter: (a, b) => {
        const dateA = (a as GroupedItem).changedAt
          .split("/")
          .reverse()
          .join("");
        const dateB = (b as GroupedItem).changedAt
          .split("/")
          .reverse()
          .join("");
        return dateA.localeCompare(dateB);
      },
    },
  ];

  return (
    <div className="space-y-4">
      <Typography.Title level={3}>
        Laporan{" "}
        {reportType === "stok"
          ? "Stok Barang"
          : reportType === "masuk"
            ? "Barang Masuk"
            : "Barang Keluar"}
      </Typography.Title>

      <Space style={{ marginBottom: 16 }}>
        <Select
          value={reportType}
          onChange={(value) => {
            setReportType(value);
            setDates(null);
            setData([]);
            setGroupedData([]);
            setTotalData({});
          }}
        >
          <Option value="stok">Stok Barang</Option>
          <Option value="masuk">Barang Masuk</Option>
          <Option value="keluar">Barang Keluar</Option>
        </Select>

        {reportType !== "stok" && (
          <RangePicker value={dates} onChange={handleDateChange} />
        )}

        <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
          Print Laporan
        </Button>
      </Space>

      <div ref={printRef}>
        <Table
          columns={reportType === "stok" ? stockColumns : historyColumns}
          dataSource={reportType === "stok" ? data : groupedData}
          pagination={false}
          bordered
          loading={loading}
        />
        {reportType !== "stok" && (
          <div className="mt-3">
            <h3>Total Barang</h3>
            <Table
              columns={[
                {
                  title: "Nama Barang",
                  dataIndex: "namaBarang",
                  key: "namaBarang",
                },
                {
                  title: "Total Jumlah",
                  dataIndex: "totalJumlah",
                  key: "totalJumlah",
                },
              ]}
              dataSource={Object.entries(totalData).map(
                ([namaBarang, totalJumlah]) => ({
                  key: namaBarang,
                  namaBarang,
                  totalJumlah,
                }),
              )}
              pagination={false}
              bordered
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportBarang;
