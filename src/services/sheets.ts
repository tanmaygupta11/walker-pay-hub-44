// Google Sheets Web App client supporting multiple sheets in a workbook
// Configure the Web App URL via VITE_SHEETS_WEB_APP_URL in your .env

const BASE_URL = (import.meta as any)?.env?.VITE_SHEETS_WEB_APP_URL || "";

function requireBaseUrl(): string {
	if (!BASE_URL) {
		throw new Error("VITE_SHEETS_WEB_APP_URL is not set");
	}
	return BASE_URL;
}

export type CellValues = string[][];

export async function listSheets(): Promise<{ sheets: string[] }> {
	const url = `${requireBaseUrl()}?meta=1`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to list sheets: ${res.status}`);
	return res.json();
}

export async function readSheet(options: { sheet: string; range?: string }): Promise<{ values: CellValues }> {
	const { sheet, range = "A1:E50" } = options;
	const qs = new URLSearchParams({ sheet, range });
	const url = `${requireBaseUrl()}?${qs.toString()}`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to read sheet: ${res.status}`);
	return res.json();
}

export async function appendRows(options: { sheet: string; values: CellValues }): Promise<{ ok?: boolean; inserted?: number; error?: string }> {
	const { sheet, values } = options;
	const res = await fetch(requireBaseUrl(), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ sheet, values }),
	});
	if (!res.ok) throw new Error(`Failed to append rows: ${res.status}`);
	return res.json();
}













