/**
 * Auth context for managing auth state and exposing login/logout/register helpers.
 */
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Returns the authentication context. */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides authentication state and helper methods to children.
   */
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Attempt to load user if a token exists
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setInitializing(false);
      return;
    }
    api
      .me()
      .then((me) => {
        setUser(me);
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        setUser(null);
      })
      .finally(() => setInitializing(false));
  }, []);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    const data = await api.login(email, password);
    if (data && data.token) {
      localStorage.setItem("auth_token", data.token);
    }
    if (data && data.user) setUser(data.user);
    return data;
  };

  // PUBLIC_INTERFACE
  const register = async (name, email, password) => {
    const data = await api.register(name, email, password);
    if (data && data.token) {
      localStorage.setItem("auth_token", data.token);
    }
    if (data && data.user) setUser(data.user);
    return data;
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  const value = { user, initializing, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
