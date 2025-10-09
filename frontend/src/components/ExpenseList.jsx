import React, { useState } from "react";
import { updateExpense, deleteExpense } from "../../api/api.js";

const ExpenseList = ({ formValues, setFormValues, categories }) => {
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState({ type: "", message: "" });

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: "", message: "" }), 3000);
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id); //  Call backend to delete from MongoDB
      setFormValues((prev) => prev.filter((expense) => expense.id !== id));
      showNotification("success", "Expense deleted.");
      if (editingId === id) setEditingId(null);
    } catch (err) {
      console.error("Delete failed:", err);
      showNotification("error", "Failed to delete expense. Please try again.");
    }
  };

  const handleEdit = (id) => setEditingId(id);

  const handleUpdate = (id, fieldName, newValue) => {
    setFormValues((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, [fieldName]: newValue } : expense
      )
    );
  };

  const handleSave = async () => {
    const expenseToUpdate = formValues.find((exp) => exp.id === editingId);

    try {
      const updatedExpense = await updateExpense(editingId, expenseToUpdate);

      // Replace in local state with updated result from server
      setFormValues((prev) =>
        prev.map((exp) => (exp.id === editingId ? updatedExpense : exp))
      );

      setEditingId(null);
      showNotification("success", "Expense updated successfully.");
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to update expense.");
    }
  };

  if (formValues.length === 0)
    return (
      <h2 className=" !mb-8 text-center font-bold text-xl">
        No expenses found.
      </h2>
    );

  return (
    <div>
      <h2 className="font-bold text-xl mt-2">Submitted Expenses:</h2>
      <br />

      {notification.message && (
        <div
          style={{
            backgroundColor:
              notification.type === "error" ? "#ffe5e5" : "#e6ffed",
            color: notification.type === "error" ? "#d8000c" : "#2e7d32",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "10px",
            border: `1px solid ${
              notification.type === "error" ? "#d8000c" : "#2e7d32"
            }`,
          }}
        >
          {notification.message}
        </div>
      )}

      <ul className="list-none  p-0 grid grid-cols-3 gap-6">
        {formValues.map((expense) => {
          const isEditing = editingId === expense.id;

          return (
            <li
              className="shadow-md rounded-2xl p-6 text-lg coursor-pointer  hover:shadow-lg hover:scale-102 transition-transform duration-300"
              key={expense.id}
            >
              {isEditing ? (
                <div className="space-y-4">
                  <label>
                    Category:
                    <select
                      className="ml-2 mt-2 mb-2 border border-gray rounded-md px-2 py-1"
                      value={expense.category}
                      onChange={(e) =>
                        handleUpdate(expense.id, "category", e.target.value)
                      }
                    >
                      <option value="select"> Select Category </option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </label>

                  <br />

                  <label>
                    Amount:
                    <input
                      className="ml-2 mt-2 mb-2 border border-gray rounded-md px-2 py-1"
                      type="number"
                      value={expense.amount}
                      onChange={(e) =>
                        handleUpdate(expense.id, "amount", e.target.value)
                      }
                    />
                  </label>

                  <br />

                  <label>
                    Description:
                    <input
                      className="ml-2 mt-2 mb-2 border border-gray rounded-md px-2 py-1"
                      type="text"
                      value={expense.description}
                      onChange={(e) =>
                        handleUpdate(expense.id, "description", e.target.value)
                      }
                    />
                  </label>

                  <br />

                  <label>
                    Date:
                    <input
                      className="ml-2 mt-2 mb-2 border border-gray rounded-md px-2 py-1"
                      type="date"
                      value={expense.date ? expense.date.split("T")[0] : ""}
                      onChange={(e) =>
                        handleUpdate(expense.id, "date", e.target.value)
                      }
                    />
                  </label>

                  <br />
                  <button
                    onClick={handleSave}
                    className="bg-purple-400 hover:bg-purple-500 text-white font-semibold py-2 px-6 rounded-xl mb-8"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <p>
                    <strong>Category:</strong> {expense.category}
                  </p>
                  <br />
                  <p>
                    <strong>Amount:</strong> {expense.amount}
                  </p>
                  <br />
                  <p>
                    <strong>Description:</strong> {expense.description || "N/A"}
                  </p>
                  <br />
                  <p>
                    <strong>Date:</strong> {expense.date}
                  </p>
                  <br />
                  <button
                    className="bg-purple-400 hover:bg-purple-500 text-white font-semibold py-2 px-6 rounded-xl mr-2 mb-8"
                    onClick={() => handleEdit(expense.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-300 hover:bg-red-400 text-black font-semibold py-2 px-6 rounded-xl mb-8 cursor-pointer"
                    onClick={() => handleDelete(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ExpenseList;
