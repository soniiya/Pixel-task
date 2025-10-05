import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getWorkOrders } from "@/lib/data";
import { Suspense } from "react";
import OrderListClient from '@/components/OrderListClient/page'

interface OrdersPageProps {
    searchParams: {
        page?: string;
        search?: string;
        status?: string;
        priority?: string;
    };
}

export default async function OrdersPage({searchParams}: OrdersPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <div className="card">
        <h1 className="text-xl font-semibold">Not signed in</h1>
        <p className="mt-2">Please <Link className="underline" href="/login">sign in</Link>.</p>
      </div>
    );
  }

  const {  orders, totalPages, currentPage } = await getWorkOrders(searchParams);

  //const where: any = session.user.role === "USER" ? { createdById: session.user.id } : {};
  // const orders = await prisma.workOrder.findMany({
  //   where,
  //   orderBy: { createdAt: "desc" },
  //   include: { createdBy: true, assignedTo: true }
  // });

  // console.log("orders", orders)

  return (
    <div className="card">
      <h1 className="text-xl font-semibold mb-3">Orders</h1>
    
        <Suspense fallback={<div>Loading filters and list...</div>}>
              <OrderListClient 
                  initialOrders={orders} 
                  totalPages={totalPages}
                  currentPage={currentPage}
              />
          </Suspense>
    </div>
  );
}
