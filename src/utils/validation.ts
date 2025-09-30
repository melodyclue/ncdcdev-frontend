import { z } from "zod";

export const editTitleSchema = z.object({
	title: z
		.string()
		.min(1, "タイトルを入力してください")
		.max(50, "タイトルは50文字以内で入力してください"),
});

export const editBodySchema = z.object({
	body: z
		.string()
		.min(10, "詳細は10文字以上で入力してください")
		.max(2000, "詳細は2000文字以内で入力してください"),
});
