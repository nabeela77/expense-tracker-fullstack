import React, { useMemo } from "react";

const ExpenseSummary = ({ formValues }) => {
  // Calculate total spending
  const totalSpending = useMemo(() => {
    return formValues.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );
  }, [formValues]);

  // Group by category
  const spendingByCategory = useMemo(() => {
    return formValues.reduce((acc, expense) => {
      acc[expense.category] =
        (acc[expense.category] || 0) + Number(expense.amount);
      return acc;
    }, {});
  }, [formValues]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Expense Summary:</h2>

      <div className="mb-4">
        <p>
          <strong>Total Spending:</strong> ${totalSpending.toFixed(2)}
        </p>
      </div>

      <div className="mb-4">
        <h3 className=" mb-2 font-bold">Spending by Category:</h3>
        {Object.keys(spendingByCategory).length === 0 ? (
          <p>No expenses found for current filter.</p>
        ) : (
          <ul className="list-disc pl-6 ">
            {Object.entries(spendingByCategory).map(([category, amount]) => (
              <li key={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}: $
                {amount.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 ">
        <h3 className=" mb-2 font-bold ">Filtered & Sorted Expenses:</h3>
        {formValues.length === 0 ? (
          <h2>No expenses found.</h2>
        ) : (
          <ul className="list-none space-y-2">
            {formValues.map((expense) => (
              <li key={expense.id} className="border-b pb-2">
                {expense.date} - {expense.category} - $
                {Number(expense.amount).toFixed(2)} -{" "}
                {expense.description || "no description"}
              </li>
              //   <li key={expense.id} className="border-b pb-2">
              //   {expense.date
              //     ? new Date(expense.date).toLocaleDateString(undefined, {
              //         year: "numeric",
              //         month: "short",
              //         day: "numeric",
              //       })
              //     : "No date"}{" "}
              //   - {expense.category} - ${Number(expense.amount).toFixed(2)} -{" "}
              //   {expense.description || "no description"}
              // </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExpenseSummary;
