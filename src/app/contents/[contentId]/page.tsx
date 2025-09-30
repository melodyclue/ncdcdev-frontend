import { notFound } from "next/navigation";
import { EditBodyBlock } from "@/feature/contents/edit-body-form";
import { EditTitleBlock } from "@/feature/contents/edit-title-form";
import type { ContentType } from "@/utils/type";

type ContentPageProps = {
	params: Promise<{
		contentId: number;
	}>;
};
export default async function ContentPage({ params }: ContentPageProps) {
	const { contentId } = await params;

	const getContent = async () => {
		try {
			const content = await fetch(`http://localhost:3000/content/${contentId}`);
			if (!content.ok) {
				return notFound();
			}
			return content.json() as Promise<ContentType>;
		} catch (_error) {
			return notFound();
		}
	};
	const contentData = await getContent();

	return (
		<div className="flex h-full flex-col px-10 py-7.5">
			<div className="flex h-full flex-col rounded-lg bg-light-background">
				<div className="flex h-full flex-col gap-5 p-7.5">
					<EditTitleBlock
						contentId={contentId}
						title={contentData.title}
						body={contentData.body}
					/>
					<div className="min-h-0 flex-1">
						<EditBodyBlock
							contentId={contentId}
							body={contentData.body}
							title={contentData.title}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
