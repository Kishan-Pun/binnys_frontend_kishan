import React from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import HomePage from "../pages/movies/HomePage.jsx";
import SearchPage from "../pages/movies/SearchPage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import AdminMoviesPage from "../pages/admin/AdminMoviesPage.jsx";
import AddMoviePage from "../pages/admin/AddMoviePage.jsx";
import EditMoviePage from "../pages/admin/EditMoviePage.jsx";
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
        path="/search"
        element={
          <PublicLayout>
            <SearchPage />
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

      <Route
        path="/admin/movies/new"
        element={
          <AdminRoute>
            <AdminLayout>
              <AddMoviePage />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/movies/:id/edit"
        element={
          <AdminRoute>
            <AdminLayout>
              <EditMoviePage />
            </AdminLayout>
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
