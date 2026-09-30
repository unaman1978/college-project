import React from 'react';
import { Transaction } from '../types';

interface DeleteConfirmModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-5 border border-surface-container-high shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-error-container/40 text-error flex items-center justify-center mx-auto mb-3">
          <span className="material-symbols-outlined text-[24px]">delete_forever</span>
        </div>
        <h3 className="text-lg font-bold text-on-surface text-center">Delete Transaction?</h3>
        <p className="text-sm text-on-surface-variant text-center mt-1">
          Are you sure you want to remove &quot;{transaction.description}&quot; (₹
          {transaction.amount.toLocaleString('en-IN')})? This action will adjust your monthly budget stats.
        </p>

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
            className="py-2.5 rounded-xl bg-error text-on-error text-sm font-semibold hover:bg-error/90 active:scale-95 transition-all cursor-pointer shadow-xs"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
