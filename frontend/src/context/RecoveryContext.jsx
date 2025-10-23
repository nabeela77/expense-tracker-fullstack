import { createContext, useContext, useState } from "react";
import { useExpenses } from "./ExpenseContext";
const RecoveryContext = createContext();
import Login from "../pages/Login";
import OTPInput from "../pages/OTPInput";
import Reset from "../pages/Reset";
import Recovered from "../pages/Recovered";

export const RecoveryProvider = ({ children }) => {
  const [page, setPage] = useState("login");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const { email, setEmail, password, setPassword } = useExpenses();
  const [otp, setOTP] = useState("");

  function NavigateComponents() {
    if (page === "login") return <Login />;
    if (page === "otp") return <OTPInput />;
    if (page === "reset") return <Reset />;
    return <Recovered />;
  }
  return (
    <RecoveryContext.Provider
      value={{
        page,
        setPage,
        email,
        setEmail,
        otp,
        setOTP,
        password,
        setPassword,
        // newPassword,
        // setNewPassword,
      }}
    >
      <NavigateComponents />
    </RecoveryContext.Provider>
  );
};

export const useRecovery = () => {
  const context = useContext(RecoveryContext);
  if (!context) {
    throw new Error("useRecovery must be used within RecoveryProvider");
  }
  return context;
};
