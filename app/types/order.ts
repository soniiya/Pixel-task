import type { WorkOrder as PrismaWorkOrder, User } from '@prisma/client';

export type FullWorkOrder = PrismaWorkOrder & {
    createdBy: User;
    assignedTo: User | null;
};

export interface WorkOrder {
    id: string;
    title: string;
    status: string;
    priority: string;
    createdBy: { email: string };
    assignedTo: { email: string } | null;
}

export interface FieldDisplayProps {
    label: string;
    value: string;
    field: keyof FullWorkOrder;
    isEditable: boolean;
    onSave: (field: keyof FullWorkOrder, newValue: string) => void;
    inputType: 'text' | 'textarea' | 'select';
    options?: string[]; 
}