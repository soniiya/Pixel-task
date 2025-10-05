import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';

const ORDERS_PER_PAGE = 10;

export async function getWorkOrders(params: {
    page?: string;
    search?: string;
    status?: string;
    priority?: string;
}) {
    const user = await getAuthenticatedUser();

    const awaitedParams = await params; 
    
    const currentPage = parseInt(awaitedParams.page || '1');
    const skip = (currentPage - 1) * ORDERS_PER_PAGE;

    let scopeWhere: any = {};
    if (user.role === 'USER') {
        scopeWhere = { createdById: user.id };
    }
    
    const combinedWhere: any = { AND: [{ ...scopeWhere }] };

    if (params.search) {
        combinedWhere.AND.push({
            OR: [
                { title: { contains: params.search} },
                { description: { contains: params.search } },
            ],
        });
    }

    if (params.status && params.status !== 'ALL') {
        combinedWhere.AND.push({ status: params.status });
    }

    if (awaitedParams.priority && awaitedParams.priority !== 'ALL') {
        combinedWhere.AND.push({ priority: awaitedParams.priority });
    }

    const [orders, totalOrders] = await prisma.$transaction([
        prisma.workOrder.findMany({
            where: combinedWhere,
            take: ORDERS_PER_PAGE,
            skip: skip,
            orderBy: { createdAt: 'desc' },
            include: { createdBy: true, assignedTo: true },
        }),
        prisma.workOrder.count({ where: combinedWhere }),
    ]);

    return {
        orders,
        totalPages: Math.ceil(totalOrders / ORDERS_PER_PAGE),
        currentPage,
    };
}


export async function getWorkOrderDetail(id: string) {
    const user = await getAuthenticatedUser();
    
    let where: any = { id };
    
    if (user.role === 'USER') {
        where = { 
            id, 
            createdById: user.id 
        };
    }

    const order = await prisma.workOrder.findUnique({
        where: where,
        include: { createdBy: true, assignedTo: true },
    });

    if (!order) {
        notFound(); 
    }

    return order;
}


export async function getAllUsers() {
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' }
    });
    return users;
}