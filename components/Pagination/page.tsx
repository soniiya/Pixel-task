'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function PaginationControls({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const handleNavigation = (page: number) => {
        router.push(createPageURL(page));
    };

    return (
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <p className="text-sm text-zinc-600">
                Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
                <button
                    className="btn btn-secondary btn-sm"
                    disabled={currentPage <= 1}
                    onClick={() => handleNavigation(currentPage - 1)}
                >
                    Previous
                </button>
                <button
                    className="btn btn-secondary btn-sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => handleNavigation(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}