export type ContentType = {
	id: number;
	title: string;
	body: string;
	createdAt: string;
	updatedAt: string;
};

export type EditContentType = {
	contentId: number;
} & Pick<ContentType, "title" | "body">;
