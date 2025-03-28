//contexts
import { createContext, useState, useEffect } from "react";

interface AuthContextType {
  role: string;
  setRole: (role: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem("user_role") || "visitor");

  useEffect(() => {
    const storedRole = localStorage.getItem("user_role") || "visitor";
    setRole(storedRole);
  }, []);

  const logout = () => {
    localStorage.removeItem("AUTH_TOKEN");
    localStorage.removeItem("user_role");
    setRole("visitor");
  };

  return (
    <AuthContext.Provider value={{ role, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
