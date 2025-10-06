"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updateWorkOrderField } from "@/lib/action";
// import { getAllUsers } from '@/lib/data';
import { User as PrismaUser } from "@prisma/client";
import FieldDisplay from "../FieldDisplay/page";

type FullWorkOrder = Awaited<
  ReturnType<typeof import("@/lib/data").getWorkOrderDetail>
>;

interface OrderDetailClientProps {
  order: FullWorkOrder;
  allUsers: Pick<PrismaUser, "id" | "name" | "email">[];
}

const PRIORITY_OPTIONS = ["LOW", "MED", "HIGH"];
const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "CLOSED"];

export default function OrderDetailClient({
  order: initialOrder,
  allUsers,
}: OrderDetailClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [isPending, startTransition] = useTransition();
  const [localizedCreatedAt, setLocalizedCreatedAt] = useState(
    new Date(initialOrder.createdAt).toISOString()
  );

  useEffect(() => {
    const date = new Date(initialOrder.createdAt);
    setLocalizedCreatedAt(date.toLocaleString());
  }, [initialOrder.createdAt]);

  // const [allUsers, setAllUsers] = useState<Pick<PrismaUser, 'id' | 'name' | 'email'>[]>([]);

  const currentUserId = session?.user?.id;
  const isManager = session?.user?.role === "MANAGER";

  const canEditGeneral =
    isManager || currentUserId === initialOrder.createdById;

  //console.log("orders", order)

  // useEffect(() => {
  //     if (isManager) {
  //         getAllUsers().then(setAllUsers).catch(e => console.error("Failed to fetch users:", e));
  //     }
  // }, [isManager]);

  const handleUpdate = async (
    field: keyof FullWorkOrder,
    newValue: string | null
  ) => {
    const oldValue = order[field];
    setOrder((prev: any) => ({ ...prev, [field]: newValue }));

    startTransition(async () => {
      try {
        if (field === "assignedToId") {
          await updateWorkOrderField(order.id, field, newValue);
        } else {
          await updateWorkOrderField(order.id, field, newValue);
        }
      } catch (error: any) {
        console.error("Update failed:", error.message);
        setOrder((prev: any) => ({ ...prev, [field]: oldValue }));
        alert(`Update failed: ${error.message}. State reverted.`);
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldDisplay
          label="Title"
          value={order.title}
          field="title"
          isEditable={canEditGeneral}
          onSave={handleUpdate}
          inputType="text"
        />

        <FieldDisplay
          label="Priority"
          value={order.priority}
          field="priority"
          isEditable={canEditGeneral}
          onSave={handleUpdate}
          inputType="select"
          options={PRIORITY_OPTIONS}
        />

        <FieldDisplay
          label="Status"
          value={order.status}
          field="status"
          isEditable={isManager}
          onSave={handleUpdate}
          inputType="select"
          options={STATUS_OPTIONS}
        />

        {isManager ? (
          <ManagerAssigneeField
            label="Assigned To"
            order={order}
            allUsers={allUsers}
            onSave={handleUpdate}
          />
        ) : (
          <div>
            <span className="label">Assigned To</span>
            <p className="text-lg font-medium">
              {order.assignedTo?.name || "Unassigned"}
            </p>
          </div>
        )}

        <div>
          <span className="label">Created By</span>
          <p className="text-lg font-medium">
            {order.createdBy.name} ({order.createdBy.email})
          </p>
        </div>

        <div>
          <span className="label">Created At</span>
          <p className="text-lg font-medium">{localizedCreatedAt}</p>
        </div>

        <div>
          <span className="label">Updated At</span>
          <p className="text-lg font-medium">
            {new Date(order.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Description
        </h2>
        <FieldDisplay
          label=""
          value={order.description}
          field="description"
          isEditable={canEditGeneral}
          onSave={handleUpdate}
          inputType="textarea"
        />
      </div>

      {isPending && <p className="text-blue-500 mt-4">Saving changes...</p>}
    </div>
  );
}

interface AssigneeFieldProps {
  label: string;
  order: FullWorkOrder;
  allUsers: Pick<PrismaUser, "id" | "name" | "email">[];
  onSave: (field: keyof FullWorkOrder, newValue: string | null) => void;
}

function ManagerAssigneeField({
  label,
  order,
  allUsers,
  onSave,
}: AssigneeFieldProps) {
  const [currentId, setCurrentId] = useState(
    order.assignedToId || "unassigned"
  );
  const assignedName =
    allUsers.find((u) => u.id === order.assignedToId)?.name || "Unassigned";

  const handleSave = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCurrentId(value);
    onSave("assignedToId", value === "unassigned" ? null : value);
  };

  return (
    <div>
      <span className="label">{label}</span>
      <select className="input" value={currentId} onChange={handleSave}>
        <option value="unassigned">Unassigned</option>
        {allUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>
    </div>
  );
}
