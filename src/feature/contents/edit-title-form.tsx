"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { revalidateContent } from "@/utils/server";
import type { EditContentType } from "@/utils/type";
import { editTitleSchema } from "@/utils/validation";

export const EditTitleBlock = ({ contentId, title, body }: EditContentType) => {
	const [isEditing, setIsEditing] = useState(false);

	if (isEditing) {
		return (
			<EditTitleForm
				contentId={contentId}
				title={title}
				body={body}
				onCancel={() => setIsEditing(false)}
			/>
		);
	}

	return (
		<div className="flex items-stretch gap-5">
			<div className="flex-1 break-all rounded-lg border border-transparent px-4 font-bold text-xl leading-9.5 md:px-7.5 md:text-2xl">
				{title}
			</div>
			<Button
				icon="edit"
				text="Edit"
				size="wide"
				onClick={() => setIsEditing(true)}
			/>
		</div>
	);
};

export const EditTitleForm = ({
	contentId,
	title,
	body,
	onCancel,
}: EditContentType & { onCancel: () => void }) => {
	const form = useForm({
		defaultValues: {
			title: title,
		},
		validators: {
			onSubmit: editTitleSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const response = await fetch(
					`http://localhost:3000/content/${contentId}`,
					{
						method: "PUT",
						body: JSON.stringify({ title: value.title, body }),
						headers: {
							"Content-Type": "application/json",
						},
					},
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				toast.success("タイトルの更新に成功しました");
				await revalidateContent(contentId);
				onCancel();
			} catch (error) {
				console.error("Form submission failed:", error);
				toast.error("タイトルの更新に失敗しました");
			}
		},
	});

	return (
		<form
			className="flex gap-5"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.Field
				name="title"
				children={(field) => (
					<div className="flex w-full flex-col items-stretch">
						<input
							type="text"
							placeholder="Title"
							value={field.state.value}
							id={field.name}
							name={field.name}
							onChange={(e) => field.handleChange(e.target.value)}
							className="w-full rounded-lg border border-primary bg-white px-4 py-0.75 font-bold text-xl focus:outline-none md:px-7.5 md:text-2xl"
						/>
						{field.state.meta.errors.length > 0 && (
							<div className="mt-2">
								{field.state.meta.errors?.map((error) => (
									<p key={error?.message} className="text-rose-500 text-sm">
										{error?.message}
									</p>
								))}
							</div>
						)}
					</div>
				)}
			/>

			<div className="flex gap-2.5">
				<form.Subscribe
					selector={(state) => [state.isSubmitting]}
					children={([isSubmitting]) => (
						<>
							<Button
								type="button"
								icon="cancel"
								text="Cancel"
								size="square"
								variant="muted"
								onClick={onCancel}
								disabled={isSubmitting}
							/>
							<Button
								type="submit"
								icon="save"
								text="Save"
								size="square"
								variant="default"
								disabled={isSubmitting}
							/>
						</>
					)}
				/>
			</div>
		</form>
	);
};
