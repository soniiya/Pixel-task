import { getWorkOrderDetail } from '@/lib/data';
import OrderDetailClient from '@/components/OrderDetailClient/page'; 
import { Suspense } from 'react';

interface OrderDetailPageProps {
    params: {
        id: string;
    }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const order = await getWorkOrderDetail(params.id); 

    //console.log("orders from orders/[id]", order)
    
    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Work Order: {order.title}</h1>
            
            <Suspense fallback={<p>Loading order details...</p>}>
                <OrderDetailClient order={order} /> 
            </Suspense>
        </div>
    );
}

