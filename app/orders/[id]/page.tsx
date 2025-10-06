import { getWorkOrderDetail, getAllUsers } from '@/lib/data';
import OrderDetailClient from '@/components/OrderDetailClient/page'; 
import { Suspense } from 'react';
import { User as PrismaUser } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


interface OrderDetailPageProps {
    params: {
        id: string;
    }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const order = await getWorkOrderDetail(params.id); 
    const session = await getServerSession(authOptions); 
    const currentUserId = session?.user?.id;
    const isManager = session?.user?.role === 'MANAGER';
    const allUsers = await getAllUsers(); 

    //console.log("orders from orders/[id]", order)

    // useEffect(() => {
    //     if (isManager) {
    //         getAllUsers().then(setAllUsers).catch(e => console.error("Failed to fetch users:", e));
    //     }
    // }, [isManager]);
    
    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Work Order: {order.title}</h1>
            
            <Suspense fallback={<p>Loading order details...</p>}>
                <OrderDetailClient order={order} allUsers={allUsers} /> 
            </Suspense>
        </div>
    );
}

