import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './middleware/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import UserManagement from './admin/UserManagement';
import Navbar from './components/shared/Navbar';
import Dashboard from './pages/Dashboard';

const getHomePath = (role) => {
  if (role === 'admin' || role === 'manager') return '/admin/users';
  return '/dashboard';
};

const AppShell = () => {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </>
  );
};

const HomeRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getHomePath(user.role)} replace />;
};

function App() {
  return (
    <div className="App">
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED APP SHELL */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/me" element={<Profile />} />

          {/* ADMIN & MANAGER ONLY */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* CATCH-ALL REDIRECTS */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/unauthorized" element={
            <div className="flex h-screen items-center justify-center font-black uppercase">
                403 - Unauthorized Access Detected
            </div>
        } />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </div>
  );
}

export default App;