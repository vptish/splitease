import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Plus, X, Check } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBillStore } from '../store/billStore';
import { useSplitStore } from '../store/splitStore';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/cn';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import Header from '../components/layout/Header';
import { formatCurrency } from '../lib/formatCurrency';
import { ItemSplitMode } from '../types';

type Step = 'people' | 'split' | 'tip' | 'summary';

const stepVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
};

export default function BillWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bills } = useBillStore();
  const {
    session,
    people,
    itemAssignments,
    initSession,
    addPerson,
    removePerson,
    assignItem,
    computeTotals,
  } = useSplitStore();

  const bill = bills.find((b) => b.id === id);
  const { isDark } = useTheme();

  const [step, setStep] = useState<Step>('people');
  const [newPersonName, setNewPersonName] = useState('');
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedSplitMode, setSelectedSplitMode] =
    useState<ItemSplitMode>('equal');
  const [tipPercent, setTipPercent] = useState(0);
  const [customTip, setCustomTip] = useState('');

  useEffect(() => {
    if (bill) {
      initSession(bill.id, bill);
    }
  }, [bill, initSession]);

  if (!bill || !session) {
    return (
      <div
        className={cn(
          'min-h-screen flex items-center justify-center',
          isDark ? 'bg-slate-950' : 'bg-white'
        )}
      >
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const steps = [
    { id: 'people', label: 'People', number: 1 },
    { id: 'split', label: 'Split', number: 2 },
    { id: 'tip', label: 'Tip', number: 3 },
    { id: 'summary', label: 'Summary', number: 4 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step) || 0;

  const handleAddPerson = () => {
    if (newPersonName.trim() && people.length < 8) {
      addPerson(newPersonName);
      setNewPersonName('');
      setShowAddPerson(false);
    }
  };

  const handleNext = () => {
    const stepMap: Record<Step, Step> = {
      people: 'split',
      split: 'tip',
      tip: 'summary',
      summary: 'summary',
    };
    if (step !== 'summary') {
      setStep(stepMap[step]);
    }
  };

  const handleBack = () => {
    const stepMap: Record<Step, Step> = {
      people: 'people',
      split: 'people',
      tip: 'split',
      summary: 'tip',
    };
    setStep(stepMap[step]);
  };

  const handleItemClick = (itemId: string) => {
    setSelectedItemId(itemId);
    setSelectedSplitMode('equal');
  };

  const handleAssignItem = (itemId: string, personId: string) => {
    assignItem(itemId, selectedSplitMode, [{ personId, share: 1 }]);
  };

  const totals = computeTotals(bill);

  return (
    <div
      className={cn(
        'min-h-screen transition-colors duration-500',
        isDark ? 'bg-slate-950' : 'bg-white'
      )}
    >
      <Header showBack />

      <div className="px-4 py-6 pb-24 max-w-2xl mx-auto">
        {/* Restaurant Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1
            className={cn(
              'text-3xl font-bold mb-2',
              isDark ? 'text-white' : 'text-slate-900'
            )}
          >
            {bill.metadata.restaurantName || 'Bill'}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="default">{formatCurrency(bill.totalDue || 0)}</Badge>
            <Badge variant="default">
              {bill.items.length} {bill.items.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center gap-1 mb-4">
            {steps.map((s, idx) => (
              <div
                key={s.id}
                className="flex items-center flex-1"
                onClick={() => setStep(s.id as Step)}
              >
                <button
                  className={cn(
                    'w-8 h-8 rounded-full font-semibold text-sm flex items-center justify-center transition-all cursor-pointer',
                    idx <= currentStepIndex
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
                      : isDark
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-200 text-slate-600'
                  )}
                >
                  {idx < currentStepIndex ? <Check className="w-4 h-4" /> : s.number}
                </button>

                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-1 mx-2 rounded-full transition-colors',
                      idx < currentStepIndex
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                        : isDark
                          ? 'bg-slate-800'
                          : 'bg-slate-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            {steps.map((s) => (
              <p
                key={s.id}
                className={cn(
                  'text-xs font-medium transition-colors',
                  step === s.id
                    ? 'text-blue-500'
                    : isDark
                      ? 'text-slate-400'
                      : 'text-slate-600'
                )}
              >
                {s.label}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: People */}
          {step === 'people' && (
            <motion.div
              key="people"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="space-y-4">
                {/* People Grid */}
                <GlassCard className="p-6">
                  <div className="grid grid-cols-4 gap-4">
                    {people.map((person) => (
                      <motion.div
                        key={person.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="relative group">
                          <Avatar
                            initials={person.name?.charAt(0).toUpperCase()}
                            color={person.color}
                            className="w-16 h-16 cursor-pointer transition-transform group-hover:scale-105"
                          />
                          <button
                            onClick={() => removePerson(person.id)}
                            className={cn(
                              'absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity',
                              'bg-red-500 text-white shadow-lg'
                            )}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p
                          className={cn(
                            'text-sm font-medium text-center truncate',
                            isDark ? 'text-white' : 'text-slate-900'
                          )}
                        >
                          {person.name}
                        </p>
                      </motion.div>
                    ))}

                    {people.length < 8 && (
                      <motion.button
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={() => setShowAddPerson(true)}
                        className={cn(
                          'flex flex-col items-center gap-2 p-2 rounded-lg transition-colors',
                          isDark
                            ? 'hover:bg-slate-800'
                            : 'hover:bg-slate-100'
                        )}
                      >
                        <div
                          className={cn(
                            'w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-colors',
                            isDark
                              ? 'border-slate-600 hover:border-blue-500'
                              : 'border-slate-300 hover:border-blue-500'
                          )}
                        >
                          <Plus className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-xs text-slate-500">Add</p>
                      </motion.button>
                    )}
                  </div>
                </GlassCard>

                {/* Add Person Form */}
                <AnimatePresence>
                  {showAddPerson && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <GlassCard className="p-4">
                        <div className="flex gap-2">
                          <Input
                            value={newPersonName}
                            onChange={(e) => setNewPersonName(e.target.value)}
                            placeholder="Person name"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddPerson();
                            }}
                            autoFocus
                          />
                          <Button
                            onClick={handleAddPerson}
                            size="sm"
                            className="gap-2"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => {
                              setShowAddPerson(false);
                              setNewPersonName('');
                            }}
                            size="sm"
                            variant="secondary"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </GlassCard>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p
                  className={cn(
                    'text-sm text-center',
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  )}
                >
                  {people.length === 0
                    ? 'Add people to get started'
                    : `${people.length} ${people.length === 1 ? 'person' : 'people'} added`}
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Split Items */}
          {step === 'split' && (
            <motion.div
              key="split"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="space-y-3">
                {bill.items.map((item) => (
                  <motion.div key={item.id} layout>
                    <GlassCard
                      className={cn(
                        'p-4 cursor-pointer transition-all',
                        selectedItemId === item.id
                          ? 'ring-2 ring-blue-500 shadow-lg'
                          : 'hover:shadow-md'
                      )}
                      onClick={() => handleItemClick(item.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <p
                            className={cn(
                              'font-semibold',
                              isDark ? 'text-white' : 'text-slate-900'
                            )}
                          >
                            {item.name}
                          </p>
                          <p
                            className={cn(
                              'text-sm mt-1',
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            )}
                          >
                            {item.quantity}x {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                        <p className="text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                          {formatCurrency(item.lineTotal)}
                        </p>
                      </div>

                      <AnimatePresence>
                        {selectedItemId === item.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t pt-4 space-y-3"
                          >
                            {/* Split Mode Selector */}
                            <div className="flex gap-2">
                              {['one', 'equal', 'custom'].map((mode) => (
                                <button
                                  key={mode}
                                  onClick={() =>
                                    setSelectedSplitMode(
                                      mode as ItemSplitMode
                                    )
                                  }
                                  className={cn(
                                    'flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all',
                                    selectedSplitMode === mode
                                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
                                      : isDark
                                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                  )}
                                >
                                  {mode === 'one' && 'One Person'}
                                  {mode === 'equal' && 'Split Equally'}
                                  {mode === 'custom' && 'Custom'}
                                </button>
                              ))}
                            </div>

                            {/* People Assignment */}
                            <div className="grid grid-cols-3 gap-2">
                              {people.map((person) => (
                                <button
                                  key={person.id}
                                  onClick={() =>
                                    handleAssignItem(item.id, person.id)
                                  }
                                  className={cn(
                                    'flex flex-col items-center gap-2 p-2 rounded-lg transition-all',
                                    itemAssignments.some(
                                      (a) => a.itemId === item.id && a.assignments.some(s => s.personId === person.id)
                                    )
                                      ? 'ring-2 ring-blue-500 bg-blue-500/10'
                                      : isDark
                                        ? 'hover:bg-slate-800'
                                        : 'hover:bg-slate-100'
                                  )}
                                >
                                  <Avatar
                                    initials={person.name?.charAt(0).toUpperCase()}
                                    color={person.color}
                                    className="w-10 h-10"
                                  />
                                  <p className="text-xs font-medium">
                                    {(person.name || '').split(' ')[0]}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Assigned People Display */}
                      {(() => {
                        const assignment = itemAssignments.find(a => a.itemId === item.id);
                        const assignedPeople = assignment?.assignments.map(a => a.personId) || [];
                        return assignedPeople.length > 0 ? (
                          <div className="mt-3 flex items-center gap-2 flex-wrap">
                            {assignedPeople.map((personId) => {
                              const person = people.find((p) => p.id === personId);
                              return person ? (
                                <motion.div
                                  key={personId}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                >
                                  <Badge variant="default" className="gap-1">
                                    <Avatar
                                      initials={person.name?.charAt(0).toUpperCase()}
                                      color={person.color}
                                      className="w-3 h-3"
                                    />
                                    {(person.name || '').split(' ')[0]}
                                  </Badge>
                                </motion.div>
                              ) : null;
                            })}
                          </div>
                        ) : null;
                      })()}
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Tip */}
          {step === 'tip' && (
            <motion.div
              key="tip"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <p
                    className={cn(
                      'text-sm font-medium mb-4',
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    )}
                  >
                    Subtotal: {formatCurrency((bill.items.reduce((sum, item) => sum + item.lineTotal, 0)) + (bill.taxLines.reduce((sum, tax) => sum + tax.amount, 0)))}
                  </p>

                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[0, 10, 15, 20].map((percent) => (
                      <button
                        key={percent}
                        onClick={() => {
                          setTipPercent(percent);
                          setCustomTip('');
                        }}
                        className={cn(
                          'py-3 px-2 rounded-lg font-semibold text-sm transition-all',
                          tipPercent === percent && customTip === ''
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg scale-105'
                            : isDark
                              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        )}
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label
                      className={cn(
                        'text-sm font-medium',
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      )}
                    >
                      Or enter custom amount
                    </label>
                    <Input
                      type="number"
                      value={customTip}
                      onChange={(e) => {
                        setCustomTip(e.target.value);
                        setTipPercent(0);
                      }}
                      placeholder="Enter tip amount"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-700/30">
                    <div className="flex justify-between items-center mb-2">
                      <p
                        className={cn(
                          'text-sm',
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        )}
                      >
                        Tip Amount
                      </p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                        {(() => {
                          const subtotal = bill.items.reduce((sum, item) => sum + item.lineTotal, 0);
                          const taxes = bill.taxLines.reduce((sum, tax) => sum + tax.amount, 0);
                          const tipAmount = customTip ? parseFloat(customTip) : (subtotal + taxes) * (tipPercent / 100);
                          return formatCurrency(tipAmount);
                        })()}
                      </p>
                    </div>
                    <p
                      className={cn(
                        'text-xs',
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      )}
                    >
                      New total:{' '}
                      {(() => {
                        const subtotal = bill.items.reduce((sum, item) => sum + item.lineTotal, 0);
                        const taxes = bill.taxLines.reduce((sum, tax) => sum + tax.amount, 0);
                        const tipAmount = customTip ? parseFloat(customTip) : (subtotal + taxes) * (tipPercent / 100);
                        return formatCurrency(subtotal + taxes + tipAmount);
                      })()}
                    </p>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}

          {/* Step 4: Summary */}
          {step === 'summary' && (
            <motion.div
              key="summary"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="space-y-3">
                {people.map((person, idx) => {
                  const personTotal = totals.find((p) => p.personId === person.id) || {
                    personId: person.id,
                    subtotal: 0,
                    taxes: {},
                    service: 0,
                    tip: 0,
                    total: 0,
                  };

                  return (
                    <motion.div
                      key={person.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <GlassCard className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              initials={person.name?.charAt(0).toUpperCase()}
                              color={person.color}
                              className="w-12 h-12"
                            />
                            <div>
                              <p
                                className={cn(
                                  'font-semibold',
                                  isDark ? 'text-white' : 'text-slate-900'
                                )}
                              >
                                {person.name}
                              </p>
                              <p
                                className={cn(
                                  'text-sm',
                                  isDark ? 'text-slate-400' : 'text-slate-600'
                                )}
                              >
                                {itemAssignments.filter(
                                  (a) => a.assignments.some(s => s.personId === person.id)
                                ).length}{' '}
                                items
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                              {formatCurrency(personTotal.total)}
                            </p>
                          </div>
                        </div>

                        <div
                          className={cn(
                            'pt-4 border-t',
                            isDark ? 'border-slate-700/50' : 'border-slate-200'
                          )}
                        >
                          <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                            <div>
                              <p
                                className={cn(
                                  '',
                                  isDark ? 'text-slate-400' : 'text-slate-600'
                                )}
                              >
                                Subtotal
                              </p>
                              <p
                                className={cn(
                                  'font-semibold',
                                  isDark ? 'text-white' : 'text-slate-900'
                                )}
                              >
                                {formatCurrency(personTotal.subtotal)}
                              </p>
                            </div>
                            <div>
                              <p
                                className={cn(
                                  '',
                                  isDark ? 'text-slate-400' : 'text-slate-600'
                                )}
                              >
                                Tax
                              </p>
                              <p
                                className={cn(
                                  'font-semibold',
                                  isDark ? 'text-white' : 'text-slate-900'
                                )}
                              >
                                {formatCurrency(Object.values(personTotal.taxes).reduce((a, b) => a + b, 0))}
                              </p>
                            </div>
                            <div>
                              <p
                                className={cn(
                                  '',
                                  isDark ? 'text-slate-400' : 'text-slate-600'
                                )}
                              >
                                Tip
                              </p>
                              <p
                                className={cn(
                                  'font-semibold',
                                  isDark ? 'text-white' : 'text-slate-900'
                                )}
                              >
                                {formatCurrency(personTotal.tip)}
                              </p>
                            </div>
                          </div>

                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Share
                          </Button>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-4 right-4 max-w-2xl mx-auto flex gap-3"
        >
          {step !== 'people' && (
            <Button
              onClick={handleBack}
              variant="secondary"
              className="flex-1 py-3 text-base"
            >
              Back
            </Button>
          )}
          {step !== 'summary' && (
            <Button
              onClick={handleNext}
              disabled={people.length === 0 && step === 'people'}
              variant="primary"
              className="flex-1 py-3 text-base gap-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 shadow-xl shadow-blue-500/30"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
          {step === 'summary' && (
            <Button
              onClick={() => navigate('/')}
              variant="primary"
              className="flex-1 py-3 text-base gap-2 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 shadow-xl shadow-emerald-500/30"
            >
              <Check className="w-5 h-5" />
              Done
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
