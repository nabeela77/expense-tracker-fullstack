import React, { useMemo } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

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

  // const barChartData = useMemo(() => {
  //   return {
  //     labels: Object.keys(spendingByCategory),
  //     datasets: [
  //       {
  //         label: "Spending by Category",
  //         data: Object.values(spendingByCategory),
  //         backgroundColor: "rgba(99, 102, 241, 0.6)", // Tailwind indigo-500 with opacity
  //         borderColor: "rgba(99, 102, 241, 1)",
  //         borderWidth: 1,
  //       },
  //     ],
  //   };
  // }, [spendingByCategory]);
  const categoryColors = [
    "#6366F1", // Indigo
    "#EF4444", // Red
    "#F59E0B", // Amber
    "#10B981", // Green
    "#3B82F6", // Blue
    "#8B5CF6", // Purple
    "#EC4899", // Pink
  ];
  const barChartData = useMemo(() => {
    const labels = Object.keys(spendingByCategory);

    return {
      labels,
      datasets: [
        {
          label: "Spending by Category",
          data: Object.values(spendingByCategory),
          backgroundColor: labels.map(
            (_, idx) => categoryColors[idx % categoryColors.length]
          ),
          borderColor: labels.map(
            (_, idx) => categoryColors[idx % categoryColors.length]
          ),
          borderWidth: 1,
        },
      ],
    };
  }, [spendingByCategory]);

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Spending by Category" },
    },
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Expense Summary:</h2>

      <div className="mb-4">
        <p>
          <strong>Total Spending:</strong> ${totalSpending.toFixed(2)}
        </p>
      </div>

      <div className="mb-4">
        <Doughnut data={barChartData} options={barChartOptions} />

        <h3 className=" mb-2 font-bold mt-10">Spending by Category:</h3>
        {Object.keys(spendingByCategory).length === 0 ? (
          <p>No expenses found for current filter.</p>
        ) : (
          <ul className="list-disc pl-6 mt-2">
            {Object.entries(spendingByCategory).map(([category, amount]) => (
              <li key={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}: $
                {amount.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExpenseSummary;
