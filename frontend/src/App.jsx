import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './middleware/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
function App() {
  return (
    <div className="App">
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES - ANY LOGGED IN USER (Requirement 3.4) */}
        {/* <Route 
          path="/me" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        /> */}

        {/* ADMIN & MANAGER ONLY (Requirement 3.3 & 3.4) */}
        {/* <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <UserManagement />
            </ProtectedRoute>
          } 
        /> */}

        {/* CATCH-ALL REDIRECTS */}
        {/* <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/unauthorized" element={
            <div className="flex h-screen items-center justify-center font-black uppercase">
                403 - Unauthorized Access Detected
            </div>
        } /> */}
      </Routes>
    </div>
  );
}

export default App;