import React from "react";
import { BriefcaseBusiness } from "lucide-react";

const Loading = () => {
	return (
		<div className="w-full min-h-[45vh] flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center animate-pulse">
					<BriefcaseBusiness size={28} />
				</div>
				<div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
					<div className="h-full w-2/3 bg-blue-600 animate-pulse rounded-full" />
				</div>
				<p className="text-sm opacity-70">Loading your experience...</p>
			</div>
		</div>
	);
};

export default Loading;
