import { useContext, useDebugValue } from "react";
import { AuthContext, AuthContextType } from "../context/AuthProvider";

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("useAuth must be used within an AuthProvider");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  useDebugValue(context.auth, (auth) =>
    auth?.user ? "Logged In" : "Logged Out"
  );
  return context;
};

export default useAuth;
