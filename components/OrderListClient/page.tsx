'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Pagination from '@/components/Pagination/page'; 
import { WorkOrder } from '@/app/types/order';
import Link from 'next/link';

interface OrderListClientProps {
    initialOrders: WorkOrder[];
    totalPages: number;
    currentPage: number;
}

const STATUS_OPTIONS = ['ALL', 'OPEN', 'IN_PROGRESS', 'CLOSED'];
const PRIORITY_OPTIONS = ['ALL', 'LOW', 'MED', 'HIGH'];

export default function OrderListClient({ initialOrders, totalPages, currentPage }: OrderListClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSearch = searchParams.get('search') || '';
    const currentStatus = searchParams.get('status') || 'ALL';
    const currentPriority = searchParams.get('priority') || 'ALL';

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        
        if (value === 'ALL' || value === '') {
            params.delete(key); 
        } else {
            params.set(key, value);
        }
        
        params.delete('page');
        
        router.push(`${pathname}?${params.toString()}`);
    };
    
    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchValue = formData.get('search') as string;
        handleFilterChange('search', searchValue);
    };

    return (
        <>
            <div className="flex justify-end mb-4">
                <Link href="/orders/new" className="btn btn-primary">
                    + Create New Order
                </Link>
            </div>

            <div className="flex flex-col xs:w-1/4 sm:w-full gap-4 mb-4">
                <form onSubmit={handleSearchSubmit} className="flex-grow">
                    <input
                        className="input w-full"
                        type="text"
                        name="search"
                        placeholder="Search by title or description..."
                        defaultValue={currentSearch}
                        onBlur={(e) => handleFilterChange('search', e.target.value)} 
                    />
                </form>
                
                {/* <select
                    className="input sm:w-1/4"
                    value={currentStatus}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>)}
                </select> */}

                <select
                    className="input sm:w-1/4"
                    value={currentPriority}
                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                >
                    {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p === 'ALL' ? 'All Priorities' : p}</option>)}
                </select>
            </div>

            {initialOrders.length === 0 && <p className="text-sm text-zinc-500">No orders found matching the filters.</p>}
            
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {initialOrders.map((o) => (
                    <Link key={o.id} href={`/orders/${o.id}`} className="py-3 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition rounded-md px-2 -mx-2">
                        <div>
                            <div className="font-medium">{o.title}</div>
                            <div className="text-xs text-zinc-500">
                                Created by {o.createdBy?.email} · Assigned to {o.assignedTo?.email ?? "—"}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="badge">{o.status.toLowerCase()}</span>
                            <span className="badge">{o.priority.toLowerCase()}</span>
                        </div>
                    </Link>
                ))}
            </div>
            
            {totalPages > 1 && (
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                />
            )}
        </>
    );
}