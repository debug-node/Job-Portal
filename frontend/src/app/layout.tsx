import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/context/AppContext";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "HireHeaven | Recruiters and Job Seekers",
	description:
		"Modern job portal for recruiters and job seekers to connect, hire, and grow careers.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${spaceGrotesk.variable} font-sans antialiased`}>
				<AppProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange>
						<NavBar />
						<main>{children}</main>
					</ThemeProvider>
				</AppProvider>
			</body>
		</html>
	);
}
