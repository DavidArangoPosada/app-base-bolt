import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './components/auth/LoginPage';
import HomePage from './pages/HomePage';
import { supabase } from './lib/supabase';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/inicio" /> : <LoginPage />}
        />
        <Route
          path="/inicio"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/" />}
        />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-dark-800 text-white border border-dark-700',
          style: {
            background: '#111111',
            color: '#fff',
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;