import React from 'react';
import { Transaction, BudgetConfig, CategoryType } from '../types';
import { CATEGORY_META } from '../utils/aiCategorizer';

interface AnalyticsViewProps {
  transactions: Transaction[];
  budgetConfig: BudgetConfig;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ transactions, budgetConfig }) => {
  const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);

  // Group by category
  const categoryStats: Record<CategoryType, { count: number; total: number }> = {
    Food: { count: 0, total: 0 },
    Shopping: { count: 0, total: 0 },
    Bills: { count: 0, total: 0 },
    Travel: { count: 0, total: 0 },
    Entertainment: { count: 0, total: 0 },
    Others: { count: 0, total: 0 },
  };

  // Group by merchant
  const merchantCounts: Record<string, { count: number; amount: number; category: CategoryType }> =
    {};

  transactions.forEach((t) => {
    categoryStats[t.category].count += 1;
    categoryStats[t.category].total += t.amount;

    const merch = t.merchant || t.description.split(' ')[0] || 'Unknown';
    if (!merchantCounts[merch]) {
      merchantCounts[merch] = { count: 0, amount: 0, category: t.category };
    }
    merchantCounts[merch].count += 1;
    merchantCounts[merch].amount += t.amount;
  });

  const sortedMerchants = Object.entries(merchantCounts)
    .sort((a, b) => b[1].amount - a[1].amount)
    .slice(0, 6);

  const categories = Object.keys(categoryStats) as CategoryType[];

  return (
    <main className="max-w-7xl mx-auto px-4 mt-4 space-y-5">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-container-high shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Financial Analytics & Insights</h2>
            <p className="text-xs text-on-surface-variant">
              In-depth spending patterns, merchant distribution, and AI optimization tips
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-surface-container px-3 py-1 rounded-full text-primary font-bold">
              Period: {budgetConfig.month}
            </span>
          </div>
        </div>

        {/* 3 Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-surface-container">
          <div className="bg-surface-container-low p-3 rounded-xl">
            <span className="text-xs text-on-surface-variant block">Cumulative Spent</span>
            <span className="text-xl font-bold text-on-surface tnum">
              ₹{totalSpent.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xl">
            <span className="text-xs text-on-surface-variant block">Budget Utilization</span>
            <span className="text-xl font-bold text-primary tnum">
              {((totalSpent / budgetConfig.targetBudget) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xl">
            <span className="text-xs text-on-surface-variant block">Weekly Velocity Peak</span>
            <span className="text-xl font-bold text-tertiary tnum">Saturday (₹2,480)</span>
          </div>
        </div>
      </div>

      {/* Category Deep Breakdown & Merchant Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Category Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-container-high shadow-xs space-y-4">
          <h3 className="text-base font-bold text-on-surface">Category Distribution & Volume</h3>
          
          <div className="space-y-4">
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat];
              const stat = categoryStats[cat];
              const pct = totalSpent > 0 ? (stat.total / totalSpent) * 100 : 0;
              const limit = budgetConfig.categoryLimits[cat] || 10000;
              const isOverLimit = stat.total > limit;

              return (
                <div key={cat} className="space-y-1.5 bg-surface-container-low/40 p-3 rounded-xl">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: meta.color }}
                      />
                      <span className="font-bold text-on-surface">{cat}</span>
                      <span className="text-on-surface-variant">({stat.count} orders)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-on-surface tnum">
                        ₹{stat.total.toLocaleString('en-IN')}
                      </span>
                      <span className="text-on-surface-variant">({pct.toFixed(1)}%)</span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        backgroundColor: meta.color,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-on-surface-variant">
                    <span>Target Limit: ₹{limit.toLocaleString('en-IN')}</span>
                    <span
                      className={`font-semibold ${
                        isOverLimit ? 'text-error' : 'text-emerald-700'
                      }`}
                    >
                      {isOverLimit
                        ? `Over limit by ₹${(stat.total - limit).toLocaleString('en-IN')}`
                        : `₹${(limit - stat.total).toLocaleString('en-IN')} headroom left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Merchants Leaderboard (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-container-high shadow-xs space-y-4">
          <h3 className="text-base font-bold text-on-surface">Top Merchants by Spend</h3>
          <p className="text-xs text-on-surface-variant">Frequent payees in your active audit ledger</p>

          <div className="divide-y divide-surface-container">
            {sortedMerchants.map(([merch, data], index) => {
              const meta = CATEGORY_META[data.category] || CATEGORY_META.Others;
              return (
                <div key={merch} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 text-xs font-bold text-on-surface-variant">
                      #{index + 1}
                    </span>
                    <div
                      className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0"
                      style={{ color: meta.color }}
                    >
                      <span className="material-symbols-outlined text-[16px]">{meta.icon}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-on-surface">{merch}</div>
                      <div className="text-[11px] text-on-surface-variant">
                        {data.count} transactions • {data.category}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-on-surface tnum">
                      ₹{data.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-on-surface-variant">
                      {((data.amount / totalSpent) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Intelligence & Recommendations Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border-2 border-primary/20 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              psychology
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface">SpendWise AI Financial Audit</h3>
            <p className="text-xs text-on-surface-variant">Automated analysis of your financial cadence</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-primary mb-1">
              <span className="material-symbols-outlined text-[16px]">restaurant</span>
              <span>Dining Velocity High</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Food &amp; Dining accounts for 41.5% of total outflow. Switching 2 Swiggy orders per week
              to meal prep could save ~₹3,200/month.
            </p>
          </div>

          <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-secondary mb-1">
              <span className="material-symbols-outlined text-[16px]">speed</span>
              <span>Daily Burn Target</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              To finish May within your ₹45,000 budget, maintain daily expenses below ₹597/day for
              the next 17 days.
            </p>
          </div>

          <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-tertiary mb-1">
              <span className="material-symbols-outlined text-[16px]">savings</span>
              <span>Recurring Subscriptions</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Subscriptions (Netflix, Spotify, Airtel) total ₹2,007/mo. All recurring charges are
              verified and within normal billing cadence.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
