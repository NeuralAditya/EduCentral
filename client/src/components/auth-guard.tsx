import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "student";
  loginTime: string;
}

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("educentral_user");
        if (userData) {
          const parsedUser = JSON.parse(userData) as User;
          setUser(parsedUser);
          
          // Check if admin access is required
          if (requireAdmin && parsedUser.role !== "admin") {
            setLocation("/login");
            return;
          }
        } else {
          setLocation("/login");
          return;
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setLocation("/login");
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setLocation, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("educentral_user");
    if (userData) {
      try {
        setUser(JSON.parse(userData) as User);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("educentral_user");
    setUser(null);
    window.location.href = "/";
  };

  return { user, logout, isLoggedIn: !!user };
}