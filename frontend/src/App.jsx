import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import HomePage         from './pages/HomePage.jsx'
import IntakeFormPage   from './pages/IntakeFormPage.jsx'
import MenuPage         from './pages/MenuPage.jsx'
import ServicesPage     from './pages/ServicesPage.jsx'
import ReviewPage       from './pages/ReviewPage.jsx'
import AdminLoginPage   from './pages/AdminLoginPage.jsx'
import AdminDashboard   from './pages/AdminDashboard.jsx'
import SalesDashboard   from './pages/SalesDashboard.jsx'
import { isStaffLoggedIn, getStaffRole } from './lib/utils.js'

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
// Redirects to login if not logged in.
// If `requiredRole` is supplied, also enforces the role.
function ProtectedRoute({ children, requiredRole }) {
  if (!isStaffLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  if (requiredRole && getStaffRole() !== requiredRole) {
    // Redirect to the correct dashboard for the actual role
    const role = getStaffRole()
    if (role === 'admin')  return <Navigate to="/admin" replace />
    if (role === 'sales')  return <Navigate to="/sales" replace />
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#1a1a1a',
            color: '#f2ead8',
            fontSize: '13px',
            border: '1px solid rgba(201,168,76,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.01em',
          },
          success: {
            iconTheme: { primary: '#c9a84c', secondary: '#0a0a0a' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#0a0a0a' },
          },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/"         element={<HomePage />} />
        <Route path="/plan"     element={<IntakeFormPage />} />
        <Route path="/menu"     element={<MenuPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/review"   element={<ReviewPage />} />

        {/* Auth */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin-only dashboard */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Sales-only dashboard */}
        <Route path="/sales" element={
          <ProtectedRoute requiredRole="sales">
            <SalesDashboard />
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
