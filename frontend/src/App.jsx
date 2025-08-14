import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import styles from './App.module.css';

// ✅ Lazy loading for better performance
const Navbar = lazy(() => import('./components/Navbar/Navbar'));
const Cart = lazy(() => import('./components/Cart/Cart'));
const Footer = lazy(() => import('./components/Footer/Footer'));
const Login = lazy(() => import('./pages/Login/Login'));

// Public pages
const Home = lazy(() => import('./pages/Home/Home'));
const Products = lazy(() => import('./pages/Products/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail/ProductDetail'));
const Contact = lazy(() => import('./pages/Contact/Contact'));

// Admin pages
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));

// ✅ Loading fallback component
const PageLoader = () => (
  <div className={styles.pageLoader}>
    <LoadingSpinner size="large" />
    <p>Loading...</p>
  </div>
);

// ✅ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }
  
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

// ✅ Public Route Component (redirects authenticated users)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/admin/dashboard" replace />;
};

// ✅ Main App Layout Component
const AppLayout = ({ children, theme, toggleTheme }) => {
  return (
    <div className={`${styles.app} ${styles[theme]}`} data-theme={theme}>
      <Suspense fallback={<div className={styles.navbarLoader} />}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
      </Suspense>
      
      <Suspense fallback={<div />}>
        <Cart />
      </Suspense>
      
      <main className={styles.mainContent}>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </main>
      
      <Suspense fallback={<div className={styles.footerLoader} />}>
        <Footer />
      </Suspense>
    </div>
  );
};

// ✅ Admin Layout Component
const AdminLayout = ({ children }) => {
  return (
    <div className={styles.adminLayout}>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

// ✅ Theme Hook
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('ggg-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (prefersDark ? 'dark' : 'light');
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('ggg-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return { theme, toggleTheme };
};

// ✅ Main App Component
function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* ✅ Admin Routes */}
              <Route path="/admin/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard/*" element={<Dashboard />} />
                      <Route path="" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              } />

              {/* ✅ Public Routes */}
              <Route path="/*" element={
                <AppLayout theme={theme} toggleTheme={toggleTheme}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AppLayout>
              } />
            </Routes>
            
            {/* ✅ Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={theme}
              className={styles.toastContainer}
              toastClassName={styles.toast}
              bodyClassName={styles.toastBody}
              progressClassName={styles.toastProgress}
            />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
