import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useBillStore } from '../store/billStore';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/cn';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import Header from '../components/layout/Header';
import { formatCurrency } from '../lib/formatCurrency';

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

interface MonthlyData {
  month: string;
  total: number;
  count: number;
}

export default function Reports() {
  const { bills } = useBillStore();
  const { isDark } = useTheme();

  const stats = useMemo(() => {
    if (bills.length === 0) {
      return {
        totalBills: 0,
        totalSpent: 0,
        avgBill: 0,
        mostExpensive: 0,
        monthlyData: [] as MonthlyData[],
        topRestaurants: [] as { name: string; count: number; total: number }[],
      };
    }

    const totalSpent = bills.reduce((sum, bill) => sum + (bill.totalDue || 0), 0);
    const totalBills = bills.length;
    const avgBill = totalSpent / totalBills;
    const mostExpensive = Math.max(...bills.map((b) => b.totalDue || 0), 0);

    // Monthly data
    const monthlyMap: { [key: string]: MonthlyData } = {};
    bills.forEach((bill) => {
      const date = new Date(bill.createdAt);
      const monthKey = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
      });

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthKey, total: 0, count: 0 };
      }
      monthlyMap[monthKey].total += bill.totalDue || 0;
      monthlyMap[monthKey].count += 1;
    });

    const monthlyData = Object.values(monthlyMap).sort(
      (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
    );

    // Top restaurants
    const restaurantMap: {
      [key: string]: { name: string; count: number; total: number };
    } = {};
    bills.forEach((bill) => {
      const restaurantName = bill.metadata.restaurantName || 'Unknown';
      if (!restaurantMap[restaurantName]) {
        restaurantMap[restaurantName] = {
          name: restaurantName,
          count: 0,
          total: 0,
        };
      }
      restaurantMap[restaurantName].count += 1;
      restaurantMap[restaurantName].total += bill.totalDue || 0;
    });

    const topRestaurants = Object.values(restaurantMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalBills,
      totalSpent,
      avgBill,
      mostExpensive,
      monthlyData,
      topRestaurants,
    };
  }, [bills]);

  const maxMonthlyAmount = Math.max(...stats.monthlyData.map((d) => d.total), 1);

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
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1
            className={cn(
              'text-3xl font-bold',
              isDark ? 'text-white' : 'text-slate-900'
            )}
          >
            Reports
          </h1>
          <p
            className={cn(
              'text-sm mt-2',
              isDark ? 'text-slate-400' : 'text-slate-600'
            )}
          >
            Your spending insights
          </p>
        </motion.div>

        {stats.totalBills === 0 ? (
          <motion.div variants={itemVariants}>
            <EmptyState
              title="No data yet"
              description="Create some bills to see your spending reports"
            />
          </motion.div>
        ) : (
          <>
            {/* Stats Row */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-3 mb-8"
            >
              <GlassCard className="p-4">
                <p
                  className={cn(
                    'text-xs font-medium mb-2 uppercase',
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  )}
                >
                  Total Bills
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  {stats.totalBills}
                </p>
              </GlassCard>

              <GlassCard className="p-4">
                <p
                  className={cn(
                    'text-xs font-medium mb-2 uppercase',
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  )}
                >
                  Avg Bill
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                  {formatCurrency(stats.avgBill)}
                </p>
              </GlassCard>

              <GlassCard className="p-4">
                <p
                  className={cn(
                    'text-xs font-medium mb-2 uppercase',
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  )}
                >
                  Highest
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-400 bg-clip-text text-transparent">
                  {formatCurrency(stats.mostExpensive)}
                </p>
              </GlassCard>
            </motion.div>

            {/* Total Spending Card */}
            <motion.div variants={itemVariants} className="mb-8">
              <GlassCard className="p-6">
                <p
                  className={cn(
                    'text-sm font-medium mb-4',
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  )}
                >
                  Total Spending
                </p>
                <p className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  {formatCurrency(stats.totalSpent)}
                </p>
                <p
                  className={cn(
                    'text-xs',
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  )}
                >
                  Across {stats.totalBills}{' '}
                  {stats.totalBills === 1 ? 'bill' : 'bills'}
                </p>
              </GlassCard>
            </motion.div>

            {/* Monthly Spending Chart */}
            <motion.div variants={itemVariants} className="mb-8">
              <GlassCard className="p-6">
                <h3
                  className={cn(
                    'font-semibold mb-6',
                    isDark ? 'text-white' : 'text-slate-900'
                  )}
                >
                  Monthly Spending Trend
                </h3>

                <div className="space-y-4">
                  {stats.monthlyData.slice(-6).map((data, idx) => {
                    const percentage = (data.total / maxMonthlyAmount) * 100;
                    const [month, year] = data.month.split('/');
                    const monthName = new Date(
                      parseInt(year),
                      parseInt(month) - 1
                    ).toLocaleDateString('en-US', { month: 'short' });

                    return (
                      <motion.div
                        key={data.month}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p
                            className={cn(
                              'text-sm font-medium',
                              isDark ? 'text-slate-300' : 'text-slate-700'
                            )}
                          >
                            {monthName}
                          </p>
                          <div className="text-right">
                            <p
                              className={cn(
                                'text-sm font-semibold',
                                isDark ? 'text-white' : 'text-slate-900'
                              )}
                            >
                              {formatCurrency(data.total)}
                            </p>
                            <p
                              className={cn(
                                'text-xs',
                                isDark ? 'text-slate-400' : 'text-slate-600'
                              )}
                            >
                              {data.count}{' '}
                              {data.count === 1 ? 'bill' : 'bills'}
                            </p>
                          </div>
                        </div>

                        <div
                          className={cn(
                            'h-2 rounded-full overflow-hidden',
                            isDark ? 'bg-slate-800' : 'bg-slate-200'
                          )}
                        >
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{
                              duration: 0.6,
                              ease: 'easeOut',
                              delay: idx * 0.05,
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>

            {/* Top Restaurants */}
            {stats.topRestaurants.length > 0 && (
              <motion.div variants={itemVariants}>
                <GlassCard className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <h3
                      className={cn(
                        'font-semibold',
                        isDark ? 'text-white' : 'text-slate-900'
                      )}
                    >
                      Top Restaurants
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {stats.topRestaurants.map((restaurant, idx) => (
                      <motion.div
                        key={restaurant.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{
                          background: isDark
                            ? `rgba(59, 130, 246, ${0.05 + (idx * 0.03)})`
                            : `rgba(59, 130, 246, ${0.05 + (idx * 0.03)})`,
                        }}
                      >
                        <div className="flex-1">
                          <p
                            className={cn(
                              'font-medium',
                              isDark ? 'text-white' : 'text-slate-900'
                            )}
                          >
                            {restaurant.name}
                          </p>
                          <p
                            className={cn(
                              'text-sm',
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            )}
                          >
                            {restaurant.count}{' '}
                            {restaurant.count === 1 ? 'visit' : 'visits'}
                          </p>
                        </div>

                        <div className="text-right">
                          <Badge variant="default" className="whitespace-nowrap">
                            {formatCurrency(restaurant.total)}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
