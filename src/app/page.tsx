export default function Home() {
	return (
		<div className="flex h-full items-center justify-center p-4 md:p-10">
			<div className="text-center">
				<h1 className="font-semibold text-secondary-foreground text-xl md:text-2xl">
					コンテンツを選択してください
				</h1>
				<p className="mt-2 text-secondary-foreground text-sm md:text-base">
					サイドバーからコンテンツを選んで編集を開始できます
				</p>
			</div>
		</div>
	);
}
