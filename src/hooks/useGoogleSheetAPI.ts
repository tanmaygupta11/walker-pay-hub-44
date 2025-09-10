import { useEffect, useState } from "react";

type RowObject = Record<string, string>;

type Options = {
  sheet?: string;
  range?: string;
};

export function useGoogleSheetAPI(options: Options = {}) {
  const [data, setData] = useState<RowObject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = (import.meta as any)?.env?.VITE_SHEETS_WEB_APP_URL as string;

    const fetchData = async () => {
      try {
        if (!url) throw new Error("VITE_SHEETS_WEB_APP_URL is not set");
        const query = new URLSearchParams();
        if (options.sheet) query.set("sheet", options.sheet);
        if (options.range) query.set("range", options.range);
        const fullUrl = query.toString() ? `${url}?${query.toString()}` : url;

        const res = await fetch(fullUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json(); // expects { values: string[][] }

        const values: string[][] = Array.isArray(json?.values) ? json.values : [];
        if (!values.length) {
          setData([]);
          return;
        }

        const [headers, ...rows] = values;
        const headerKeys = headers.map((h) => String(h || "").trim());
        const objects: RowObject[] = rows.map((row) => {
          const obj: RowObject = {};
          headerKeys.forEach((key, i) => {
            obj[key || `col_${i + 1}`] = row[i] ?? "";
          });
          return obj;
        });
        setData(objects);
      } catch (err) {
        console.error("Error fetching sheet:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options.sheet, options.range]);

  return { data, loading };
}