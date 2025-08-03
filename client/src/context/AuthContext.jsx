import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        setAuthenticated(true);
        setAdmin(res.data.isAdmin);
      } catch (error) {
        console.error("Failed to load user or token expired: ", error);
        localStorage.removeItem("token");
        setUser(null);
        setAuthenticated(false);
        setAdmin(false);
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function login(email, password) {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      setAuthenticated(true);
      setAdmin(res.data.isAdmin);
      return { success: true, message: res.data.message };
    } catch (err) {
      console.error("Login error:", err.response?.data?.message || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  }

  async function register(name, email, password) {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      setAuthenticated(true);
      setAdmin(res.data.isAdmin);
      return { success: true, message: res.data.message };
    } catch (err) {
      console.error(
        "Registration error:",
        err.response?.data?.message || err.message,
      );
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  }

  function logout() {
    try {
      localStorage.removeItem("token");
      setUser(null);
      setAuthenticated(false);
      setAdmin(false);
      return { success: true, message: "Logged out!" };
    } catch (err) {
      console.error("Logout error: ", err.response?.data?.message || err.message);
      return { success: false, message: err.response?.data?.message || "Logout failed" };
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, authenticated, admin, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
