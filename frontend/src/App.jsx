// src/App.jsx
// All application routes.
//
// Access levels:
//   Public      – anyone (guest / user / admin)
//   ProtectedRoute  – must be logged in (user OR admin)
//   UserOnlyRoute   – must be logged in AND role === 'user'
//   AdminRoute      – must be logged in AND role === 'admin'

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute, UserOnlyRoute } from './components/ProtectedRoute';

// Public Pages
import HomePage        from './pages/HomePage';
import BrowseToolsPage from './pages/BrowseToolsPage';
import ToolDetailsPage from './pages/ToolDetailsPage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';

// User-only Pages (regular users, not admin)
import UserDashboardPage from './pages/UserDashboardPage';
import SubmitToolPage    from './pages/SubmitToolPage';
import MySubmissionsPage from './pages/MySubmissionsPage';
import FavouritesPage    from './pages/FavouritesPage';
import ProfilePage       from './pages/ProfilePage';

// Admin Pages
import AdminDashboardPage   from './pages/admin/AdminDashboardPage';
import AdminSubmissionsPage from './pages/admin/AdminSubmissionsPage';
import AdminManageToolsPage from './pages/admin/AdminManageToolsPage';
import AdminAddToolPage     from './pages/admin/AdminAddToolPage';
import AdminEditToolPage    from './pages/admin/AdminEditToolPage';
import AdminCategoriesPage  from './pages/admin/AdminCategoriesPage';
import AdminUsersPage       from './pages/admin/AdminUsersPage';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1">
        <Routes>

          {/* ── PUBLIC ──────────────────────────────────────────── */}
          <Route path="/"         element={<HomePage />} />
          <Route path="/tools"    element={<BrowseToolsPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Tool details – requires login (user OR admin can view) */}
          <Route
            path="/tools/:id"
            element={<ProtectedRoute><ToolDetailsPage /></ProtectedRoute>}
          />

          {/* ── USER ONLY (regular users, NOT admin) ────────────── */}
          <Route
            path="/dashboard"
            element={<UserOnlyRoute><UserDashboardPage /></UserOnlyRoute>}
          />
          <Route
            path="/submit-tool"
            element={<UserOnlyRoute><SubmitToolPage /></UserOnlyRoute>}
          />
          <Route
            path="/my-submissions"
            element={<UserOnlyRoute><MySubmissionsPage /></UserOnlyRoute>}
          />
          {/* Favourites — regular users only, admins are redirected to admin dashboard */}
          <Route
            path="/favourites"
            element={<UserOnlyRoute><FavouritesPage /></UserOnlyRoute>}
          />
          {/* Profile — regular users only */}
          <Route
            path="/profile"
            element={<UserOnlyRoute><ProfilePage /></UserOnlyRoute>}
          />

          {/* ── ADMIN ONLY ──────────────────────────────────────── */}
          <Route path="/admin/dashboard"      element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/submissions"    element={<AdminRoute><AdminSubmissionsPage /></AdminRoute>} />
          <Route path="/admin/tools"          element={<AdminRoute><AdminManageToolsPage /></AdminRoute>} />
          <Route path="/admin/tools/add"      element={<AdminRoute><AdminAddToolPage /></AdminRoute>} />
          <Route path="/admin/tools/edit/:id" element={<AdminRoute><AdminEditToolPage /></AdminRoute>} />
          <Route path="/admin/categories"     element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
          <Route path="/admin/users"          element={<AdminRoute><AdminUsersPage /></AdminRoute>} />

          {/* ── 404 ─────────────────────────────────────────────── */}
          <Route path="*" element={
            <div className="text-center py-5">
              <h1 style={{ fontSize: '5rem', color: '#6366f1' }}>404</h1>
              <p className="text-muted fs-5">Page not found</p>
              <a href="/" className="btn btn-primary mt-2" style={{ background: '#6366f1', border: 'none' }}>
                Go Home
              </a>
            </div>
          } />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
