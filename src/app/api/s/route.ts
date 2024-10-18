import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to get date in GMT+7
const getGMT7Date = (date: Date) => {
  return new Date(date.getTime() + 7 * 60 * 60 * 1000);
};

export async function GET() {
  try {
    // Get current date in GMT+7
    const now = getGMT7Date(new Date());

    // Calculate start and end of day in GMT+7
    const startOfDay = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
    );
    startOfDay.setUTCHours(startOfDay.getUTCHours() - 7); // Adjust for GMT+7
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    // Calculate start and end of week in GMT+7
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - startOfWeek.getUTCDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 7);

    // Calculate start and end of month in GMT+7
    const startOfMonth = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), 1),
    );
    startOfMonth.setUTCHours(startOfMonth.getUTCHours() - 7); // Adjust for GMT+7
    const endOfMonth = new Date(
      Date.UTC(now.getFullYear(), now.getMonth() + 1, 1),
    );
    endOfMonth.setUTCHours(endOfMonth.getUTCHours() - 7); // Adjust for GMT+7

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

    // Get unique customer IDs for today's transactions
    const uniqueCustomers = await prisma.transaction.findMany({
      
      distinct: ["customerId"],
      select: {
        customerId: true,
      },
    });

    console.log(uniqueCustomers)

    const totalCustomers = uniqueCustomers.length;

    // Count new customers created today
    const newCustomers = await prisma.customer.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay, // Corrected
        },
      },
    });

    // Count total transactions for today
    const totalTransactions = await prisma.transaction.count({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    // Calculate daily revenue
    const dailyRevenue = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: startOfDay,
          lt: startOfDay,
        },
      },
    });

    // Calculate weekly revenue
    const weeklyRevenue = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: startOfWeek,
          lt: endOfWeek,
        },
      },
    });

    // Calculate monthly revenue
    const monthlyRevenue = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        recentTransactions,
        recentItemMovements,
        totalCustomers,
        newCustomers,
        totalTransactions,
        dailyRevenue: dailyRevenue._sum.amount || 0,
        weeklyRevenue: weeklyRevenue._sum.amount || 0,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
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
