"use client";

import React from "react";
import { Card, Col, Row, Statistic, Table } from "antd";

// Helper function to format currency in Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

// Mock data based on the Prisma schema
const mockRevenue = {
  daily: 5000000,
  weekly: 35000000,
  monthly: 150000000,
};

const mockTotals = {
  totalCustomers: 150,
  totalRevenue: 500000000,
  totalTransactions: 1000,
};

const mockRecentTransactions = [
  { id: 1, customerId: 1, date: "2024-03-15", amount: 500000, tipe: "Tunai" },
  {
    id: 2,
    customerId: 2,
    date: "2024-03-14",
    amount: 1000000,
    tipe: "Non Tunai",
  },
  { id: 3, customerId: 3, date: "2024-03-13", amount: 250000, tipe: "Tunai" },
  {
    id: 4,
    customerId: 4,
    date: "2024-03-12",
    amount: 750000,
    tipe: "Non Tunai",
  },
  { id: 5, customerId: 5, date: "2024-03-11", amount: 300000, tipe: "Tunai" },
];

const mockRecentItems = [
  {
    id: 1,
    namaBarang: "Item A",
    harga: 100000,
    jumlah: 50,
    satuan: "pcs",
    createdAt: "2024-03-15",
  },
  {
    id: 2,
    namaBarang: "Item B",
    harga: 200000,
    jumlah: 30,
    satuan: "kg",
    createdAt: "2024-03-14",
  },
  {
    id: 3,
    namaBarang: "Item C",
    harga: 150000,
    jumlah: 40,
    satuan: "liter",
    createdAt: "2024-03-13",
  },
  {
    id: 4,
    namaBarang: "Item D",
    harga: 80000,
    jumlah: 100,
    satuan: "pcs",
    createdAt: "2024-03-12",
  },
  {
    id: 5,
    namaBarang: "Item E",
    harga: 300000,
    jumlah: 20,
    satuan: "kg",
    createdAt: "2024-03-11",
  },
];

const mockRecentUsers = [
  { id: 1, username: "user1", createdAt: "2024-03-15" },
  { id: 2, username: "user2", createdAt: "2024-03-14" },
  { id: 3, username: "user3", createdAt: "2024-03-13" },
  { id: 4, username: "user4", createdAt: "2024-03-12" },
  { id: 5, username: "user5", createdAt: "2024-03-11" },
];

const mockRecentItemMovements = [
  {
    id: 1,
    barangId: 1,
    namaBarang: "Item A",
    jumlah: 10,
    action: "Masuk",
    changedAt: "2024-03-15",
  },
  {
    id: 2,
    barangId: 2,
    namaBarang: "Item B",
    jumlah: 5,
    action: "Keluar",
    changedAt: "2024-03-14",
  },
  {
    id: 3,
    barangId: 3,
    namaBarang: "Item C",
    jumlah: 15,
    action: "Masuk",
    changedAt: "2024-03-13",
  },
  {
    id: 4,
    barangId: 4,
    namaBarang: "Item D",
    jumlah: 8,
    action: "Keluar",
    changedAt: "2024-03-12",
  },
  {
    id: 5,
    barangId: 5,
    namaBarang: "Item E",
    jumlah: 20,
    action: "Masuk",
    changedAt: "2024-03-11",
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Pelanggan"
              value={mockTotals.totalCustomers}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Penghasilan"
              value={mockTotals.totalRevenue}
              formatter={(value) => formatRupiah(value as number)}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Transaksi"
              value={mockTotals.totalTransactions}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Pendapatan Harian"
              value={mockRevenue.daily}
              formatter={(value) => formatRupiah(value as number)}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Pendapatan Mingguan"
              value={mockRevenue.weekly}
              formatter={(value) => formatRupiah(value as number)}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Pendapatan Bulanan"
              value={mockRevenue.monthly}
              formatter={(value) => formatRupiah(value as number)}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={12}>
          <Card title="Transaksi Terbaru">
            <Table
              dataSource={mockRecentTransactions}
              columns={[
                { title: "ID", dataIndex: "id", key: "id" },
                { title: "Tanggal", dataIndex: "date", key: "date" },
                {
                  title: "Jumlah",
                  dataIndex: "amount",
                  key: "amount",
                  render: (amount) => formatRupiah(amount),
                },
                { title: "Tipe", dataIndex: "tipe", key: "tipe" },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Barang Baru Ditambahkan">
            <Table
              dataSource={mockRecentItems}
              columns={[
                {
                  title: "Nama Barang",
                  dataIndex: "namaBarang",
                  key: "namaBarang",
                },
                {
                  title: "Harga",
                  dataIndex: "harga",
                  key: "harga",
                  render: (harga) => formatRupiah(harga),
                },
                { title: "Jumlah", dataIndex: "jumlah", key: "jumlah" },
                { title: "Satuan", dataIndex: "satuan", key: "satuan" },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={12}>
          <Card title="Pengguna Baru">
            <Table
              dataSource={mockRecentUsers}
              columns={[
                { title: "Username", dataIndex: "username", key: "username" },
                {
                  title: "Tanggal Dibuat",
                  dataIndex: "createdAt",
                  key: "createdAt",
                },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Pergerakan Barang Terbaru">
            <Table
              dataSource={mockRecentItemMovements}
              columns={[
                {
                  title: "Nama Barang",
                  dataIndex: "namaBarang",
                  key: "namaBarang",
                },
                { title: "Jumlah", dataIndex: "jumlah", key: "jumlah" },
                { title: "Aksi", dataIndex: "action", key: "action" },
                { title: "Tanggal", dataIndex: "changedAt", key: "changedAt" },
              ]}
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
