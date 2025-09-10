import React from "react";
import { useGoogleSheetAPI } from "../hooks/useGoogleSheetAPI";

export default function MySheetComponent() {
  const { data, loading } = useGoogleSheetAPI();

  if (loading) return <p>Loading...</p>;
  if (!data || data.length === 0) return <p>No data found in the sheet.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Google Sheet Data</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {Object.keys(data[0]).map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 border border-gray-300 text-left text-sm font-semibold text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {Object.values(row).map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 border border-gray-300 text-sm text-gray-600"
                  >
                    {value || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
