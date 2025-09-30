"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type EditorProps = {
	body: string;
	onUpdate: (html: string) => void;
};

export const Editor = ({ body, onUpdate }: EditorProps) => {
	const editor = useEditor({
		editorProps: {
			attributes: {
				class: "prose bg-white focus:outline-none w-full min-h-[720px] p-7.5",
			},
		},
		extensions: [StarterKit],
		content: body,
		// Don't render immediately on the server to avoid SSR issues
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			onUpdate(editor.getHTML());
		},
	});

	return (
		<EditorContent
			className="min-h-0 w-full flex-1 overflow-y-auto"
			editor={editor}
		/>
	);
};
