import React, { useState, useId } from 'react';
import { Transaction, BudgetConfig, CategoryType } from '../types';
import { CATEGORY_META, detectCategoryFromText } from '../utils/aiCategorizer';
import confetti from 'canvas-confetti';

interface OverviewViewProps {
  transactions: Transaction[];
  budgetConfig: BudgetConfig;
  onOpenAdjustBudget: () => void;
  onExport: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (tx: Transaction) => void;
  onNavigateToTransactions: () => void;
  onNavigateToAnalytics: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  transactions,
  budgetConfig,
  onOpenAdjustBudget,
  onExport,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onNavigateToTransactions,
  onNavigateToAnalytics,
}) => {
  // Input fields for Smart Add
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState('2025-05-14');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Others');
  const [detectedInfo, setDetectedInfo] = useState<{
    text: string;
    isDetected: boolean;
  }>({
    text: '✨ Start typing above to see live categorization...',
    isDetected: false,
  });

  // Recent transactions filter & search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState<'All' | CategoryType>('All');
  const expenseDescId = useId();

  // Dynamic calculations based on current transactions
  const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);
  const remaining = budgetConfig.targetBudget - totalSpent;
  const utilizedPercent = Math.min(100, (totalSpent / budgetConfig.targetBudget) * 100);
  const remainingPercent = Math.max(0, 100 - utilizedPercent);
  const dailyAverage = transactions.length > 0 ? Math.round(totalSpent / 14) : 0; // May 1 - May 14 (14 days)
  const daysRemainingInMonth = 17; // May 14 to May 31
  const optimalBurnPerDay = daysRemainingInMonth > 0 ? Math.max(0, Math.round(remaining / daysRemainingInMonth)) : 0;

  // Category totals
  const categoryTotals: Record<CategoryType, number> = {
    Food: 0,
    Shopping: 0,
    Bills: 0,
    Travel: 0,
    Entertainment: 0,
    Others: 0,
  };

  transactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  // Find top category
  let topCategory: { name: string; amount: number; percent: number } = {
    name: 'Food & Dining',
    amount: 0,
    percent: 0,
  };

  let maxCatAmount = -1;
  (Object.keys(categoryTotals) as CategoryType[]).forEach((cat) => {
    const amt = categoryTotals[cat];
    if (amt > maxCatAmount) {
      maxCatAmount = amt;
      const displayName =
        cat === 'Food'
          ? 'Food & Dining'
          : cat === 'Shopping'
          ? 'Shopping & Retail'
          : cat === 'Bills'
          ? 'Bills & Utilities'
          : cat === 'Travel'
          ? 'Travel & Commute'
          : cat;
      topCategory = {
        name: displayName,
        amount: amt,
        percent: totalSpent > 0 ? Math.round((amt / totalSpent) * 1000) / 10 : 0,
      };
    }
  });

  // Handle typing in expense description
  const handleDescChange = (val: string) => {
    setDesc(val);
    if (!val.trim()) {
      setDetectedInfo({
        text: '✨ Start typing above to see live categorization...',
        isDetected: false,
      });
      return;
    }

    const { category, matchRule, extractedAmount } = detectCategoryFromText(val);
    setSelectedCategory(category);

    if (extractedAmount && !amount) {
      setAmount(extractedAmount.toString());
    }

    if (matchRule) {
      setDetectedInfo({
        text: `✨ Auto-detected: ${category} (matched: "${matchRule}")`,
        isDetected: true,
      });
    } else {
      setDetectedInfo({
        text: `✨ Exploring category: defaulting to ${category}`,
        isDetected: false,
      });
    }
  };

  const handleSelectPreset = (
    presetDesc: string,
    presetAmt: string,
    cat: CategoryType,
    rule: string
  ) => {
    setDesc(presetDesc);
    setAmount(presetAmt);
    setSelectedCategory(cat);
    setDetectedInfo({
      text: `✨ Auto-detected: ${cat} (matched: "${rule}")`,
      isDetected: true,
    });
  };

  const handleClearInput = () => {
    setDesc('');
    setAmount('');
    setSelectedCategory('Others');
    setDetectedInfo({
      text: '✨ Start typing above to see live categorization...',
      isDetected: false,
    });
  };

  const handleRecordExpense = () => {
    if (!desc.trim()) {
      alert('Please enter an expense description.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    onAddTransaction({
      description: desc.trim(),
      category: selectedCategory,
      amount: numAmount,
      date: date || new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      paymentMethod: 'Instant UPI',
      notes: 'Added via Smart Add',
      merchant: desc.trim().split(' ')[0],
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#004ac6', '#4b41e1', '#005a82', '#645efb'],
    });

    handleClearInput();
  };

  // Filter recent transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = filterCat === 'All' || t.category === filterCat;
    return matchesSearch && matchesCat;
  });

  const categoriesList: { key: CategoryType; label: string; color: string }[] = [
    { key: 'Food', label: 'Food & Dining', color: 'bg-primary' },
    { key: 'Shopping', label: 'Shopping & Retail', color: 'bg-secondary' },
    { key: 'Bills', label: 'Bills & Utilities', color: 'bg-error' },
    { key: 'Travel', label: 'Travel & Commute', color: 'bg-tertiary' },
    { key: 'Entertainment', label: 'Entertainment', color: 'bg-secondary-container' },
    { key: 'Others', label: 'Others & Misc', color: 'bg-outline' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 mt-4 space-y-5">
      {/* 1. HERO & BUDGET HEALTH SECTION */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 border border-surface-container-high shadow-xs relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-on-surface-variant font-medium">
                {budgetConfig.month} Monthly Budget
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-surface-container text-primary font-semibold">
                <span className="material-symbols-outlined text-[13px] mr-1">autorenew</span>{' '}
                Auto-sync
              </span>
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-on-surface tnum">
                ₹{totalSpent.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-on-surface-variant">
                of ₹{budgetConfig.targetBudget.toLocaleString('en-IN')} target
              </span>
            </div>
          </div>

          {/* Remaining Pill Metric */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container">
            <span className="text-xs text-on-surface-variant font-medium">Remaining to Spend</span>
            <span className="text-lg sm:text-xl text-primary font-bold tnum">
              ₹{Math.max(0, remaining).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Progress Bar & Warning Alert */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-on-surface-variant">
            <span>{utilizedPercent.toFixed(1)}% utilized</span>
            <span className="font-semibold text-tertiary">
              {remainingPercent.toFixed(1)}% left ({daysRemainingInMonth} days remaining)
            </span>
          </div>

          <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-primary-container via-secondary to-primary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, utilizedPercent)}%` }}
            />
          </div>

          <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-surface-container-highest text-on-surface font-medium border border-outline-variant/40">
              <span
                className="material-symbols-outlined text-[14px] text-tertiary mr-1.5"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
              {utilizedPercent >= 80 ? (
                <span className="text-red-700 font-bold">
                  ⚠️ {utilizedPercent.toFixed(0)}% spent - Threshold limit exceeded!
                </span>
              ) : (
                <span>⚠️ {utilizedPercent.toFixed(0)}% spent - Approaching 80% threshold</span>
              )}
            </div>
            <span className="text-xs text-on-surface-variant">
              Optimal burn: ₹{optimalBurnPerDay.toLocaleString('en-IN')}/day remaining
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-surface-container">
          <button
            onClick={onOpenAdjustBudget}
            className="flex items-center justify-center space-x-1.5 bg-surface-container-lowest border border-outline-variant py-2.5 px-3 rounded-lg text-on-surface text-sm font-semibold hover:bg-surface-container-low active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              tune
            </span>
            <span>Adjust Budget</span>
          </button>
          <button
            onClick={onExport}
            className="flex items-center justify-center space-x-1.5 bg-surface-container-low hover:bg-surface-container py-2.5 px-3 rounded-lg text-primary text-sm font-semibold active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export (CSV/PDF)</span>
          </button>
        </div>
      </div>

      {/* 2. KEY METRICS CARDS (Grid 2x2 / 4-col) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Spent */}
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 sm:p-4 border border-surface-container-high shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-on-surface-variant font-medium">Total Spent</span>
            <span className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </span>
          </div>
          <div className="text-xl sm:text-2xl text-on-surface font-bold tnum">
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 flex items-center text-xs text-error font-medium">
            <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>
            <span>+8.4% vs last mo</span>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 sm:p-4 border border-surface-container-high shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-on-surface-variant font-medium">Transactions</span>
            <span className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            </span>
          </div>
          <div className="text-xl sm:text-2xl text-on-surface font-bold tnum">
            {transactions.length}{' '}
            <span className="text-xs font-normal text-on-surface-variant">recorded</span>
          </div>
          <div className="mt-1 flex items-center text-xs text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-[14px] mr-0.5 text-primary">
              insights
            </span>
            <span>Avg 3.2 per day</span>
          </div>
        </div>

        {/* Top Category */}
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 sm:p-4 border border-surface-container-high shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-on-surface-variant font-medium">Top Category</span>
            <span className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[18px]">restaurant</span>
            </span>
          </div>
          <div className="text-lg sm:text-xl text-on-surface font-bold truncate">
            {topCategory.name}
          </div>
          <div className="mt-1 flex items-center text-xs text-on-surface font-medium tnum">
            <span className="text-primary font-bold mr-1">
              ₹{topCategory.amount.toLocaleString('en-IN')}
            </span>
            <span className="text-on-surface-variant">({topCategory.percent}%)</span>
          </div>
        </div>

        {/* Daily Average */}
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 sm:p-4 border border-surface-container-high shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-on-surface-variant font-medium">Daily Average</span>
            <span className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            </span>
          </div>
          <div className="text-xl sm:text-2xl text-on-surface font-bold tnum">
            ₹{dailyAverage.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-on-surface-variant">/day</span>
          </div>
          <div className="mt-1 flex items-center text-xs text-primary font-medium">
            <span className="material-symbols-outlined text-[14px] mr-0.5">check_circle</span>
            <span>Within safe pace</span>
          </div>
        </div>
      </div>

      {/* 3. SMART AUTO-CATEGORIZATION LIVE INTERACTIVE PLAYGROUND / QUICK ADD */}
      <div
        id="smart-add-section"
        className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 border-2 border-primary/20 shadow-sm relative overflow-hidden transition-all duration-200 hover:border-primary/40"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shadow-xs">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">Smart Add Expense</h3>
              <p className="text-xs text-on-surface-variant">
                Real-time NLP categorizer for Indian merchants
              </p>
            </div>
          </div>
          <span className="bg-surface-container text-primary text-[11px] px-2 py-1 rounded-full font-bold">
            AI Powered
          </span>
        </div>

        {/* Quick Presets */}
        <div className="mb-3">
          <label className="block text-xs text-on-surface-variant mb-1.5 font-medium">
            Try instant presets:
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 custom-scroll">
            <button
              type="button"
              onClick={() => handleSelectPreset('Swiggy Dinner', '650', 'Food', 'swiggy')}
              className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-xs whitespace-nowrap hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer font-medium"
            >
              🍔 Swiggy Dinner ₹650
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('Uber to Airport', '480', 'Travel', 'uber')}
              className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-xs whitespace-nowrap hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer font-medium"
            >
              🚗 Uber to Airport ₹480
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('Amazon Echo Dot', '2499', 'Shopping', 'amazon')}
              className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-xs whitespace-nowrap hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer font-medium"
            >
              📦 Amazon Echo ₹2,499
            </button>
            <button
              type="button"
              onClick={() =>
                handleSelectPreset('BESCOM Electricity Bill', '1820', 'Bills', 'electricity')
              }
              className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-xs whitespace-nowrap hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer font-medium"
            >
              ⚡ Electricity ₹1,820
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('Netflix UHD Plan', '649', 'Entertainment', 'netflix')}
              className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-xs whitespace-nowrap hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer font-medium"
            >
              🎬 Netflix UHD ₹649
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('Starbucks Reserve Coffee', '380', 'Food', 'starbucks')}
              className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-xs whitespace-nowrap hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer font-medium"
            >
              ☕ Starbucks ₹380
            </button>
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-3">
          <div>
            <label
              htmlFor={expenseDescId}
              className="block text-xs text-on-surface font-semibold mb-1"
            >
              Expense Description
            </label>
            <div className="relative">
              <input
                id={expenseDescId}
                type="text"
                value={desc}
                onChange={(e) => handleDescChange(e.target.value)}
                placeholder="Try typing: Swiggy order or Uber ride..."
                className="w-full h-11 pl-10 pr-20 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-on-surface-variant">
                edit_note
              </span>
              {desc && (
                <button
                  type="button"
                  onClick={handleClearInput}
                  className="absolute right-3 top-2.5 text-xs text-outline hover:text-on-surface px-1.5 py-0.5 rounded cursor-pointer font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* AI Detector Banner */}
          <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-surface-container-low border border-surface-container transition-all">
            <span
              className="material-symbols-outlined text-[18px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              magic_button
            </span>
            <span
              className={`text-xs sm:text-sm font-medium ${
                detectedInfo.isDetected ? 'text-primary font-semibold' : 'text-primary'
              }`}
            >
              {detectedInfo.text}
            </span>
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs text-on-surface-variant mb-1.5 font-medium">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Others'] as CategoryType[]
              ).map((cat) => {
                const meta = CATEGORY_META[cat];
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full border text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-surface-container text-primary font-bold shadow-xs scale-105'
                        : 'border-surface-container-high bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount + Date + Submit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div>
              <label className="block text-xs text-on-surface font-semibold mb-1">
                Amount (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-on-surface-variant font-semibold text-base">
                  ₹
                </span>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-11 pl-8 pr-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-base font-bold tnum focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-on-surface font-semibold mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleRecordExpense}
                className="w-full h-11 bg-primary text-on-primary rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 shadow-xs hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
                <span>Record Expense</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. INTERACTIVE SPENDING ANALYTICS & BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Category Breakdown (7 cols on Desktop) */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-container-high shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-on-surface">Category Spending</h3>
              <p className="text-xs text-on-surface-variant">
                May 1 - May 14 cumulative breakdown
              </p>
            </div>
            <button
              onClick={onNavigateToAnalytics}
              className="text-xs text-primary font-semibold cursor-pointer hover:underline"
            >
              Full Chart
            </button>
          </div>

          <div className="space-y-3.5">
            {categoriesList.map((catItem) => {
              const amt = categoryTotals[catItem.key];
              const pct = totalSpent > 0 ? (amt / totalSpent) * 100 : 0;
              return (
                <div key={catItem.key}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${catItem.color}`} />
                      <span className="font-medium text-on-surface">{catItem.label}</span>
                      <span className="text-on-surface-variant">{pct.toFixed(1)}%</span>
                    </div>
                    <span className="font-bold text-on-surface tnum">
                      ₹{amt.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full ${catItem.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Weekly Velocity Visualizer (5 cols on Desktop) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-container-high shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-on-surface">Weekly Velocity</h3>
              <p className="text-xs text-on-surface-variant">Daily cadence this week (₹)</p>
            </div>
            <span className="text-xs bg-surface-container text-primary px-2 py-0.5 rounded-md font-semibold">
              May 08 - 14
            </span>
          </div>

          {/* Interactive Weekly Histogram */}
          <div className="h-40 flex items-end justify-between gap-2 pt-6 pb-2 px-1">
            {[
              { day: 'Mon', val: 820, heightPct: 35, isPeak: false, isToday: false },
              { day: 'Tue', val: 1450, heightPct: 60, isPeak: false, isToday: false },
              { day: 'Wed', val: 940, heightPct: 42, isPeak: false, isToday: false },
              { day: 'Thu', val: 2199, heightPct: 85, isPeak: false, isToday: false },
              { day: 'Fri', val: 1125, heightPct: 50, isPeak: false, isToday: false },
              { day: 'Sat', val: 2480, heightPct: 95, isPeak: true, isToday: false },
              { day: 'Sun', val: 1125, heightPct: 52, isPeak: false, isToday: true },
            ].map((d) => (
              <div
                key={d.day}
                className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer"
              >
                <span className="text-[10px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity mb-1 tnum font-semibold">
                  ₹{d.val.toLocaleString('en-IN')}
                </span>
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${
                    d.isPeak
                      ? 'bg-primary'
                      : d.isToday
                      ? 'bg-primary-container'
                      : 'bg-surface-container group-hover:bg-primary-container'
                  }`}
                  style={{ height: `${d.heightPct}%` }}
                />
                <span
                  className={`text-xs mt-2 ${
                    d.isPeak
                      ? 'text-primary font-bold'
                      : d.isToday
                      ? 'text-primary-container font-semibold'
                      : 'text-on-surface-variant font-medium'
                  }`}
                >
                  {d.day}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-low p-2.5 rounded-xl flex items-center justify-between text-xs text-on-surface-variant mt-2">
            <span>
              Peak: <strong className="text-on-surface">Saturday (₹2,480)</strong>
            </span>
            <span className="text-primary font-medium">7-Day Avg: ₹1,445</span>
          </div>
        </div>
      </div>

      {/* 5. RECENT TRANSACTIONS & SEARCH / FILTER SECTION */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-container-high shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-on-surface">Recent Transactions</h3>
            <p className="text-xs text-on-surface-variant">
              Live audit ledger with instant receipt parsing
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-surface-container px-2.5 py-1 rounded-full text-on-surface font-semibold">
              {filteredTransactions.length} items shown
            </span>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search description, payee, or notes..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-on-surface-variant">
              search
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 custom-scroll">
            {(['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Entertainment'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  filterCat === cat
                    ? 'bg-primary text-on-primary font-bold shadow-xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Rows */}
        <div className="divide-y divide-surface-container space-y-1">
          {filteredTransactions.slice(0, 5).map((t) => {
            const meta = CATEGORY_META[t.category] || CATEGORY_META.Others;
            return (
              <div
                key={t.id}
                className="py-3 flex items-center justify-between group hover:bg-surface-container-low/50 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0 shadow-xs"
                    style={{ color: meta.color }}
                  >
                    <span className="material-symbols-outlined text-[20px]">{meta.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-on-surface truncate">
                        {t.description}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${meta.badgeBg}`}
                      >
                        {t.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-on-surface-variant mt-0.5">
                      <span>{t.time || t.date}</span>
                      {t.notes && (
                        <>
                          <span>•</span>
                          <span className="text-primary italic truncate max-w-[150px] sm:max-w-xs">
                            {t.notes.startsWith('Notes:') ? t.notes : `Notes: ${t.notes}`}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-bold text-on-surface tnum">
                      - ₹{t.amount.toLocaleString('en-IN')}.00
                    </span>
                    <div className="text-[11px] text-on-surface-variant">{t.paymentMethod}</div>
                  </div>

                  <div className="flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => onEditTransaction(t)}
                      className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => onDeleteTransaction(t)}
                      className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/40 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-4 pt-3 text-center border-t border-surface-container">
          <button
            type="button"
            onClick={onNavigateToTransactions}
            className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-container inline-flex items-center space-x-1 cursor-pointer"
          >
            <span>View all {transactions.length} transactions</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </main>
  );
};
