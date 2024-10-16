// app/api/transaction/place-order/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

interface OrderItem {
  itemId: number; // or null if you want to keep it as nullable
  quantity: number;
  harga: number; // Add this to hold the price
}

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Extract data from the request body
    const { customerId, transactionType, orderItems } = body;
    const isPaid = transactionType === "tunai";

    // Calculate total amount for the transaction
    const totalAmount = orderItems.reduce((sum: number, item: OrderItem) => {
      return sum + item.quantity * item.harga;
    }, 0);

    // Create a new transaction
    const newTransaction = await prisma.transaction.create({
      data: {
        customerId,
        amount: totalAmount,
        isPaid,
        items: {
          create: orderItems.map((item: OrderItem) => ({
            barangId: item.itemId,
            jumlah: item.quantity,
          })),
        },
      },
    });

    // Update customer debt if the transaction is not paid
    if (!isPaid) {
      await prisma.customer.update({
        where: { id: customerId },
        data: {
          debt: {
            increment: totalAmount,
          },
        },
      });
    }

    return NextResponse.json({ success: true, transaction: newTransaction });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create transaction" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
