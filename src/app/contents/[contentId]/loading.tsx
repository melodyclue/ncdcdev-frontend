import Image from "next/image";

export default function Loading() {
	return (
		<div className="flex h-full items-center justify-center p-4 md:p-10">
			<div className="flex flex-col items-center justify-center gap-2">
				<Image
					src="/icon/loader.svg"
					alt="Loading"
					width={24}
					height={24}
					className="animate-spin"
				/>
				<h1 className="font-semibold text-secondary-foreground text-xl md:text-2xl">
					読み込み中...
				</h1>
			</div>
		</div>
	);
}
