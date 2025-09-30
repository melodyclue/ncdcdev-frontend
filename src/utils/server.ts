"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export const revalidateContent = async (contentId: number) => {
	revalidatePath(`/contents/${contentId}`);
};

export const revalidateContentList = async () => {
	revalidateTag("list-contents");
};
