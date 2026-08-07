/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isOnboarded?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // <-- Starts as true
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    
    // We are done checking localStorage, so loading is complete!
    setIsLoading(false); 
  }, []);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken); 
    
    // SMART ROUTING: Check role AND onboarding status
    if (userData.role === "supplier") {
      router.push("/supplier/dashboard");
    } else {
      // If they are a buyer, check if they finished onboarding
      if (userData.isOnboarded) {
        router.push("/marketplace"); // Already onboarded, go to marketplace
      } else {
        router.push("/onboarding"); // New buyer! Send them to AI onboarding
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};