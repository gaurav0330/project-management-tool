import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ Add loading state
  const navigate = useNavigate();

  // ✅ Function to check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  // ✅ Function to handle logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUserRole(null);
    
    toast.dismiss();
    toast.success("You have been logged out.", {
      duration: 4000,
    });
    
    navigate("/login");
  };

  // ✅ Function to check token validity
  const checkTokenValidity = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!storedUser || !token || isTokenExpired(token)) {
      logout();
      return false;
    }
    return true;
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (storedUser && token && !isTokenExpired(token)) {
          setUserRole(storedUser.role);
          console.log("User user name :", storedUser.name);
        } else if (storedUser || token) {
          // ✅ Clear invalid data
          logout();
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear potentially corrupted data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false); // ✅ Set loading to false after initialization
      }
    };

    initializeAuth();

    // ✅ Set up interval to check token expiration every minute
    const tokenCheckInterval = setInterval(() => {
      if (userRole) { // Only check if user is logged in
        checkTokenValidity();
      }
    }, 60000); // Check every minute

    return () => clearInterval(tokenCheckInterval);
  }, [navigate]); // ✅ Remove userRole from dependencies to prevent infinite loops

  return (
    <AuthContext.Provider value={{ 
      userRole, 
      setUserRole, 
      logout, 
      checkTokenValidity,
      isLoading // ✅ Provide loading state
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
