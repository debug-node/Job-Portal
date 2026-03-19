import React, { Suspense, ReactNode } from "react";

/**
 * Simple skeleton loader for async components
 */
export function ComponentSkeleton() {
	return (
		<div className="flex items-center justify-center w-full h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg">
			<div className="text-gray-400">Loading...</div>
		</div>
	);
}

/**
 * HOC for wrapping components with Suspense
 * @param Component - Component to wrap
 * @param fallback - Fallback UI to show while loading
 * @returns Wrapped component with Suspense
 */
export function withSuspense<P extends object>(
	Component: React.ComponentType<P>,
	fallback: ReactNode = <ComponentSkeleton />,
) {
	return function SuspenseWrappedComponent(props: P) {
		return (
			<Suspense fallback={fallback}>
				<Component {...props} />
			</Suspense>
		);
	};
}

/**
 * Example usage for lazy loading modals:
 * const LazyCareerGuide = React.lazy(() => import('@/components/career-guide'))
 * Then wrap with: <Suspense fallback={<ComponentSkeleton />}><LazyCareerGuide /></Suspense>
 */
