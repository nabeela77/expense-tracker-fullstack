import React from "react";
import { useState } from "react";

const ExpenseForm = ({ onSubmit, setShowForm, categories }) => {
  //   const [inputData, setInputData] = useState([]);
  //   const [form, setForm] = useState([]);
  //   console.log(form);
  //   const
  const [notification, setNotification] = useState({ type: "", message: "" });

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: "", message: "" }), 3000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    let formObj = Object.fromEntries(formData.entries());
    if (formObj.category === "select") {
      showNotification("error", "Please select a valid category.");
      return;
    }

    const newExpense = {
      amount: Number(formObj.amount),
      category: formObj.category,
      description: formObj.description || "",
      date: new Date(formObj.date).toISOString(),
    };
    try {
      await onSubmit(newExpense);
      showNotification("success", "Expense submitted successfully.");
      form.reset();
      if (setShowForm) setShowForm(false);
    } catch (err) {
      showNotification("error", "Something went wrong.Please try again");
    }

    // console.log(formObj);
  };

  return (
    <div>
      <h2 className="font-bold text-xl mb-4 !ml-0">Add Expense:</h2>
      {/* Add Expense Button */}
      {/* <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-xl mb-8">
        Add Expense
      </button> */}

      {/* Notification Banner */}
      {notification.message && (
        <div
          className={`mb-4 p-3 rounded border text-sm ${
            notification.type === "error"
              ? "bg-red-100 text-red-700 border-red-400"
              : "bg-green-100 text-green-700 border-green-400"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Expense Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div>
          <label className="block mb-1 font-medium text-lg">Category</label>
          <select
            id="category"
            name="category"
            required
            className="w-full border border-gray-300 p-2 rounded-md text-lg" //usegetCtegories api
          >
            <option value="select">Select Category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block mb-1 font-medium text-lg">Amount</label>
          <input
            type="number"
            name="amount"
            required
            placeholder="Enter your amount"
            className="w-full border border-gray-300 p-2 rounded-md text-lg"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium text-lg">Description</label>
          <input
            type="text"
            name="description"
            placeholder="(Optional)"
            className="w-full border border-gray-300 p-2 rounded-md text-lg"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-medium text-lg">Date</label>
          <input
            type="datetime-local"
            name="date"
            required
            className="w-full border border-gray-300 p-2 rounded-md text-lg"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-xl mt-4 mb-4"
          >
            Submit Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
