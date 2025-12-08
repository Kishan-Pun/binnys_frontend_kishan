import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import HomePage from "../pages/movies/HomePage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import AdminMoviesPage from "../pages/admin/AdminMoviesPage.jsx";
import SearchPage from "../pages/movies/SearchPage.jsx"; // 👈 add this
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        }
      />

      <Route
        path="/login"
        element={
          <PublicLayout>
            <LoginPage />
          </PublicLayout>
        }
      />

      <Route
        path="/search"
        element={
          <PublicLayout>
            <SearchPage />
          </PublicLayout>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/movies"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminMoviesPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
