import React, { useState, useEffect } from 'react';
import { Transaction, BudgetConfig, AppNotification, UserProfile } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGET_CONFIG, INITIAL_NOTIFICATIONS } from './data/initialData';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { ViewTabs, TabKey } from './components/ViewTabs';
import { OverviewView } from './components/OverviewView';
import { TransactionsView } from './components/TransactionsView';
import { AnalyticsView } from './components/AnalyticsView';
import { BudgetSettingsView } from './components/BudgetSettingsView';
import { AdjustBudgetModal } from './components/AdjustBudgetModal';
import { EditTransactionModal } from './components/EditTransactionModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { BottomNav } from './components/BottomNav';
import { Toast, ToastData } from './components/Toast';
import { exportTransactionsToCSV } from './utils/exporter';

export default function App() {
  // Authentication state - Starts at Login Page if not signed in
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('spendwise_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<TabKey>('Overview');

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('spendwise_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TRANSACTIONS;
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  // Budget Config state
  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig>(() => {
    const saved = localStorage.getItem('spendwise_budget_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_BUDGET_CONFIG;
      }
    }
    return INITIAL_BUDGET_CONFIG;
  });

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('spendwise_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Modals state
  const [isAdjustBudgetOpen, setIsAdjustBudgetOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  // Toast state
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (message: string, type: ToastData['type'] = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('spendwise_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('spendwise_auth_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('spendwise_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('spendwise_budget_config', JSON.stringify(budgetConfig));
  }, [budgetConfig]);

  useEffect(() => {
    localStorage.setItem('spendwise_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Auth Handlers
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Signed out successfully', 'info');
  };

  // Handlers
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const created: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [created, ...prev]);
    showToast(`Recorded: ₹${created.amount.toLocaleString('en-IN')} for ${created.description}`);
  };

  const handleSaveEditedTransaction = (updated: Transaction) => {
    setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setEditingTransaction(null);
    showToast(`Updated "${updated.description}" successfully`);
  };

  const handleConfirmDelete = () => {
    if (!deletingTransaction) return;
    const desc = deletingTransaction.description;
    setTransactions((prev) => prev.filter((t) => t.id !== deletingTransaction.id));
    setDeletingTransaction(null);
    showToast(`Deleted "${desc}" successfully`, 'delete');
  };

  const handleSaveAdjustedBudget = (newTarget: number) => {
    setBudgetConfig((prev) => ({
      ...prev,
      targetBudget: newTarget,
    }));
    setIsAdjustBudgetOpen(false);
    showToast(`Monthly target updated to ₹${newTarget.toLocaleString('en-IN')}`);
  };

  const handleExport = () => {
    exportTransactionsToCSV(transactions, budgetConfig.month);
    showToast('Exported CSV statement to downloads');
  };

  const handleScrollToSmartAdd = () => {
    if (activeTab !== 'Overview') {
      setActiveTab('Overview');
      setTimeout(() => {
        const el = document.getElementById('smart-add-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          const input = document.getElementById('expense-desc') as HTMLInputElement | null;
          input?.focus();
        }
      }, 100);
    } else {
      const el = document.getElementById('smart-add-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        const input = document.getElementById('expense-desc') as HTMLInputElement | null;
        input?.focus();
      }
    }
  };

  const handleOpenNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  // If user is not authenticated, render Login Page in starting
  if (!currentUser) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toast toast={toast} />
      </>
    );
  }

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen pb-24 selection:bg-surface-container selection:text-primary">
      {/* Header */}
      <Header
        currentUser={currentUser}
        notifications={notifications}
        onOpenNotifications={handleOpenNotifications}
        onScrollToSmartAdd={handleScrollToSmartAdd}
        onLogout={handleLogout}
      />

      {/* View Selector Tabs */}
      <ViewTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Tab Screen Routing */}
      {activeTab === 'Overview' && (
        <OverviewView
          transactions={transactions}
          budgetConfig={budgetConfig}
          onOpenAdjustBudget={() => setIsAdjustBudgetOpen(true)}
          onExport={handleExport}
          onAddTransaction={handleAddTransaction}
          onEditTransaction={(tx) => setEditingTransaction(tx)}
          onDeleteTransaction={(tx) => setDeletingTransaction(tx)}
          onNavigateToTransactions={() => setActiveTab('Transactions')}
          onNavigateToAnalytics={() => setActiveTab('Analytics')}
        />
      )}

      {activeTab === 'Transactions' && (
        <TransactionsView
          transactions={transactions}
          onEditTransaction={(tx) => setEditingTransaction(tx)}
          onDeleteTransaction={(tx) => setDeletingTransaction(tx)}
          onOpenQuickAdd={handleScrollToSmartAdd}
          onExportCSV={handleExport}
        />
      )}

      {activeTab === 'Analytics' && (
        <AnalyticsView transactions={transactions} budgetConfig={budgetConfig} />
      )}

      {activeTab === 'Budget Settings' && (
        <BudgetSettingsView
          budgetConfig={budgetConfig}
          onUpdateBudgetConfig={(newConf) => {
            setBudgetConfig(newConf);
            showToast('Budget configuration updated!');
          }}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenQuickAdd={handleScrollToSmartAdd}
        onOpenBudgetModal={() => setIsAdjustBudgetOpen(true)}
      />

      {/* Modals */}
      <AdjustBudgetModal
        isOpen={isAdjustBudgetOpen}
        budgetConfig={budgetConfig}
        onClose={() => setIsAdjustBudgetOpen(false)}
        onSave={handleSaveAdjustedBudget}
      />

      <EditTransactionModal
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSave={handleSaveEditedTransaction}
      />

      <DeleteConfirmModal
        transaction={deletingTransaction}
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Floating Toast Notification */}
      <Toast toast={toast} />
    </div>
  );
}

