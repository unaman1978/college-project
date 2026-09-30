import React, { useState } from 'react';
import { Transaction, CategoryType } from '../types';
import { CATEGORY_META } from '../utils/aiCategorizer';

interface TransactionsViewProps {
  transactions: Transaction[];
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (tx: Transaction) => void;
  onOpenQuickAdd: () => void;
  onExportCSV: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
  onOpenQuickAdd,
  onExportCSV,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<'All' | CategoryType>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter
  const filtered = transactions.filter((t) => {
    const matchesCat = selectedCat === 'All' || t.category === selectedCat;
    const q = search.toLowerCase();
    const matchesSearch =
      t.description.toLowerCase().includes(q) ||
      (t.notes && t.notes.toLowerCase().includes(q)) ||
      (t.merchant && t.merchant.toLowerCase().includes(q)) ||
      t.paymentMethod.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return b.date.localeCompare(a.date);
    if (sortBy === 'oldest') return a.date.localeCompare(b.date);
    if (sortBy === 'highest') return b.amount - a.amount;
    if (sortBy === 'lowest') return a.amount - b.amount;
    return 0;
  });

  const totalFilteredAmount = sorted.reduce((acc, t) => acc + t.amount, 0);
  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="max-w-7xl mx-auto px-4 mt-4 space-y-4">
      {/* Top Banner / Summary Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-container-high shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Transactions Ledger</h2>
            <p className="text-xs text-on-surface-variant">
              Complete historical log with instant merchant audit details
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onExportCSV}
              className="flex items-center space-x-1.5 bg-surface-container-low hover:bg-surface-container px-3 py-2 rounded-xl text-primary text-xs font-semibold active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export CSV</span>
            </button>
            <button
              onClick={onOpenQuickAdd}
              className="flex items-center space-x-1.5 bg-primary text-on-primary hover:bg-primary-container px-3.5 py-2 rounded-xl text-xs font-semibold active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-surface-container">
          <div className="bg-surface-container-low p-2.5 rounded-xl">
            <span className="text-[11px] text-on-surface-variant block">Filtered Items</span>
            <span className="text-lg font-bold text-on-surface tnum">{sorted.length}</span>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-xl">
            <span className="text-[11px] text-on-surface-variant block">Filtered Volume</span>
            <span className="text-lg font-bold text-primary tnum">
              ₹{totalFilteredAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-xl">
            <span className="text-[11px] text-on-surface-variant block">Avg Transaction</span>
            <span className="text-lg font-bold text-on-surface tnum">
              ₹{sorted.length > 0 ? Math.round(totalFilteredAmount / sorted.length).toLocaleString('en-IN') : 0}
            </span>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-xl">
            <span className="text-[11px] text-on-surface-variant block">Active Filter</span>
            <span className="text-sm font-bold text-tertiary truncate block">
              {selectedCat}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container-high shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by merchant, keyword, payment method, or notes..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            <span className="material-symbols-outlined absolute left-3 top-3 text-[18px] text-on-surface-variant">
              search
            </span>
          </div>

          <div className="sm:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-11 px-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs sm:text-sm font-semibold text-on-surface outline-none focus:border-primary"
            >
              <option value="newest">Sort: Date (Newest first)</option>
              <option value="oldest">Sort: Date (Oldest first)</option>
              <option value="highest">Sort: Amount (High to Low)</option>
              <option value="lowest">Sort: Amount (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 custom-scroll">
          {(['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Others'] as const).map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCat(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedCat === cat
                    ? 'bg-primary text-on-primary font-bold shadow-xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Ledger Table / List */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-container-high shadow-xs">
        {paginated.length === 0 ? (
          <div className="py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">
              search_off
            </span>
            <p className="text-sm font-bold text-on-surface mt-2">No transactions found</p>
            <p className="text-xs text-on-surface-variant">
              Try adjusting your search query or category filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-container space-y-1">
            {paginated.map((t) => {
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
                        <span>
                          {t.date} • {t.time}
                        </span>
                        {t.notes && (
                          <>
                            <span>•</span>
                            <span className="text-primary italic truncate max-w-[200px]">
                              {t.notes}
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
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-surface-container">
            <span className="text-xs text-on-surface-variant">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 text-xs rounded-lg border border-outline-variant bg-surface-container-lowest disabled:opacity-40 cursor-pointer font-medium"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 text-xs rounded-lg border border-outline-variant bg-surface-container-lowest disabled:opacity-40 cursor-pointer font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
