import { exportExpenses } from "../../api/api.js";
import { useExpenses } from "../context/ExpenseContext.jsx";
import { useState } from "react";
export function downloadFile(blob, filename) {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
const ExportButtons = () => {
  const { token } = useExpenses();
  const [loading, setLoading] = useState(false);

  const handleExport = async (format) => {
    try {
      setLoading(true);
      const res = await exportExpenses(format, token);

      const contentDisposition = res.headers["content-disposition"];
      const filename =
        contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
        `expenses.${format}`;

      downloadFile(res.data, filename);
    } catch (err) {
      console.error("Export failed", err);
      alert("Export failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-x-3 mt-6">
      <button
        onClick={() => handleExport("csv")}
        className="bg-blue-500 text-white px-4 py-2 rounded-2xl cursor-pointer hover:bg-blue-600"
        disabled={loading}
      >
        Export CSV
      </button>
      <button
        onClick={() => handleExport("json")}
        className="bg-emerald-500 text-white px-4 py-2 rounded-2xl  cursor-pointer hover:bg-green-600"
        disabled={loading}
      >
        Export JSON
      </button>
      <button
        onClick={() => handleExport("xlsx")}
        className="bg-purple-500 text-white px-4 py-2 rounded-2xl  cursor-pointer hover:bg-purple-600"
        disabled={loading}
      >
        Export XLSX
      </button>
    </div>
  );
};

export default ExportButtons;
