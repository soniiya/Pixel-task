'use client';

import { createWorkOrder } from '@/lib/action';
import { useActionState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

const initialState = { message: '', errors: { title: [], description: [], priority: [] } };

export default function NewOrderPage() {
    const [state, formAction] = useActionState(createWorkOrder, initialState);
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter()

    useEffect(() => {
        if (state.success && state.orderId) {
            formRef.current?.reset();
            router.push(`/orders/${state.orderId}`);
        }
    }, [state.success, state.orderId, router]);

    return (
        <div className="max-w-xl mx-auto card mt-10">
            <h1 className="text-xl font-semibold mb-6">Create New Work Order</h1>
            
            {state?.message && state.message !== "Failed to validate fields." && (
                <p className="text-green-600 mb-4">{state.message}</p>
            )}

            <form action={formAction} className="space-y-4">
                <div>
                    <label className="label" htmlFor="title">Title</label>
                    <input className="input" id="title" name="title" required />
                    {state?.errors?.title && state.errors.title.map((err, i) => (
                        <p key={i} className="text-red-500 text-sm mt-1">{err}</p>
                    ))}
                </div>

                <div>
                    <label className="label" htmlFor="description">Description</label>
                    <textarea className="input" id="description" name="description" rows={3} required />
                    {state?.errors?.description && state.errors.description.map((err, i) => (
                        <p key={i} className="text-red-500 text-sm mt-1">{err}</p>
                    ))}
                </div>

                <div>
                    <label className="label" htmlFor="priority">Priority</label>
                    <select className="input" id="priority" name="priority" defaultValue="MED" required>
                        <option value="LOW">Low</option>
                        <option value="MED">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                    {state?.errors?.priority && state.errors.priority.map((err, i) => (
                        <p key={i} className="text-red-500 text-sm mt-1">{err}</p>
                    ))}
                </div>

                <SubmitButton />
            </form>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button 
            type="submit" 
            className="btn btn-primary w-full" 
            disabled={pending}
        >
            {pending ? 'Submitting...' : 'Create Order'}
        </button>
    );
}