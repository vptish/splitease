// not using useEffect - bills are static for now
import { motion } from 'framer-motion';
import { Camera, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBillStore } from '../store/billStore';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/cn';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { EmptyState } from '../components/ui/EmptyState';
import Header from '../components/layout/Header';
import { formatCurrency } from '../lib/formatCurrency';
import { generateId } from '../lib/generateId';
import { Bill } from '../types';

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

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { bills, createBill } = useBillStore();
  const { isDark } = useTheme();

  // bills are loaded from store

  const recentBills = bills.slice(0, 3);

  const handleScanReceipt = () => {
    navigate('/verify');
  };

  const handleEnterManually = async () => {
    const newBillId = generateId();
    const mockBill: Bill = {
      id: newBillId,
      metadata: {
        restaurantName: 'New Bill',
        date: new Date().toISOString().split('T')[0],
      },
      items: [
        {
          id: generateId(),
          name: 'Item 1',
          quantity: 1,
          unitPrice: 100,
          lineTotal: 100,
          splitGranularity: 'fraction',
        },
      ],
      currency: 'ZAR',
      taxMode: 'exclusive',
      taxLines: [{ label: 'Tax', amount: 15 }],
      serviceCharge: { present: false, taxed: false },
      tipIncluded: { present: false },
      totalDue: 115,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    createBill(mockBill);
    navigate(`/bill/${newBillId}`);
  };

  const monthlyStats = bills.reduce(
    (acc, bill) => {
      acc.count += 1;
      acc.total += bill.totalDue || 0;
      return acc;
    },
    { count: 0, total: 0 }
  );

  const greeting = `Hello, ${user?.name?.split(' ')[0] || 'there'}`;

  return (
    <div
      className={cn(
        'min-h-screen transition-colors duration-500',
        isDark ? 'bg-slate-950' : 'bg-white'
      )}
    >
      <Header />

      <motion.div
        className="px-4 pt-8 pb-20 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1
            className={cn(
              'text-4xl font-bold bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 bg-clip-text text-transparent',
              'motion-safe:animate-fade-in'
            )}
          >
            {greeting}
          </h1>
          <p
            className={cn(
              'text-sm mt-2',
              isDark ? 'text-slate-400' : 'text-slate-600'
            )}
          >
            Ready to split some bills?
          </p>
        </motion.div>

        {/* Primary CTA - Scan Receipt */}
        <motion.div variants={itemVariants} className="mb-4">
          <Button
            onClick={handleScanReceipt}
            className={cn(
              'w-full py-4 gap-3 text-lg font-semibold group',
              'relative overflow-hidden',
              'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700',
              'hover:from-blue-600 hover:via-blue-700 hover:to-blue-800',
              'shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40',
              'transition-all duration-300'
            )}
          >
            <motion.div
              className="absolute inset-0 bg-white/10"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />
            Scan Receipt
          </Button>
        </motion.div>

        {/* Secondary CTA - Enter Manually */}
        <motion.div variants={itemVariants} className="mb-12">
          <Button
            onClick={handleEnterManually}
            variant="secondary"
            className="w-full py-4 gap-3 text-lg font-semibold"
          >
            <Plus className="w-6 h-6" />
            Enter Manually
          </Button>
        </motion.div>

        {/* Monthly Stats Card */}
        <motion.div variants={itemVariants} className="mb-12">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={cn(
                    'text-sm font-medium mb-2',
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  )}
                >
                  This Month
                </p>
                <p className="text-sm text-slate-500">
                  {monthlyStats.count} {monthlyStats.count === 1 ? 'bill' : 'bills'}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    'text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent'
                  )}
                >
                  {formatCurrency(monthlyStats.total)}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Bills */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2
              className={cn(
                'text-lg font-semibold',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              Recent Bills
            </h2>
            {recentBills.length > 0 && (
              <button
                onClick={() => navigate('/history')}
                className={cn(
                  'text-sm font-medium text-blue-500 hover:text-blue-600',
                  'transition-colors'
                )}
              >
                See All
              </button>
            )}
          </div>

          {recentBills.length === 0 ? (
            <EmptyState
              title="No bills yet"
              description="Scan or create your first bill to get started"
              action={{
                label: 'Create Bill',
                onClick: handleEnterManually,
              }}
            />
          ) : (
            <motion.div
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {recentBills.map((bill) => (
                <motion.div
                  key={bill.id}
                  variants={itemVariants}
                  onClick={() => navigate(`/bill/${bill.id}`)}
                  className="cursor-pointer"
                >
                  <GlassCard className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'font-semibold truncate',
                            isDark ? 'text-white' : 'text-slate-900'
                          )}
                        >
                          {bill.metadata.restaurantName || 'Bill'}
                        </p>
                        <p
                          className={cn(
                            'text-sm mt-1',
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          )}
                        >
                          {new Date(bill.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                          {formatCurrency(bill.totalDue || 0)}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
