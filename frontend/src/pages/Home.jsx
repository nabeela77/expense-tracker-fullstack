// import { useState, useMemo } from "react";
// import ExpenseForm from "../components/ExpenseForm";
// import ExpenseList from "../components/ExpenseList";
// import ExpenseSummary from "../components/ExpenseSummary";

// //filtring with category or date
// //sort by date or amount
// //update button, delete button
// //notifications

// const Home = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [formValues, setFormValues] = useState([]);
//   const [filter, setFilter] = useState([]);

//   return (
//     <div>
//       {!showForm && (
//         <button onClick={() => setShowForm(true)}>Add Expense</button>
//       )}
//       {showForm && (
//         <ExpenseForm setFormValues={setFormValues} formValues={formValues} />
//       )}

//       <ExpenseList formValues={formValues} setFormValues={setFormValues} />
//       {formValues.length > 0 && <ExpenseSummary formValues={formValues} />}
//     </div>
//   );
// };

// export default Home;
import { useState, useMemo, useEffect } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseSummary from "../components/ExpenseSummary";
import Filters from "../components/Filters";
import {
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
} from "../../api/api.js";

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState([]);

  // 🔼 Filters & sorting state (shared across Summary + List)
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const [expenses, summary] = await Promise.all([
          getExpense(),
          getSummary(),
        ]);
        setFormValues(expenses);
        setSummaryData(summary);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    }

    fetchExpenses();
  }, []);

  // useEffect(() => {
  //   async function fetchExpenses() {
  //     console.log("Starting to fetch expenses and summary..."); // start
  //     try {
  //       const [expenses, summary] = await Promise.all([
  //         getExpense(),
  //         getSummary(),
  //       ]);
  //       console.log("Expenses fetched:", expenses); // log expenses
  //       console.log("Summary fetched:", summary); // log summary
  //       setFormValues(expenses);
  //       setSummaryData(summary);
  //       console.log("State updated with fetched data."); // after state set
  //     } catch (err) {
  //       console.error("Failed to fetch data:", err);
  //     }
  //   }

  //   fetchExpenses();
  // }, []);

  // CREATE
  // const handleCreate = async (expenseData) => {
  //   try {
  //     const newExpense = await createExpense(expenseData);
  //     setFormValues((prev) => [...prev, newExpense]);
  //   } catch (err) {
  //     console.error("Error creating expense:", err);
  //   }
  // };
  const handleCreate = async (expenseData) => {
    try {
      const newExpense = await createExpense(expenseData);
      setFormValues((prev) => [...prev, newExpense]);
    } catch (err) {
      console.error("Create error:", err.response?.data || err.message);
      throw err;
    }
  };

  // UPDATE
  const handleUpdate = async (id, updatedData) => {
    try {
      await updateExpense(id, updatedData);
      await fetchAll();
    } catch (err) {
      console.error("Error updating expense:", err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      await fetchAll();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  // 🔁 Apply filters and sorting
  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = formValues.filter((expense) => {
      if (categoryFilter !== "all" && expense.category !== categoryFilter) {
        return false;
      }
      if (startDate && expense.date < startDate) return false;
      if (endDate && expense.date > endDate) return false;
      return true;
    });

    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else {
        return sortOrder === "asc"
          ? Number(a.amount) - Number(b.amount)
          : Number(b.amount) - Number(a.amount);
      }
    });

    return filtered;
  }, [formValues, categoryFilter, startDate, endDate, sortBy, sortOrder]);

  return (
    <div>
      <div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-400 hover:bg-purple-500 cursor-pointer text-white font-semibold py-2 px-4 rounded-4xl mb-[2rem]"
          >
            Add Expense
          </button>
        )}
        {showForm && (
          <ExpenseForm onSubmit={handleCreate} setShowForm={setShowForm} />
        )}

        <Filters
          formValues={formValues}
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
          className="w-full"
        />
      </div>

      <div
        className="
          flex
          gap-8
          flex-1
          overflow-auto"
      >
        <ExpenseList
          formValues={filteredAndSortedExpenses}
          setFormValues={setFormValues}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        {/* 📤 Pass shared state + data to both components */}
        <ExpenseSummary formValues={filteredAndSortedExpenses} />
      </div>
    </div>
  );
};

export default Home;
