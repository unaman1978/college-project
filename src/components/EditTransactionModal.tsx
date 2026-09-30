import React, { useState, useEffect } from 'react';
import { Transaction, CategoryType } from '../types';
import { CATEGORY_META } from '../utils/aiCategorizer';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (updated: Transaction) => void;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  onClose,
  onSave,
}) => {
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<CategoryType>('Food');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (transaction) {
      setDesc(transaction.description);
      setCategory(transaction.category);
      setAmount(transaction.amount);
      setDate(transaction.date);
      setPaymentMethod(transaction.paymentMethod);
      setNotes(transaction.notes || '');
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !amount || Number(amount) <= 0) return;

    onSave({
      ...transaction,
      description: desc.trim(),
      category,
      amount: Number(amount),
      date,
      paymentMethod: paymentMethod || 'Instant UPI',
      notes: notes.trim(),
    });
  };

  const categories: CategoryType[] = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Others'];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-5 border border-surface-container-high shadow-2xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-on-surface">Edit Transaction</h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Description
            </label>
            <input
              type="text"
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const meta = CATEGORY_META[cat];
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary text-white font-semibold shadow-xs'
                        : 'border-surface-container-high bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: isSelected ? '#ffffff' : meta.color }}
                    />
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Amount (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-on-surface-variant font-semibold">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full h-10 pl-7 pr-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm font-semibold tnum outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Payment Method
              </label>
              <input
                type="text"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="e.g. UPI / HDFC, Cred UPI"
                className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Notes / Tags
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Dinner with team"
                className="w-full h-10 px-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-5 pt-2 border-t border-surface-container">
            <button
              type="button"
              className="py-2.5 rounded-xl border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              Update Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
