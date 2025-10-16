import { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getCategories,
  getSummary,
} from "../../api/api.js";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [formValues, setFormValues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ADD loading state
  const [error, setError] = useState(null); // ADD error state

  // Fetch categories when token changes
  useEffect(() => {
    if (!token) {
      setCategories([]);
      return;
    }

    const fetchCategories = async () => {
      try {
        const data = await getCategories(token);
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, [token]);

  // Fetch expenses + summary when token changes
  const fetchAll = async (authToken = token) => {
    if (!authToken) {
      setFormValues([]); // Clear expenses if no token
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [expenseData] = await Promise.all([
        getExpense(authToken),
        getSummary(authToken),
      ]);

      const expenses = expenseData.expenses ?? expenseData;
      setFormValues(expenses);
      return expenses;
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setError("Failed to load expenses");
      setFormValues([]);
    } finally {
      setLoading(false);
    }
  };

  // Run fetchAll whenever token changes (e.g., login/logout)
  useEffect(() => {
    fetchAll();
  }, [token]);

  // Login function to update token
  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    const fetchedExpenses = await fetchAll(newToken);
    console.log("Fetched expenses after login:", fetchedExpenses);

    return fetchedExpenses; // Important for post-login behavior
  };

  useEffect(() => {
    console.log("formValues updated:", formValues);
  }, [formValues]);

  // Logout clears token and data
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setFormValues([]);
    setCategories([]);
  };

  // CRUD handlers updated to use token
  const handleCreate = async (expenseData) => {
    if (!token) throw new Error("Not authenticated");
    try {
      const newExpense = await createExpense(expenseData, token);
      setFormValues((prev) => [...prev, newExpense]);
    } catch (err) {
      console.error("Create error:", err);
      throw err;
    }
  };

  const handleUpdate = async (id, updatedData) => {
    if (!token) throw new Error("Not authenticated");
    try {
      await updateExpense(id, updatedData, token);
      await fetchAll();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!token) throw new Error("Not authenticated");
    try {
      await deleteExpense(id, token);
      await fetchAll();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Filter + sort logic
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
    <ExpenseContext.Provider
      value={{
        token,
        login,
        logout,
        formValues,
        setFormValues,
        categories,
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
        filteredAndSortedExpenses,
        handleCreate,
        handleUpdate,
        handleDelete,
        fetchAll,
        loading,
        error,
        email,
        setEmail,
        password,
        setPassword,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context)
    throw new Error("useExpenses must be used within ExpenseProvider");
  return context;
};
