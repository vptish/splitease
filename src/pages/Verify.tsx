import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBillStore } from '../store/billStore';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/cn';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import Header from '../components/layout/Header';
import { formatCurrency } from '../lib/formatCurrency';
import { generateId } from '../lib/generateId';
import { Bill, BillItem } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

export default function Verify() {
  const navigate = useNavigate();
  const { createBill } = useBillStore();
  const { isDark } = useTheme();

  // Mock receipt data
  const [restaurantName, setRestaurantName] = useState('La Bella Trattoria');
  const [billDate, setBillDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [items, setItems] = useState<(BillItem & { subtotal?: number })[]>([
    {
      id: generateId(),
      name: 'Margherita Pizza',
      quantity: 2,
      unitPrice: 125,
      lineTotal: 250,
      splitGranularity: 'fraction',
      subtotal: 250,
    },
    {
      id: generateId(),
      name: 'Caesar Salad',
      quantity: 1,
      unitPrice: 85,
      lineTotal: 85,
      splitGranularity: 'fraction',
      subtotal: 85,
    },
    {
      id: generateId(),
      name: 'Sparkling Water',
      quantity: 3,
      unitPrice: 35,
      lineTotal: 105,
      splitGranularity: 'fraction',
      subtotal: 105,
    },
    {
      id: generateId(),
      name: 'Tiramisu',
      quantity: 2,
      unitPrice: 65,
      lineTotal: 130,
      splitGranularity: 'fraction',
      subtotal: 130,
    },
  ]);

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const tax = Math.round(subtotal * 0.15);
  const total = subtotal + tax;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: generateId(),
        name: 'New Item',
        quantity: 1,
        unitPrice: 0,
        lineTotal: 0,
        splitGranularity: 'fraction',
        subtotal: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: 'name' | 'quantity' | 'unitPrice',
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.lineTotal =
            Number(updated.quantity) * Number(updated.unitPrice);
          updated.subtotal = updated.lineTotal;
        }
        return updated;
      })
    );
  };

  const handleSplitBill = async () => {
    const newBillId = generateId();
    const bill: Bill = {
      id: newBillId,
      metadata: {
        restaurantName,
        date: billDate,
      },
      currency: 'ZAR',
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
        splitGranularity: item.splitGranularity,
      })),
      taxMode: 'exclusive',
      taxLines: [{ label: 'Tax', amount: tax }],
      serviceCharge: { present: false, taxed: false },
      tipIncluded: { present: false },
      totalDue: total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    createBill(bill);
    navigate(`/bill/${newBillId}`);
  };

  return (
    <div
      className={cn(
        'min-h-screen transition-colors duration-500',
        isDark ? 'bg-slate-950' : 'bg-white'
      )}
    >
      <Header showBack />

      <motion.div
        className="px-4 py-6 pb-24 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Receipt Image Placeholder */}
        <motion.div variants={itemVariants} className="mb-8">
          <GlassCard
            className={cn(
              'flex flex-col items-center justify-center h-64 gap-4',
              isDark ? 'bg-slate-800/30' : 'bg-slate-50/30'
            )}
          >
            <ImageIcon className="w-16 h-16 text-slate-400" />
            <div className="text-center">
              <p
                className={cn(
                  'font-medium mb-1',
                  isDark ? 'text-white' : 'text-slate-900'
                )}
              >
                Receipt Image
              </p>
              <p
                className={cn(
                  'text-sm',
                  isDark ? 'text-slate-400' : 'text-slate-600'
                )}
              >
                Extracted and verified
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Restaurant Details */}
        <motion.div variants={itemVariants} className="mb-6">
          <label
            className={cn(
              'block text-sm font-medium mb-2',
              isDark ? 'text-slate-300' : 'text-slate-700'
            )}
          >
            Restaurant Name
          </label>
          <Input
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="Restaurant name"
          />
        </motion.div>

        {/* Date */}
        <motion.div variants={itemVariants} className="mb-8">
          <label
            className={cn(
              'block text-sm font-medium mb-2',
              isDark ? 'text-slate-300' : 'text-slate-700'
            )}
          >
            Date
          </label>
          <Input
            type="date"
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
          />
        </motion.div>

        {/* Items List */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3
              className={cn(
                'text-lg font-semibold',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              Items
            </h3>
            <Button
              onClick={handleAddItem}
              size="sm"
              variant="secondary"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>

          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="space-y-2"
              >
                <GlassCard className="p-4">
                  <div className="grid grid-cols-12 gap-3 mb-3">
                    <Input
                      className="col-span-5"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(item.id, 'name', e.target.value)
                      }
                      placeholder="Item name"
                    />
                    <Input
                      className="col-span-2"
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          'quantity',
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="Qty"
                      min="1"
                    />
                    <Input
                      className="col-span-3"
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          'unitPrice',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="Price"
                      step="0.01"
                      min="0"
                    />
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className={cn(
                        'col-span-2 p-2 rounded-lg transition-colors',
                        isDark
                          ? 'hover:bg-red-500/20 text-red-400'
                          : 'hover:bg-red-100 text-red-600'
                      )}
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p
                      className={cn(
                        'text-sm',
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      )}
                    >
                      Subtotal:{' '}
                      <span
                        className={cn(
                          'font-semibold',
                          isDark ? 'text-white' : 'text-slate-900'
                        )}
                      >
                        {formatCurrency(item.lineTotal)}
                      </span>
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Summary */}
        <motion.div variants={itemVariants} className="mb-8">
          <GlassCard className="p-6 space-y-3">
            <div className="flex justify-between items-center">
              <p
                className={cn(
                  'text-sm',
                  isDark ? 'text-slate-400' : 'text-slate-600'
                )}
              >
                Subtotal
              </p>
              <p
                className={cn(
                  'font-medium',
                  isDark ? 'text-white' : 'text-slate-900'
                )}
              >
                {formatCurrency(subtotal)}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p
                className={cn(
                  'text-sm',
                  isDark ? 'text-slate-400' : 'text-slate-600'
                )}
              >
                Tax (15%)
              </p>
              <p
                className={cn(
                  'font-medium',
                  isDark ? 'text-white' : 'text-slate-900'
                )}
              >
                {formatCurrency(tax)}
              </p>
            </div>

            <div className={cn('pt-3 border-t', isDark ? 'border-slate-700/50' : 'border-slate-200')}>
              <div className="flex justify-between items-center">
                <p
                  className={cn(
                    'font-semibold',
                    isDark ? 'text-white' : 'text-slate-900'
                  )}
                >
                  Total
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* CTA Button */}
        <motion.div variants={itemVariants} className="fixed bottom-6 left-4 right-4 max-w-2xl mx-auto">
          <Button
            onClick={handleSplitBill}
            className="w-full py-4 text-lg font-semibold gap-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 shadow-xl shadow-blue-500/30"
          >
            Looks Good — Split It!
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
