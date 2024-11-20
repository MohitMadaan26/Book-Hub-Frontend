import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useFetchUser } from "./useFetchUser";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
  username: string;
}

interface DecodedToken {
  userId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUserName] = useState("");

  const result = useFetchUser(userId || "");

  useEffect(() => {
    // Check if a token exists in localStorage on mount
    const token = localStorage.getItem("token");
    // console.log(token);

    if (token) {
      const { userId }: DecodedToken = jwtDecode(token);
      //   console.log(userId);

      setUserId(userId); // Update userId from token
    }
  }, []);

  useEffect(() => {
    // Fetch user details and set isAdmin based on role
    if (result.data?.getUser) {
      setIsAdmin(result.data.getUser.role === "ADMIN");
      setUserName(result.data.getUser.username);
    } else {
      setIsAdmin(false);
      setUserName("");
    }
  }, [result]);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const { userId }: DecodedToken = jwtDecode(token);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserId(null);
    setIsAdmin(false); // Reset admin state on logout
    setUserName("");
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, username }}>
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
