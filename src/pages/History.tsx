import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBillStore } from '../store/billStore';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/cn';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import Header from '../components/layout/Header';
import { formatCurrency } from '../lib/formatCurrency';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export default function History() {
  const navigate = useNavigate();
  const { bills, deleteBill } = useBillStore();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filteredAndSortedBills = useMemo(() => {
    let filtered = bills.filter((bill) =>
      (bill.metadata.restaurantName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return (b.totalDue || 0) - (a.totalDue || 0);
      }
    });

    return filtered;
  }, [bills, searchQuery, sortBy]);

  const groupedByMonth = useMemo(() => {
    const groups: {
      [key: string]: typeof filteredAndSortedBills;
    } = {};

    filteredAndSortedBills.forEach((bill) => {
      const date = new Date(bill.createdAt);
      const monthKey = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });

      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(bill);
    });

    return groups;
  }, [filteredAndSortedBills]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this bill?')) {
      deleteBill(id);
    }
  };

  const monthKeys = Object.keys(groupedByMonth).sort(
    (a, b) =>
      new Date(b).getTime() - new Date(a).getTime()
  );

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
        <motion.div variants={itemVariants} className="mb-6">
          <h1
            className={cn(
              'text-3xl font-bold mb-4',
              isDark ? 'text-white' : 'text-slate-900'
            )}
          >
            History
          </h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants..."
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Sort Controls */}
        <motion.div variants={itemVariants} className="flex gap-2 mb-6">
          <button
            onClick={() => setSortBy('date')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm transition-all',
              sortBy === 'date'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
                : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            )}
          >
            Latest
          </button>
          <button
            onClick={() => setSortBy('amount')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm transition-all',
              sortBy === 'amount'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
                : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            )}
          >
            Highest
          </button>
        </motion.div>

        {/* Bills List */}
        {filteredAndSortedBills.length === 0 ? (
          <motion.div variants={itemVariants}>
            <EmptyState
              title="No bills found"
              description={
                searchQuery
                  ? 'Try adjusting your search'
                  : 'Create your first bill to get started'
              }
            />
          </motion.div>
        ) : (
          <motion.div variants={containerVariants}>
            {monthKeys.map((monthKey) => (
              <motion.div key={monthKey} variants={itemVariants}>
                {/* Month Header */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent opacity-50" />
                  <p
                    className={cn(
                      'text-sm font-semibold whitespace-nowrap',
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    )}
                  >
                    {monthKey}
                  </p>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent opacity-50" />
                </div>

                {/* Bills in Month */}
                <div className="space-y-3">
                  {groupedByMonth[monthKey].map((bill) => (
                    <motion.div
                      key={bill.id}
                      variants={itemVariants}
                      onClick={() => navigate(`/bill/${bill.id}`)}
                      className="group cursor-pointer"
                    >
                      <GlassCard className="p-4 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between gap-4">
                          {/* Left Content */}
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                'font-semibold truncate group-hover:text-blue-500 transition-colors',
                                isDark ? 'text-white' : 'text-slate-900'
                              )}
                            >
                              {bill.metadata.restaurantName || 'Bill'}
                            </p>

                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <p
                                className={cn(
                                  'text-sm',
                                  isDark ? 'text-slate-400' : 'text-slate-600'
                                )}
                              >
                                {new Date(bill.createdAt).toLocaleDateString(
                                  'en-US',
                                  {
                                    month: 'short',
                                    day: 'numeric',
                                    year:
                                      new Date(bill.createdAt).getFullYear() !==
                                      new Date().getFullYear()
                                        ? 'numeric'
                                        : undefined,
                                  }
                                )}
                              </p>

                              <Badge variant="default" className="text-xs">
                                {bill.items.length}{' '}
                                {bill.items.length === 1 ? 'item' : 'items'}
                              </Badge>
                            </div>
                          </div>

                          {/* Right Content */}
                          <div className="text-right flex flex-col items-end gap-2">
                            <p className="text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                              {formatCurrency(bill.totalDue || 0)}
                            </p>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleDelete(bill.id, e)}
                                className={cn(
                                  'p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100',
                                  isDark
                                    ? 'hover:bg-red-500/20 text-red-400'
                                    : 'hover:bg-red-100 text-red-600'
                                )}
                                title="Delete bill"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
