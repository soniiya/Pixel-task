import { z } from 'zod';

const PRIORITY_ENUM = z.union([z.literal("LOW"), z.literal("MED"), z.literal("HIGH")]);
const STATUS_ENUM = z.union([z.literal("OPEN"), z.literal("IN_PROGRESS"), z.literal("CLOSED")]);

export const WorkOrderSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters.").max(100),
  description: z.string().trim().min(10, "Description must be at least 10 characters."),
  priority: PRIORITY_ENUM,
});

export const UpdateStatusSchema = z.object({
    status: STATUS_ENUM,
});

export const UpdateAssignedToSchema = z.object({
    assignedToId: z.string().uuid("Invalid user ID."),
});