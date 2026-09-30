import React from 'react';

export type TabKey = 'Overview' | 'Transactions' | 'Analytics' | 'Budget Settings';

interface ViewTabsProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const ViewTabs: React.FC<ViewTabsProps> = ({ activeTab, onSelectTab }) => {
  const tabs: TabKey[] = ['Overview', 'Transactions', 'Analytics', 'Budget Settings'];

  return (
    <section className="max-w-7xl mx-auto px-4 mt-3">
      <div className="flex items-center space-x-1 p-1 bg-surface-container-low rounded-xl overflow-x-auto custom-scroll shadow-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onSelectTab(tab)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-semibold transition-all text-center whitespace-nowrap active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-primary bg-surface-container-lowest shadow-xs'
                  : 'text-on-surface-variant hover:text-primary font-medium'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </section>
  );
};
