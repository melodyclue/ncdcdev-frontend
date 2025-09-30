"use client";

import { useForm } from "@tanstack/react-form";
import parse from "html-react-parser";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { Editor } from "@/components/editor";
import { revalidateContent } from "@/utils/server";
import type { EditContentType } from "@/utils/type";
import { editBodySchema } from "@/utils/validation";

export const EditBodyBlock = ({ contentId, body, title }: EditContentType) => {
	const [isEditing, setIsEditing] = useState(false);

	if (isEditing) {
		return (
			<EditBodyForm
				contentId={contentId}
				body={body}
				title={title}
				onCancel={() => setIsEditing(false)}
			/>
		);
	}

	return (
		<div className="flex h-full flex-1 gap-2">
			<div className="prose min-h-0 flex-1 overflow-y-auto bg-white p-7.5">
				{parse(body)}
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

export const EditBodyForm = ({
	contentId,
	body,
	title,
	onCancel,
}: EditContentType & { onCancel: () => void }) => {
	const form = useForm({
		defaultValues: {
			body: body,
		},
		validators: {
			onSubmit: editBodySchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const response = await fetch(
					`http://localhost:3000/content/${contentId}`,
					{
						method: "PUT",
						body: JSON.stringify({ title: title, body: value.body }),
						headers: {
							"Content-Type": "application/json",
						},
					},
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				toast.success("詳細の更新に成功しました");
				await revalidateContent(contentId);
				onCancel();
			} catch (error) {
				console.error("Form submission failed:", error);
				toast.error("詳細の更新に失敗しました");
			}
		},
	});

	return (
		<form
			className="flex h-full w-full gap-2"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.Field
				name="body"
				children={(field) => (
					<div className="flex h-full w-full flex-col gap-2">
						{field.state.meta.errors.length > 0 && (
							<div>
								{field.state.meta.errors?.map((error) => (
									<p key={error?.message} className="text-rose-500 text-sm">
										{error?.message}
									</p>
								))}
							</div>
						)}
						<Editor body={field.state.value} onUpdate={field.handleChange} />
					</div>
				)}
			/>

			<div className="flex gap-2">
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
