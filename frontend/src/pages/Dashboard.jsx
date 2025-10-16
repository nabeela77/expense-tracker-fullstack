// import { useState } from "react";
// import ExpenseForm from "../components/ExpenseForm";
// import ExpenseList from "../components/ExpenseList";
// import ExpenseSummary from "../components/ExpenseSummary";
// import Filters from "../components/Filters";
// import { useExpenses } from "../context/ExpenseContext";

// const Dashboard = () => {
//   const [showForm, setShowForm] = useState(false);
//   const {
//     categories,
//     filteredAndSortedExpenses,
//     setFormValues,
//     handleCreate,
//     handleUpdate,
//     handleDelete,
//     categoryFilter,
//     setCategoryFilter,
//     startDate,
//     setStartDate,
//     endDate,
//     setEndDate,
//     sortBy,
//     setSortBy,
//     sortOrder,
//     setSortOrder,
//     loading,
//     error,
//   } = useExpenses();

//   // if (loading) return <div>Loading expenses...</div>;
//   // if (error) return <div>{error}</div>;
//   // if (filteredAndSortedExpenses.length === 0)
//   //   return <div>No expenses found.</div>;

//   return (
//     <div>
//       <div className=" flex flex-col items-center gap-6">
//         {!showForm && (
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-purple-400 hover:bg-purple-500 shadow-md border border-purple-500 cursor-pointer  text-white font-semibold justify-center h-[4rem] px-20 rounded-4xl mb-[2rem]"
//           >
//             Add Expense
//           </button>
//         )}
//         {showForm && (
//           <ExpenseForm
//             onSubmit={handleCreate}
//             setShowForm={setShowForm}
//             categories={categories}
//           />
//         )}
//       </div>
//       <div className="w-full max-w-[90%]">
//         <Filters
//           formValues={filteredAndSortedExpenses}
//           categoryFilter={categoryFilter}
//           setCategoryFilter={setCategoryFilter}
//           startDate={startDate}
//           setStartDate={setStartDate}
//           endDate={endDate}
//           setEndDate={setEndDate}
//           sortBy={sortBy}
//           setSortBy={setSortBy}
//           sortOrder={sortOrder}
//           setSortOrder={setSortOrder}
//         />
//       </div>

//       <div className="flex w-full max-w-[90%] gap-8 justify-between">
//         <ExpenseList
//           formValues={filteredAndSortedExpenses}
//           setFormValues={setFormValues}
//           onUpdate={handleUpdate}
//           onDelete={handleDelete}
//           categories={categories}
//         />
//         <div className="w-[30%]">
//           <ExpenseSummary formValues={filteredAndSortedExpenses} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseSummary from "../components/ExpenseSummary";
import Filters from "../components/Filters";
import { useExpenses } from "../context/ExpenseContext";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
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
      <div className="flex flex-col items-center gap-6">
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
