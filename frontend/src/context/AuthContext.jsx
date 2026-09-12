import { createContext, useContext, useState, useEffect } from "react";
import { getUserRole, getUserEmail, isTokenValid } from "../utils/jwt";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => (isTokenValid() ? localStorage.getItem("access_token") : null));
  const [role, setRole] = useState(() => getUserRole());
  const [email, setEmail] = useState(() => getUserEmail());

  useEffect(() => {
    if (isTokenValid()) {
      setToken(localStorage.getItem("access_token"));
      setRole(getUserRole());
      setEmail(getUserEmail());
    } else {
      setToken(null);
      setRole(null);
      setEmail(null);
    }
  }, []);

  const login = (jwtToken) => {
    localStorage.setItem("access_token", jwtToken);
    setToken(jwtToken);
    setRole(getUserRole());
    setEmail(getUserEmail());
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setRole(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        email,
        login,
        logout,
        isAuthenticated: !!token && isTokenValid(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);