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
import MovieDetailPage from "../pages/movies/MovieDetailPage.jsx";
import RequireRole from "./RequireRole.jsx";
import AdminUsersPage from "../pages/admin/AdminUsersPage.jsx";
import AddUserPage from "../pages/admin/AddUserPage.jsx";
import EditUserPage from "../pages/admin/EditUserPage.jsx";

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
        path="/movies/:id"
        element={
          <PublicLayout>
            <MovieDetailPage />
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

      {/* Admin movie routes: admin + superadmin */}
      <Route
        path="/admin/movies"
        element={
          <RequireRole allowedRoles={["admin", "superadmin"]}>
            <AdminLayout>
              <AdminMoviesPage />
            </AdminLayout>
          </RequireRole>
        }
      />
      <Route
        path="/admin/movies/new"
        element={
          <RequireRole allowedRoles={["admin", "superadmin"]}>
            <AdminLayout>
              <AddMoviePage />
            </AdminLayout>
          </RequireRole>
        }
      />
      <Route
        path="/admin/movies/:id/edit"
        element={
          <RequireRole allowedRoles={["admin", "superadmin"]}>
            <AdminLayout>
              <EditMoviePage />
            </AdminLayout>
          </RequireRole>
        }
      />

      {/* Superadmin-only users route */}
      <Route
        path="/admin/users"
        element={
          <RequireRole allowedRoles={["superadmin"]}>
            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
          </RequireRole>
        }
      />

      <Route
        path="/admin/users/new"
        element={
          <RequireRole allowedRoles={["superadmin"]}>
            <AdminLayout>
              <AddUserPage />
            </AdminLayout>
          </RequireRole>
        }
      />

      <Route
        path="/admin/users/:id/edit"
        element={
          <RequireRole allowedRoles={["superadmin"]}>
            <AdminLayout>
              <EditUserPage />
            </AdminLayout>
          </RequireRole>
        }
      />
    </Routes>
  );
};

export default AppRouter;
