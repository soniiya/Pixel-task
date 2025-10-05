'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { WorkOrderSchema } from '@/lib/validation';

export async function createWorkOrder(prevState: any, formData: FormData) {
    let user;
    try {
        user = await getAuthenticatedUser();
    } catch (e) {
        return { message: "Authentication required to create an order." };
    }
    const createdById = user.id;

    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority'),
    };
    const validatedFields = WorkOrderSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to validate fields."
        };
    }

    try {
        const newOrder = await prisma.workOrder.create({
            data: {
                ...validatedFields.data,
                createdById: createdById, 
                status: 'OPEN', 
            },
        });
        
        revalidatePath('/orders');
        return { success: true, orderId: newOrder.id, message: "Order created successfully." };
        // redirect(`/orders/${newOrder.id}`); 
    } catch (error) {
        console.error(error);
        return { message: "Database error: Failed to create work order." };
    }
}


export async function updateWorkOrderField(
    id: string, 
    field: string, 
    value: string | null
) {
    const user = await getAuthenticatedUser();
    
    const order = await prisma.workOrder.findUnique({ where: { id } });
    if (!order) throw new Error("Order not found.");

    const isOwner = order.createdById === user.id;
    const isManager = user.role === 'MANAGER';
    
    if (['status', 'assignedToId'].includes(field) && !isManager) {
        throw new Error("Forbidden: Only managers can update this field.");
    }
    
    if (['title', 'description', 'priority'].includes(field) && !isManager && !isOwner) {
        throw new Error("Forbidden: You must be the creator or a manager to edit this field.");
    }

    if (field === 'priority') {
        WorkOrderSchema.shape.priority.parse(value);
    }
    const data: any = { [field]: value };

    await prisma.workOrder.update({
        where: { id },
        data: data,
    });
    
    revalidatePath(`/orders/${id}`);
}