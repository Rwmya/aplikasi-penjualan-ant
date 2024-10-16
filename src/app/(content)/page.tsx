"use client";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Table } from "antd";

type Transaction = {
  id: number;
  date: string;
  amount: number;
  isPaid: boolean;
  customerId: number;
  customer?: { name: string }; // Include customer name
};

type HistoryBarang = {
  namaBarang: string;
  jumlah: number;
  action: string;
  changedAt: string;
};

const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

const Dashboard: React.FC = () => {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [recentItemMovements, setRecentItemMovements] = useState<
    HistoryBarang[]
  >([]);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [newCustomers, setNewCustomers] = useState<number>(0);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [dailyRevenue, setDailyRevenue] = useState<number>(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);

  useEffect(() => {
    // Fetch data from the new dashboard API
    fetch("/api/dashboard")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setRecentTransactions(data.data.recentTransactions);
          setRecentItemMovements(data.data.recentItemMovements);
          setTotalCustomers(data.data.totalCustomers);
          setNewCustomers(data.data.newCustomers);
          setTotalTransactions(data.data.totalTransactions);
          setDailyRevenue(data.data.dailyRevenue); // Set daily revenue
          setWeeklyRevenue(data.data.weeklyRevenue); // Set weekly revenue
          setMonthlyRevenue(data.data.monthlyRevenue); // Set monthly revenue
        }
      })
      .catch((error) => console.error("Error fetching dashboard data:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Pelanggan Hari ini"
              value={totalCustomers}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Pelanggan Baru Hari ini" value={newCustomers} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Transaksi Hari ini"
              value={totalTransactions}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Pendapatan Harian"
              value={dailyRevenue}
              formatter={(value) => formatRupiah(Number(value))}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Pendapatan Mingguan"
              value={weeklyRevenue}
              formatter={(value) => formatRupiah(Number(value))}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Pendapatan Bulanan"
              value={monthlyRevenue}
              formatter={(value) => formatRupiah(Number(value))}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={12}>
          <Card title="Transaksi Terbaru">
            <Table<Transaction>
              dataSource={recentTransactions}
              columns={[
                {
                  title: "Customer",
                  dataIndex: ["customer", "name"],
                  key: "id",
                },
                {
                  title: "Tanggal",
                  dataIndex: "date",
                  key: "date",
                  render: (date: string) =>
                    new Date(date).toLocaleDateString("id-ID"),
                },
                {
                  title: "Jumlah",
                  dataIndex: "amount",
                  key: "amount",
                  render: (amount: number) => formatRupiah(amount),
                },
                {
                  title: "Tipe",
                  dataIndex: "isPaid",
                  key: "isPaid",
                  render: (isPaid: boolean) => (isPaid ? "Tunai" : "Non Tunai"),
                },
              ]}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Pergerakan Barang Terbaru">
            <Table<HistoryBarang>
              dataSource={recentItemMovements}
              columns={[
                {
                  title: "Nama Barang",
                  dataIndex: "namaBarang",
                  key: "namaBarang",
                },
                { title: "Jumlah", dataIndex: "jumlah", key: "jumlah" },
                {
                  title: "Aksi",
                  dataIndex: "action",
                  key: "action",
                  render: (action: string) =>
                    action === "tambah" ? "Masuk" : "Keluar",
                },
                {
                  title: "Tanggal",
                  dataIndex: "changedAt",
                  key: "changedAt",
                  render: (date: string) =>
                    new Date(date).toLocaleDateString("id-ID"),
                },
              ]}
              rowKey="changedAt"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
