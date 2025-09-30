import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/sonner";
import { Sidebar } from "@/feature/sidebar";

const _notoSansJP = Noto_Sans_JP({
	variable: "--font-noto-sans-jp",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Frontend Challenge",
	description: "Frontend Challenge",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${_notoSansJP.variable} font-noto-sans-jp`}>
				<div className="flex h-screen">
					<Sidebar />
					<main className="h-full max-h-full flex-1 pt-14 md:ml-0 md:pt-0">{children}</main>
				</div>
				<Toaster />
			</body>
		</html>
	);
}
