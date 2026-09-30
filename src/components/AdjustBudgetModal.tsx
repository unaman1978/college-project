import React, { useState } from 'react';
import { BudgetConfig } from '../types';

interface AdjustBudgetModalProps {
  isOpen: boolean;
  budgetConfig: BudgetConfig;
  onClose: () => void;
  onSave: (newBudget: number) => void;
}

export const AdjustBudgetModal: React.FC<AdjustBudgetModalProps> = ({
  isOpen,
  budgetConfig,
  onClose,
  onSave,
}) => {
  const [budgetVal, setBudgetVal] = useState<number>(budgetConfig.targetBudget);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-5 border border-surface-container-high shadow-2xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-on-surface">Adjust Target Budget</h3>
          <button
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg cursor-pointer"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <p className="text-sm text-on-surface-variant mb-4">
          Set your monthly financial limit for {budgetConfig.month}. Alerts trigger when you reach {budgetConfig.warningThresholdPercent}%.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              New Monthly Target (INR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-on-surface-variant text-base font-semibold">
                ₹
              </span>
              <input
                type="number"
                value={budgetVal}
                onChange={(e) => setBudgetVal(Number(e.target.value))}
                className="w-full h-11 pl-8 pr-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-lg font-bold tnum outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="bg-surface-container-low p-3 rounded-xl">
            <span className="text-xs font-medium text-on-surface-variant block mb-2">
              Quick Select Targets:
            </span>
            <div className="flex gap-2">
              {[40000, 45000, 50000, 60000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBudgetVal(preset)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                    budgetVal === preset
                      ? 'bg-primary text-on-primary font-bold'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  ₹{preset.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-5">
          <button
            type="button"
            className="py-2.5 rounded-xl border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container-low transition-colors cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container active:scale-95 transition-all shadow-xs cursor-pointer"
            onClick={() => onSave(budgetVal)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
