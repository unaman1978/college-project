import React, { useState } from 'react';
import { BudgetConfig, CategoryType } from '../types';
import { CATEGORY_META } from '../utils/aiCategorizer';

interface BudgetSettingsViewProps {
  budgetConfig: BudgetConfig;
  onUpdateBudgetConfig: (updated: BudgetConfig) => void;
}

export const BudgetSettingsView: React.FC<BudgetSettingsViewProps> = ({
  budgetConfig,
  onUpdateBudgetConfig,
}) => {
  const [config, setConfig] = useState<BudgetConfig>({ ...budgetConfig });
  const [isSaved, setIsSaved] = useState(false);

  const handleCategoryLimitChange = (cat: CategoryType, val: number) => {
    setConfig((prev) => ({
      ...prev,
      categoryLimits: {
        ...prev.categoryLimits,
        [cat]: val,
      },
    }));
  };

  const handleSave = () => {
    onUpdateBudgetConfig(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const categories = Object.keys(config.categoryLimits) as CategoryType[];
  const sumCategoryLimits = Object.values(config.categoryLimits).reduce((a, b) => a + b, 0);

  return (
    <main className="max-w-7xl mx-auto px-4 mt-4 space-y-5">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-container-high shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Budget Configuration</h2>
            <p className="text-xs text-on-surface-variant">
              Manage overall monthly spending ceiling, threshold notifications, and category allocations
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 bg-primary text-on-primary hover:bg-primary-container px-4 py-2 rounded-xl text-xs font-semibold active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>{isSaved ? 'Saved Successfully!' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Budget & Thresholds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Monthly Target Box */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-xs space-y-4">
          <h3 className="text-base font-bold text-on-surface">Monthly Spending Target</h3>
          <p className="text-xs text-on-surface-variant">
            Set your overarching spending budget for {config.month}
          </p>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Monthly Limit (INR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-on-surface-variant font-bold text-lg">
                ₹
              </span>
              <input
                type="number"
                value={config.targetBudget}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, targetBudget: Number(e.target.value) }))
                }
                className="w-full h-12 pl-9 pr-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-xl font-extrabold tnum outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="bg-surface-container-low p-3.5 rounded-xl space-y-2">
            <span className="text-xs font-semibold text-on-surface">Quick Select Targets:</span>
            <div className="flex flex-wrap gap-2">
              {[35000, 40000, 45000, 50000, 60000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, targetBudget: amt }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    config.targetBudget === amt
                      ? 'bg-primary text-on-primary font-bold'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl">
            <div>
              <div className="text-xs font-bold text-on-surface">Bank Auto-Sync</div>
              <div className="text-[11px] text-on-surface-variant">
                Live link with HDFC Bank &amp; ICICI Card
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoSyncEnabled}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, autoSyncEnabled: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </div>

        {/* Threshold Alerts */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-xs space-y-4">
          <h3 className="text-base font-bold text-on-surface">Threshold Notifications</h3>
          <p className="text-xs text-on-surface-variant">
            Automated alerts when spending paces near limit
          </p>

          <div className="space-y-4">
            <div className="bg-surface-container-low p-3.5 rounded-xl space-y-2 border border-surface-container">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-on-surface">Warning Threshold</span>
                <span className="font-bold text-amber-700">
                  {config.warningThresholdPercent}% (₹
                  {Math.round(
                    (config.targetBudget * config.warningThresholdPercent) / 100
                  ).toLocaleString('en-IN')}
                  )
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={config.warningThresholdPercent}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    warningThresholdPercent: Number(e.target.value),
                  }))
                }
                className="w-full accent-primary cursor-pointer"
              />
              <span className="text-[11px] text-on-surface-variant block">
                Triggers notification in header bell and status badge.
              </span>
            </div>

            <div className="bg-surface-container-low p-3.5 rounded-xl space-y-2 border border-surface-container">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-on-surface">Critical Cut-off Threshold</span>
                <span className="font-bold text-error">
                  {config.criticalThresholdPercent}% (₹
                  {Math.round(
                    (config.targetBudget * config.criticalThresholdPercent) / 100
                  ).toLocaleString('en-IN')}
                  )
                </span>
              </div>
              <input
                type="range"
                min="80"
                max="100"
                step="1"
                value={config.criticalThresholdPercent}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    criticalThresholdPercent: Number(e.target.value),
                  }))
                }
                className="w-full accent-error cursor-pointer"
              />
              <span className="text-[11px] text-on-surface-variant block">
                Strict notification when approaching monthly limit ceiling.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Specific Allocations */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-on-surface">Category Allocations</h3>
            <p className="text-xs text-on-surface-variant">
              Fine-tune envelopes per category. Total allocated: ₹{sumCategoryLimits.toLocaleString('en-IN')}
            </p>
          </div>
          <span className="text-xs bg-surface-container text-primary font-semibold px-2.5 py-1 rounded-full">
            {sumCategoryLimits <= config.targetBudget
              ? '✓ Under Target Budget'
              : '⚠️ Exceeds Monthly Ceiling'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat];
            const limit = config.categoryLimits[cat];
            return (
              <div
                key={cat}
                className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center shrink-0"
                    style={{ color: meta.color }}
                  >
                    <span className="material-symbols-outlined text-[16px]">{meta.icon}</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface">{cat}</span>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-2 text-on-surface-variant text-xs font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={limit}
                    onChange={(e) => handleCategoryLimitChange(cat, Number(e.target.value))}
                    className="w-full h-9 pl-7 pr-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-bold tnum outline-none focus:border-primary"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};
