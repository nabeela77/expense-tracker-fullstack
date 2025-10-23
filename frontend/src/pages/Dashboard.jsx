import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseSummary from "../components/ExpenseSummary";
import Filters from "../components/Filters";
import { useExpenses } from "../context/ExpenseContext";
import ExportButtons from "../components/DownloadFile";
import { importExpenses } from "../../api/api.js";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const navigate = useNavigate();

  const {
    token,
    categories,
    filteredAndSortedExpenses,
    setFormValues,
    handleCreate,
    handleUpdate,
    handleDelete,
    categoryFilter,
    setCategoryFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    loading,
    error,
  } = useExpenses();

  // 🔒 Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleFileChange = (e) => {
    setImportFile(e.target.files[0]);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!importFile) return alert("Please select a file to upload");

    try {
      setImporting(true);
      const result = await importExpenses(importFile);
      alert(`Imported: ${result.imported}, Skipped: ${result.skipped}`);
      setImportFile(null); // reset input
    } catch (err) {
      alert("Failed to import expenses. Check console for details.");
      console.error(err);
    } finally {
      setImporting(false);
    }
  };

  // 🌀 Loading + error + empty states
  if (loading)
    return <div className="text-center mt-10 text-lg">Loading expenses...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (filteredAndSortedExpenses.length === 0)
    return (
      <div className="text-center mt-10 text-gray-500">No expenses found.</div>
    );

  return (
    <div>
      <ExportButtons />
      <form onSubmit={handleImport} method="POST" encType="multipart/form-data">
        <label>
          Upload File:{"  "}
          <input
            className="  bg-purple-50 my-10 cursor-pointer  mr-10 rounded-2xl border-gray-200 text-purple-600 "
            type="file"
            name="uploadFile"
            onChange={handleFileChange}
            accept=".csv,.json,.xlsx"
          />
        </label>
        <button
          className="bg-purple-400 text-white px-4 py-2 rounded-2xl  cursor-pointer hover:bg-purple-500"
          type="submit"
          disabled={importing}
        >
          Upload
        </button>
      </form>
      <div className="flex flex-col mt-10 items-center gap-6">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-400 hover:bg-purple-500 shadow-md border border-purple-500 cursor-pointer text-white font-semibold justify-center h-[4rem] px-20 rounded-4xl mb-[2rem]"
          >
            Add Expense
          </button>
        )}
        {showForm && (
          <ExpenseForm
            onSubmit={handleCreate}
            setShowForm={setShowForm}
            categories={categories}
          />
        )}
      </div>

      <div className="w-full max-w-[90%]">
        <Filters
          formValues={filteredAndSortedExpenses}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      </div>

      <div className="flex w-full max-w-[90%] gap-8 justify-between">
        <ExpenseList
          formValues={filteredAndSortedExpenses}
          setFormValues={setFormValues}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          categories={categories}
        />
        <div className="w-[30%]">
          <ExpenseSummary formValues={filteredAndSortedExpenses} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
