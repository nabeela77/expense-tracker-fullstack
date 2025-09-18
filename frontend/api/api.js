import axios from "axios";

const API_URL = "http://localhost:4002/api/expenses";
export async function getExpense() {
  const res = await axios.get(API_URL);
  return res.data;
}

// export async function createExpense(expenseData) {
//   const res = await axios.post(API_URL, expenseData);
//   return res.data;
// }
export async function createExpense(expenseData) {
  console.log("Sending to backend:", expenseData);
  const res = await axios.post(API_URL, expenseData);
  console.log("Received response:", res.data);
  return res.data;
}

export async function updateExpense(id, updatedData) {
  const res = await axios.put(`${API_URL}/${id}`, updatedData);
  return res.data;
}

export async function deleteExpense(id) {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
}

export async function getSummary() {
  const res = await axios.get(`${API_URL}/summary`);
  return res.data;
}

export async function getCategories() {
  const res = await axios.get(`${API_URL}/categories`);
  return res.data;
}
