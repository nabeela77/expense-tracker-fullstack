import React, { useEffect, useState } from "react";
import { getCategories } from "../../api/api.js";

const Filters = ({
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
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md mb-6 mt-4">
      <h3 className="text-lg font-semibold mb-2">Filter & Sort Expenses</h3>

      <div className="flex flex-wrap gap-4">
        {/* Category Filter */}
        <label className="flex flex-col">
          <span className="text-sm font-medium">Category</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </label>

        {/* Date Range */}
        <label className="flex flex-col">
          <span className="text-sm font-medium">Start Date</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium">End Date</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>

        {/* Sort By */}
        <label className="flex flex-col">
          <span className="text-sm font-medium">Sort By</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
        </label>

        {/* Sort Order */}
        <label className="flex flex-col">
          <span className="text-sm font-medium">Order</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default Filters;
