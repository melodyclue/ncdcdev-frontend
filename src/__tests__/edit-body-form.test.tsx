import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import { EditBodyForm } from "@/feature/contents/edit-body-form";

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

const renderForm = (init = "初期本文") =>
	render(
		<EditBodyForm
			contentId={1}
			body={init}
			title="タイトル"
			onCancel={() => {}}
		/>,
	);

describe("EditBodyForm: Zod バリデーション（本文 10〜2000文字）", () => {
	test("9文字（不足）→ `詳細は10文字以上で入力してください` が出る & 送信されない", async () => {
		const user = userEvent.setup();
		renderForm("");

		const textarea = screen.getByRole("textbox");
		await user.clear(textarea);
		await user.type(textarea, s(9));
		await save(user);

		expect(
			await screen.findByText("詳細は10文字以上で入力してください"),
		).toBeVisible();
		expect(global.fetch).not.toHaveBeenCalled();
	});

	test("10文字 → エラー出ない（送信到達）", async () => {
		const user = userEvent.setup();
		renderForm("");

		const textarea = screen.getByRole("textbox");
		await user.clear(textarea);
		await user.type(textarea, s(10));
		await save(user);

		expect(
			screen.queryByText("詳細は10文字以上で入力してください"),
		).not.toBeInTheDocument();
		expect(
			screen.queryByText("詳細は2000文字以内で入力してください"),
		).not.toBeInTheDocument();
		expect(global.fetch).toHaveBeenCalledOnce();
	});

	test("2000文字 → エラー出ない（送信到達）", async () => {
		const user = userEvent.setup();
		renderForm("");

		const textarea = screen.getByRole("textbox");
		await user.clear(textarea);
		await user.type(textarea, s(2000));
		await save(user);

		expect(
			screen.queryByText("詳細は10文字以上で入力してください"),
		).not.toBeInTheDocument();
		expect(
			screen.queryByText("詳細は2000文字以内で入力してください"),
		).not.toBeInTheDocument();
		expect(global.fetch).toHaveBeenCalledOnce();
	});

	test("2001文字 → `詳細は2000文字以内で入力してください` が出る & 送信されない", async () => {
		const user = userEvent.setup();
		renderForm("");

		const textarea = screen.getByRole("textbox");
		await user.clear(textarea);
		await user.type(textarea, s(2001));
		await save(user);

		expect(
			await screen.findByText("詳細は2000文字以内で入力してください"),
		).toBeVisible();
		expect(global.fetch).not.toHaveBeenCalled();
	});
});
