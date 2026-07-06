"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const InsufficientBalancePopup = ({ isOpen, onClose, requiredAmount, currentBalance, astrologerName }) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold">Insufficient Balance</h2>
          <button
            onClick={onClose}
            className="text-xl font-bold hover:text-red-600"
          >
            ×
          </button>
        </div>
        
        <p className="text-center text-gray-600 text-base mt-4">
          Minimum balance of <span className="text-gray-800 font-medium">5 minutes (₹{requiredAmount})</span> is required to start a Chat with {astrologerName}.
        </p>
        
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
              router.push('/plans');
            }}
            style={{ touchAction: 'manipulation' }}
          >
            Recharge
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsufficientBalancePopup;
