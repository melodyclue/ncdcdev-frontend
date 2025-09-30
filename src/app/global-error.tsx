"use client";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html lang="ja">
			<body>
				<h2>問題が発生しました</h2>
				<button type="button" onClick={() => reset()}>
					画面を更新する
				</button>
			</body>
		</html>
	);
}
