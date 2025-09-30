import type { ContentType } from "@/utils/type";
import { SidebarForm } from "./sidebar-form";

const getContents = async () => {
	const res = await fetch("http://localhost:3000/content", {
		next: {
			tags: ["list-contents"],
		},
	});
	if (!res.ok) {
		throw new Error("Failed to fetch contents");
	}
	return (await res.json()) as ContentType[];
};

export const Sidebar = async () => {
	const contents = await getContents();

	return <SidebarForm contents={contents} />;
};
