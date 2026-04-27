"use client";
import React from 'react';
const BankDetails = () => {
    return (<div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Bank Details</h3>
      <p className="text-gray-600">Bank details component would be implemented here</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Holder Name
          </label>
          <input type="text" className="w-full border border-gray-300 rounded-md p-2" placeholder="Enter account holder name"/>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name
          </label>
          <input type="text" className="w-full border border-gray-300 rounded-md p-2" placeholder="Enter bank name"/>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Number
          </label>
          <input type="text" className="w-full border border-gray-300 rounded-md p-2" placeholder="Enter account number"/>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IFSC Code
          </label>
          <input type="text" className="w-full border border-gray-300 rounded-md p-2" placeholder="Enter IFSC code"/>
        </div>
      </div>
      
      <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
        Save Bank Details
      </button>
    </div>);
};
export default BankDetails;
