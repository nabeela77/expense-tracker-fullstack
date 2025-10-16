import axios from "axios";

const BASE_URL = "http://localhost:4002/api";
const EXPENSE_URL = `${BASE_URL}/expenses`;
const SIGNUP_API_URL = `${BASE_URL}/auth/signup`;
const LOGIN_API_URL = `${BASE_URL}/auth/login`;

const authAxios = axios.create();

// ✅ Attach JWT token to each request
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 ||
        error.response.data.message === "Session expired. Please login again.")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect user to login page
    }
    return Promise.reject(error);
  }
);

//home api
export async function getExpense() {
  const res = await authAxios.get(EXPENSE_URL);
  // console.log(res.data);
  return res.data;
}

// export async function createExpense(expenseData) {
//   const res = await axios.post(API_URL, expenseData);
//   return res.data;
// }
export async function createExpense(expenseData) {
  // console.log("Sending to backend:", expenseData);
  const res = await authAxios.post(EXPENSE_URL, expenseData);
  // console.log("Received response:", res.data);
  return res.data;
}

export async function updateExpense(id, updatedData) {
  const res = await authAxios.put(`${EXPENSE_URL}/${id}`, updatedData);
  return res.data;
}

export async function deleteExpense(id) {
  const res = await authAxios.delete(`${EXPENSE_URL}/${id}`);
  return res.data;
}

export async function getSummary() {
  const res = await authAxios.get(`${EXPENSE_URL}/summary`);
  return res.data;
}

// export async function getCategories() {
//   const res = await authAxios.get(`${EXPENSE_URL}/categories`);
//   return res.data;
// }
export async function getCategories() {
  try {
    const res = await authAxios.get(`${EXPENSE_URL}/categories`);
    return res.data;
  } catch (error) {
    console.error(
      "Failed to fetch categories:",
      error.response || error.message
    );
    throw error;
  }
}

//signup api
export async function signupUser(userData) {
  // console.log("Sending signup data to backend:", userData);
  const res = await axios.post(SIGNUP_API_URL, userData);
  // console.log("Received signup response:", res.data);
  // console.log(res.data);
  // console.log(userData);
  return res.data;
}

export async function loginUser(userData) {
  const res = await axios.post(LOGIN_API_URL, userData);
  const rawToken = res.data.token.startsWith("Bearer ")
    ? res.data.token.slice(7)
    : res.data.token;

  // console.log("Logged in data recieved", userData);
  // console.log("res data", res.data);
  localStorage.setItem("token", rawToken);
  return rawToken;
}
