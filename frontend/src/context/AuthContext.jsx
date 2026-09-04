import { createContext, useContext, useState, useEffect } from "react";
import { getUserRole } from "../utils/jwt";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(
        localStorage.getItem("access_token")
    );

    const [role, setRole] = useState(
        getUserRole()
    );

    useEffect(() => {

        const storedToken = localStorage.getItem("access_token");

        if (storedToken) {
            setToken(storedToken);
            setRole(getUserRole());
        }

    }, []);

    const login = (jwtToken) => {

        localStorage.setItem("access_token", jwtToken);

        setToken(jwtToken);

        setRole(getUserRole());

    };

    const logout = () => {

        localStorage.removeItem("access_token");

        setToken(null);

        setRole(null);

    };

    return (

        <AuthContext.Provider
            value={{
                token,
                role,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>

    );

};

export const useAuth = () => useContext(AuthContext);