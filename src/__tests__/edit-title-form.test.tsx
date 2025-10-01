// EditTitleForm.validation.test.tsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import { EditTitleForm } from "@/feature/contents/edit-title-form";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/utils/server", () => ({ revalidateContent: vi.fn() }));

const s = (n: number, ch = "あ") => ch.repeat(n);
const save = async (user: ReturnType<typeof userEvent.setup>) =>
	user.click(screen.getByRole("button", { name: /save/i }));

beforeEach(() => {
	vi.restoreAllMocks();
	global.fetch = vi.fn().mockResolvedValue({
		ok: true,
		status: 200,
		json: async () => ({}),
	});
});

afterEach(() => {
	vi.clearAllMocks();
});

const renderForm = (init = "初期タイトル") =>
	render(
		<EditTitleForm
			contentId={1}
			title={init}
			body="本文"
			onCancel={() => {}}
		/>,
	);

describe("EditTitleForm: Zod バリデーション（タイトル 1〜50文字）", () => {
	test("0文字（空）→ `タイトルを入力してください` が出る & 送信されない", async () => {
		const user = userEvent.setup();
		renderForm("元のタイトル");

		const input = screen.getByPlaceholderText("Title");
		await user.clear(input);
		await save(user);

		expect(await screen.findByText("タイトルを入力してください")).toBeVisible();
		expect(global.fetch).not.toHaveBeenCalled();
	});

	test("1文字 → エラー出ない（送信到達）", async () => {
		const user = userEvent.setup();
		renderForm("");

		const input = screen.getByPlaceholderText("Title");
		await user.clear(input);
		await user.type(input, s(1));
		await save(user);

		expect(
			screen.queryByText("タイトルを入力してください"),
		).not.toBeInTheDocument();
		expect(
			screen.queryByText("タイトルは50文字以内で入力してください"),
		).not.toBeInTheDocument();
		expect(global.fetch).toHaveBeenCalledOnce();
	});

	test("50文字 → エラー出ない（送信到達）", async () => {
		const user = userEvent.setup();
		renderForm("");

		const input = screen.getByPlaceholderText("Title");
		await user.clear(input);
		await user.type(input, s(50));
		await save(user);

		expect(
			screen.queryByText("タイトルを入力してください"),
		).not.toBeInTheDocument();
		expect(
			screen.queryByText("タイトルは50文字以内で入力してください"),
		).not.toBeInTheDocument();
		expect(global.fetch).toHaveBeenCalledOnce();
	});

	test("51文字 → `タイトルは50文字以内で入力してください` が出る & 送信されない", async () => {
		const user = userEvent.setup();
		renderForm("");

		const input = screen.getByPlaceholderText("Title");
		await user.clear(input);
		await user.type(input, s(51));
		await save(user);

		expect(
			await screen.findByText("タイトルは50文字以内で入力してください"),
		).toBeVisible();
		expect(global.fetch).not.toHaveBeenCalled();
	});
});
