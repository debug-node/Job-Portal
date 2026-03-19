import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
	isLoading = false,
}) => {
	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
			// Scroll to top for better UX
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const pages = [];
	const maxVisible = 5;
	let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
	const endPage = Math.min(totalPages, startPage + maxVisible - 1);

	if (endPage - startPage < maxVisible - 1) {
		startPage = Math.max(1, endPage - maxVisible + 1);
	}

	if (startPage > 1) {
		pages.push(1);
		if (startPage > 2) pages.push(null); // ellipsis
	}

	for (let i = startPage; i <= endPage; i++) {
		pages.push(i);
	}

	if (endPage < totalPages) {
		if (endPage < totalPages - 1) pages.push(null); // ellipsis
		pages.push(totalPages);
	}

	return (
		<div className="flex items-center justify-center gap-2 mt-8">
			<Button
				variant="outline"
				size="sm"
				onClick={handlePrevious}
				disabled={currentPage === 1 || isLoading}
				className="gap-2">
				<ChevronLeft size={18} />
				Previous
			</Button>

			<div className="flex gap-1">
				{pages.map((page, idx) =>
					page === null ? (
						<span key={`ellipsis-${idx}`} className="px-2 py-2">
							...
						</span>
					) : (
						<Button
							key={page}
							variant={currentPage === page ? "default" : "outline"}
							size="sm"
							onClick={() => {
								onPageChange(page);
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}
							disabled={isLoading}
							className="h-8 w-8 p-0">
							{page}
						</Button>
					),
				)}
			</div>

			<Button
				variant="outline"
				size="sm"
				onClick={handleNext}
				disabled={currentPage === totalPages || isLoading}
				className="gap-2">
				Next
				<ChevronRight size={18} />
			</Button>

			<span className="text-sm text-gray-600 dark:text-gray-400 ml-4">
				Page {currentPage} of {totalPages}
			</span>
		</div>
	);
};
