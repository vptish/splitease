import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useTheme } from './hooks/useTheme';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Verify from './pages/Verify';
import BillWorkspace from './pages/BillWorkspace';
import History from './pages/History';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const { theme } = useTheme();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/bill/:id" element={<BillWorkspace />} />
          <Route path="/history" element={<History />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}
