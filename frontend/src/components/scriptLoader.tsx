// https://checkout.razorpay.com/v1/checkout.js
"use client";
import { useEffect, useState, useRef } from "react";

interface RazorpayConstructor {
	new (options: unknown): { open: () => void };
}

declare global {
	interface Window {
		Razorpay?: RazorpayConstructor;
	}
}

const useRazorpay = () => {
	const [loaded, setLoaded] = useState(() => {
		// Initialize state based on whether Razorpay is already loaded
		if (typeof window !== "undefined" && window.Razorpay) {
			return true;
		}
		return false;
	});
	const [error, setError] = useState<string | null>(null);
	const scriptRef = useRef<boolean>(false);

	useEffect(() => {
		// If already loaded, skip
		if (loaded) {
			return;
		}

		// If script already being loaded, skip
		if (scriptRef.current) {
			return;
		}

		scriptRef.current = true;

		// Load the script
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.async = true;

		script.onload = () => {
			setLoaded(true);
			setError(null);
		};

		script.onerror = () => {
			const errorMsg = "❌ Failed to load Razorpay script";
			setError(errorMsg);
			console.error(errorMsg);
			scriptRef.current = false; // Reset so it can retry
			document.body.removeChild(script); // ✅ Clean up failed script from DOM
		};

		document.body.appendChild(script);
	}, [loaded]);

	return { loaded, error };
};

export default useRazorpay;
