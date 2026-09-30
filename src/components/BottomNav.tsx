import React from 'react';
import { TabKey } from './ViewTabs';

interface BottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  onOpenQuickAdd: () => void;
  onOpenBudgetModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickAdd,
  onOpenBudgetModal,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 py-2 h-16 bg-surface-container-lowest border-t border-outline-variant/60 shadow-lg">
      {/* Destination 1: Home (Overview) */}
      <button
        onClick={() => onSelectTab('Overview')}
        className={`flex flex-col items-center justify-center py-1 transition-transform duration-150 active:scale-95 cursor-pointer ${
          activeTab === 'Overview'
            ? 'text-primary font-bold'
            : 'text-on-surface-variant hover:text-primary font-medium'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={activeTab === 'Overview' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          dashboard
        </span>
        <span className="text-[11px] mt-0.5">Home</span>
      </button>

      {/* Destination 2: Transactions */}
      <button
        onClick={() => onSelectTab('Transactions')}
        className={`flex flex-col items-center justify-center py-1 transition-colors duration-150 active:scale-95 cursor-pointer ${
          activeTab === 'Transactions'
            ? 'text-primary font-bold'
            : 'text-on-surface-variant hover:text-primary font-medium'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={activeTab === 'Transactions' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          receipt_long
        </span>
        <span className="text-[11px] mt-0.5">Transactions</span>
      </button>

      {/* Destination 3: Add (Primary Quick Action) */}
      <button
        onClick={onOpenQuickAdd}
        className="flex flex-col items-center justify-center py-1 text-primary hover:text-primary-container transition-transform duration-150 active:scale-90 cursor-pointer"
      >
        <span
          className="material-symbols-outlined text-[28px] text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          add_circle
        </span>
        <span className="text-[11px] mt-0.5 font-bold text-primary">Add</span>
      </button>

      {/* Destination 4: Analytics */}
      <button
        onClick={() => onSelectTab('Analytics')}
        className={`flex flex-col items-center justify-center py-1 transition-colors duration-150 active:scale-95 cursor-pointer ${
          activeTab === 'Analytics'
            ? 'text-primary font-bold'
            : 'text-on-surface-variant hover:text-primary font-medium'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={activeTab === 'Analytics' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          insights
        </span>
        <span className="text-[11px] mt-0.5">Analytics</span>
      </button>

      {/* Destination 5: Budget */}
      <button
        onClick={() => {
          onSelectTab('Budget Settings');
          onOpenBudgetModal();
        }}
        className={`flex flex-col items-center justify-center py-1 transition-colors duration-150 active:scale-95 cursor-pointer ${
          activeTab === 'Budget Settings'
            ? 'text-primary font-bold'
            : 'text-on-surface-variant hover:text-primary font-medium'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={activeTab === 'Budget Settings' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          account_balance_wallet
        </span>
        <span className="text-[11px] mt-0.5">Budget</span>
      </button>
    </nav>
  );
};
