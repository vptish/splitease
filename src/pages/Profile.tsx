import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Moon, Sun, Mail, LogIn, Apple } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/cn';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';
import Header from '../components/layout/Header';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function Profile() {
  const { user, signOut, signIn, signUp, signInWithGoogle } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();
  const [selectedCurrency, setSelectedCurrency] = useState('ZAR');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const currencies = [
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
  ];

  const handleSignIn = () => {
    if (email && password) {
      signIn(email, password);
    }
  };

  const handleSignUp = () => {
    if (email && password && name) {
      signUp(email, password, name);
    }
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      signOut();
    }
  };

  return (
    <div
      className={cn(
        'min-h-screen transition-colors duration-500',
        isDark ? 'bg-slate-950' : 'bg-white'
      )}
    >
      <Header />

      <motion.div
        className="px-4 py-6 pb-20 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {user ? (
            // Signed In State
            <motion.div
              key="signed-in"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Profile Header */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center gap-4 mb-8 pt-4"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Avatar
                    initials={user.name?.charAt(0).toUpperCase()}
                    color="blue"
                    className="w-24 h-24 text-4xl"
                  />
                </motion.div>

                <div className="text-center">
                  <h1
                    className={cn(
                      'text-2xl font-bold',
                      isDark ? 'text-white' : 'text-slate-900'
                    )}
                  >
                    {user.name}
                  </h1>
                  <p
                    className={cn(
                      'text-sm mt-1',
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    )}
                  >
                    {user.email}
                  </p>
                </div>
              </motion.div>

              {/* Appearance Section */}
              <motion.div variants={itemVariants}>
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isDark ? (
                        <Moon className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Sun className="w-5 h-5 text-yellow-500" />
                      )}
                      <div>
                        <p
                          className={cn(
                            'font-semibold',
                            isDark ? 'text-white' : 'text-slate-900'
                          )}
                        >
                          Appearance
                        </p>
                        <p
                          className={cn(
                            'text-sm',
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          )}
                        >
                          {isDark ? 'Dark mode' : 'Light mode'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={toggleTheme}
                      className={cn(
                        'relative w-12 h-7 rounded-full transition-all',
                        isDark ? 'bg-blue-600' : 'bg-slate-300'
                      )}
                    >
                      <motion.div
                        className={cn(
                          'absolute w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center top-0.5',
                          isDark ? 'right-0.5' : 'left-0.5'
                        )}
                        animate={{
                          x: isDark ? -20 : 20,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {isDark ? (
                          <Moon className="w-3 h-3 text-blue-600" />
                        ) : (
                          <Sun className="w-3 h-3 text-yellow-500" />
                        )}
                      </motion.div>
                    </button>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Currency Section */}
              <motion.div variants={itemVariants}>
                <GlassCard className="p-6">
                  <p
                    className={cn(
                      'font-semibold mb-4',
                      isDark ? 'text-white' : 'text-slate-900'
                    )}
                  >
                    Default Currency
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {currencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => setSelectedCurrency(currency.code)}
                        className={cn(
                          'p-3 rounded-lg font-medium text-sm transition-all',
                          selectedCurrency === currency.code
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
                            : isDark
                              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        )}
                      >
                        {currency.code}
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Account Section */}
              <motion.div variants={itemVariants}>
                <GlassCard className="p-6">
                  <p
                    className={cn(
                      'font-semibold mb-4',
                      isDark ? 'text-white' : 'text-slate-900'
                    )}
                  >
                    Account
                  </p>

                  <Button
                    onClick={handleSignOut}
                    variant="danger"
                    className="w-full gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </Button>
                </GlassCard>
              </motion.div>
            </motion.div>
          ) : (
            // Sign In/Sign Up State
            <motion.div
              key="signed-out"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 pt-8"
            >
              {/* Avatar Placeholder */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center mb-8"
              >
                <div
                  className={cn(
                    'w-24 h-24 rounded-full flex items-center justify-center',
                    isDark
                      ? 'bg-slate-800'
                      : 'bg-gradient-to-br from-slate-100 to-slate-200'
                  )}
                >
                  <Mail className="w-12 h-12 text-slate-400" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.div variants={itemVariants} className="text-center mb-8">
                <h1
                  className={cn(
                    'text-2xl font-bold mb-2',
                    isDark ? 'text-white' : 'text-slate-900'
                  )}
                >
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p
                  className={cn(
                    'text-sm',
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  )}
                >
                  {isSignUp
                    ? 'Sign up to start splitting bills'
                    : 'Sign in to your account'}
                </p>
              </motion.div>

              {/* Form */}
              <motion.div variants={itemVariants} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label
                      className={cn(
                        'block text-sm font-medium mb-2',
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      )}
                    >
                      Full Name
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                )}

                <div>
                  <label
                    className={cn(
                      'block text-sm font-medium mb-2',
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    )}
                  >
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    className={cn(
                      'block text-sm font-medium mb-2',
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    )}
                  >
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        isSignUp ? handleSignUp() : handleSignIn();
                      }
                    }}
                  />
                </div>
              </motion.div>

              {/* Primary Action */}
              <motion.div variants={itemVariants}>
                <Button
                  onClick={isSignUp ? handleSignUp : handleSignIn}
                  variant="primary"
                  className="w-full py-3 text-lg font-semibold gap-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 shadow-xl shadow-blue-500/30"
                >
                  <LogIn className="w-5 h-5" />
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Button>
              </motion.div>

              {/* Toggle Sign Up/In */}
              <motion.div
                variants={itemVariants}
                className="text-center"
              >
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setEmail('');
                    setPassword('');
                    setName('');
                  }}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isDark
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-blue-600 hover:text-blue-700'
                  )}
                >
                  {isSignUp
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Sign up"}
                </button>
              </motion.div>

              {/* Divider */}
              <motion.div variants={itemVariants} className="flex items-center gap-3 my-6">
                <div className={cn('flex-1 h-px', isDark ? 'bg-slate-700' : 'bg-slate-300')} />
                <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-600')}>Or</p>
                <div className={cn('flex-1 h-px', isDark ? 'bg-slate-700' : 'bg-slate-300')} />
              </motion.div>

              {/* Social Buttons */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-3"
              >
                <Button
                  onClick={handleGoogleSignIn}
                  variant="secondary"
                  className="gap-2"
                >
                  Sign in with Google
                </Button>

                <Button variant="secondary" className="gap-2">
                  <Apple className="w-5 h-5" />
                  Apple
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
