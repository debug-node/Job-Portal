import { useRef, useCallback } from "react";

type AnyFunction = (...args: unknown[]) => void;

/**
 * Debounce utility function for optimizing rapid function calls
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends AnyFunction>(
	func: T,
	delay: number = 500,
): AnyFunction {
	let timeoutId: NodeJS.Timeout;

	return function (...args: unknown[]) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	};
}

/**
 * Debounce hook for React components
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced callback
 */
export function useDebouncedCallback<T extends AnyFunction>(
	callback: T,
	delay: number = 500,
): AnyFunction {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	return useCallback(
		(...args: unknown[]) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[callback, delay],
	);
}
