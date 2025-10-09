import { createContext, useContext, useState } from "react";

const RecoveryContext = createContext();

export const RecoveryProvider = ({ children }) => {
  const [page, setPage] = useState("login");
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");

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
      {children}
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
