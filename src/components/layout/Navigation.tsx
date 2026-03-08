import { NavLink } from 'react-router-dom';
import { Receipt, Clock, BarChart3, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: <Receipt className="w-6 h-6" />, label: 'Home', path: '/' },
  { icon: <Clock className="w-6 h-6" />, label: 'History', path: '/history' },
  { icon: <BarChart3 className="w-6 h-6" />, label: 'Reports', path: '/reports' },
  { icon: <User className="w-6 h-6" />, label: 'Profile', path: '/profile' },
];

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-area-inset-bottom">
      <div className="relative border-t border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-2xl">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-colors duration-300 ${
                  isActive
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="nav-bg"
                      className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-2xl -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 40 }}
                    />
                  )}
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    {item.icon}
                  </motion.div>
                  <span className="text-xs font-medium mt-0.5">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
