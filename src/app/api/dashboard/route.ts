import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to get date ranges for today, this week, and this month
const getDateRanges = () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // Start of today

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999); // End of today

  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - todayStart.getDay()); // Start of this week (Sunday)

  const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1); // Start of this month

  return { todayStart, todayEnd, weekStart, monthStart };
};

export async function GET() {
  try {
    const { todayStart, todayEnd, weekStart, monthStart } = getDateRanges();

    // Recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      include: {
        customer: true,
        items: {
          include: {
            barang: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
    });

    // Recent item movements
    const recentItemMovements = await prisma.historyBarang.findMany({
      select: {
        namaBarang: true,
        jumlah: true,
        action: true,
        changedAt: true,
      },
      orderBy: {
        changedAt: "desc",
      },
      take: 5,
    });

    // Total customers today based on transactions (ignoring duplicates)
    const totalCustomersToday = await prisma.transaction.findMany({
      where: {
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      select: {
        customerId: true,
      },
      distinct: ['customerId'],
    });

    // New customers today
    const newCustomersToday = await prisma.customer.count({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    // Total transactions today
    const totalTransactionsToday = await prisma.transaction.count({
      where: {
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    // Today's revenue
    const todayRevenue = await prisma.transaction.aggregate({
      where: {
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // This week's revenue
    const weekRevenue = await prisma.transaction.aggregate({
      where: {
        date: {
          gte: weekStart,
          lte: todayEnd, // TodayEnd ensures the revenue is up to the current time
        },
      },
      _sum: {
        amount: true,
      },
    });

    // This month's revenue
    const monthRevenue = await prisma.transaction.aggregate({
      where: {
        date: {
          gte: monthStart,
          lte: todayEnd,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        recentTransactions,
        recentItemMovements,
        totalCustomersToday: totalCustomersToday.length,
        newCustomersToday,
        totalTransactionsToday,
        todayRevenue: todayRevenue._sum.amount || 0, // Revenue for today
        weekRevenue: weekRevenue._sum.amount || 0,   // Revenue for this week
        monthRevenue: monthRevenue._sum.amount || 0, // Revenue for this month
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
