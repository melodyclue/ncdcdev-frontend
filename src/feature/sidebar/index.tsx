import type { ContentType } from "@/utils/type";
import { SidebarForm } from "./sidebar-form";

async function getContents() {
	const res = await fetch("http://localhost:3000/content", {
		next: {
			tags: ["list-contents"],
		},
	});
	if (!res.ok) {
		throw new Error("Failed to fetch contents");
	}
	return (await res.json()) as Promise<ContentType[]>;
}

export const Sidebar = async () => {
	const contents = await getContents();

	return <SidebarForm contents={contents} />;
};
