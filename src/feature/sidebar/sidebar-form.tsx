"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { cn } from "@/utils/cn";
import { revalidateContent, revalidateContentList } from "@/utils/server";
import type { ContentType } from "@/utils/type";

export const SidebarForm = ({ contents }: { contents: ContentType[] }) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const deleteContent = async (id: number) => {
		try {
			await fetch(`http://localhost:3000/content/${id}`, {
				method: "DELETE",
			});

			router.replace(`/`);
			await revalidateContent(id);
			toast.success("コンテンツの削除に成功しました");
		} catch (error) {
			console.error("Form submission failed:", error);
			toast.error("コンテンツの削除に失敗しました");
		}
	};

	const addContent = async (title: string) => {
		try {
			const response = await fetch(`http://localhost:3000/content`, {
				method: "POST",
				body: JSON.stringify({ title, body: "" }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const content = (await response.json()) as ContentType;

			await revalidateContentList();
			setIsEditing(false);
			router.replace(`/contents/${content.id}`);
			toast.success("コンテンツの追加に成功しました");
		} catch (error) {
			console.error("Form submission failed:", error);
			toast.error("コンテンツの追加に失敗しました");
		}
	};

	return (
		<>
			<header className="fixed top-0 right-0 left-0 z-30 flex h-14 items-center justify-between bg-white px-4 shadow-sm md:hidden">
				<div className="flex items-center gap-2">
					<Image
						src="/icon/logo.svg"
						alt="Service Name"
						width={24}
						height={24}
					/>
					<h1 className="font-semibold text-lg">Service Name</h1>
				</div>

				<button
					type="button"
					onClick={() => setIsSidebarOpen(true)}
					className="rounded-lg p-2 transition-colors hover:bg-light-background"
					aria-label="Toggle menu"
				>
					<Image src="/icon/menu.svg" alt="Menu" width={24} height={24} />
				</button>
			</header>

			{isSidebarOpen && (
				<button
					type="button"
					className="fixed inset-0 z-40 bg-zinc-500/50 bg-opacity-50 md:hidden"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}
			<div
				className={cn(
					"fixed top-0 left-0 z-50 flex h-full w-[280px] transform flex-col border-border border-r transition-transform duration-300 ease-in-out md:relative md:top-0 md:z-auto md:h-screen md:translate-x-0",
					isSidebarOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				<div className="flex-1 overflow-y-auto bg-white pt-7.5 pl-10">
					<div className="flex items-center gap-2">
						<Image
							src="/icon/logo.svg"
							alt="Service Name"
							width={32}
							height={32}
						/>
						<h1 className="font-semibold text-2xl">Service Name</h1>
					</div>
					<nav className="mt-5 md:mt-5">
						{contents.map((content) => {
							if (isEditing)
								return (
									<div
										key={content.id}
										className="flex items-center gap-2.5 px-2.5 py-2.5 transition-colors hover:bg-light-background"
									>
										<span className="line-clamp-2 w-full">{content.title}</span>
										<button
											className="cursor-pointer"
											type="button"
											onClick={() => deleteContent(content.id)}
										>
											<Image
												src="/icon/delete.svg"
												alt="Done"
												width={20}
												height={20}
											/>
										</button>
									</div>
								);

							return (
								<Link
									href={`/contents/${content.id}`}
									key={content.id}
									className="block px-2.5 py-2.5 transition-colors hover:bg-light-background"
								>
									<span className="line-clamp-2">{content.title}</span>
								</Link>
							);
						})}
					</nav>
				</div>

				<div className="flex justify-end bg-light-background p-2.5">
					{isEditing ? (
						<div className="flex w-full justify-between gap-2 pl-7.5">
							<Button
								icon="+"
								text="New"
								size="wide"
								variant="outline"
								onClick={() => addContent("Untitled")}
							/>
							<Button
								icon="done"
								text="Done"
								size="wide"
								onClick={() => setIsEditing(false)}
							/>
						</div>
					) : (
						<Button
							icon="edit"
							text="Edit"
							size="wide"
							onClick={() => setIsEditing(true)}
						/>
					)}
				</div>
			</div>
		</>
	);
};
