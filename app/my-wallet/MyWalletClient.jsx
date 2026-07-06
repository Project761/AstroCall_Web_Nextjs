"use client";
import React, { useCallback, useEffect, useState } from 'react'

import { format } from 'date-fns';

import { postWithToken } from '../utils/api';
import { useMenuContext } from '../hooks/useMenuContext';
import { useRouter } from 'next/navigation';
import { FaWallet, FaComments, FaPhone, FaCoins, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { UserPanelPage, PanelCard, PanelTabs, OrangeButton, StatusBadge } from '../components/UserPanelPage';




export default function MyWallet() {

  const router = useRouter();
  const UserLoginId = typeof window !== 'undefined' && localStorage.getItem("UserLoginId") ? localStorage.getItem("UserLoginId") : "";
  const { loginUserData } = useMenuContext();

  const [walletData, setWalletData] = useState([]);
  const [activeButton, setActiveButton] = useState('Wallet Transactions');
  const [userstatus, setuserstatus] = useState(true)
  const [paymentHistory, setPaymentHistory] = useState([]);


  const Get_Data_UserWalletTransaction = useCallback(async () => {
    try {
      const val = {
        FromDate: '',
        Todate: '',
        UserID: UserLoginId,
      };
      const res = await postWithToken('HomePage/GetData_UserWalletTransaction', val);
      if (res) {
        setWalletData(res || [])
      }
    } catch (error) {
      console.log(error, 'error');
    }
  }, [UserLoginId]);

  const Get_Data_PaymentHistory = useCallback(async () => {
    try {
      const val = {
        FromDate: '',
        Todate: '',
        UserID: UserLoginId,
      };
      const res = await postWithToken('HomePage/GetData_PaymentHistory', val);
      if (res) {
        setPaymentHistory(res || [])
      }

    } catch (error) {
      console.log(error, 'error');
    }
  }, [UserLoginId]);

  useEffect(() => {
    if (UserLoginId) {
      queueMicrotask(() => {
        Get_Data_UserWalletTransaction()
        Get_Data_PaymentHistory()
      })
    }
  }, [UserLoginId, Get_Data_UserWalletTransaction, Get_Data_PaymentHistory])




  const itemsPerPage = 40;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((activeButton === 'Wallet Transactions' ? walletData.length : paymentHistory.length) / itemsPerPage);
  const paginatedData = (activeButton === 'Wallet Transactions' ? walletData : paymentHistory).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const balance = loginUserData?.WalletAmt || 0;
  const tabs = ['Transaction History', 'Payment Logs'];

  return (
    <UserPanelPage title="My Wallet" subtitle="View your wallet balance and transaction history.">
      <PanelCard className="mb-5 overflow-hidden p-0">
        <div className="rounded-2xl bg-gradient-to-r from-[#FF5C00] to-[#FF7A33] p-8 text-center text-white shadow-[0_8px_30px_rgba(255,92,0,0.2)]">
          <p className="text-sm opacity-90">Available Balance</p>
          <p className="mt-1 text-4xl font-bold">{balance} ₹</p>
          <button type="button" className="mt-5 rounded-lg bg-white px-6 py-2 font-semibold text-[#FF5C00] shadow transition hover:bg-orange-50" onClick={() => router.push("/plans")}>
            Add payment
          </button>
        </div>
      </PanelCard>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: "Total Spent", value: "₹2,400", icon: FaArrowDown },
          { label: "Bonus payment", value: "50", icon: FaCoins },
          { label: "Pending", value: "0", icon: FaWallet },
          { label: "For Chats", value: "₹800", icon: FaComments },
          { label: "For Calls", value: "₹1,600", icon: FaPhone },
        ].map((s) => (
          <PanelCard key={s.label} className="!p-3 text-center">
            <s.icon className="mx-auto text-[#FF5C00]" />
            <p className="mt-1 text-sm font-bold text-[#1A1A1A]">{s.value}</p>
            <p className="text-[10px] text-gray-500">{s.label}</p>
          </PanelCard>
        ))}
      </div>

      <PanelCard>
        <PanelTabs
          tabs={tabs}
          active={activeButton === 'Wallet Transactions' ? 'Transaction History' : 'Payment Logs'}
          onChange={(tab) => {
            const isWallet = tab === 'Transaction History';
            setActiveButton(isWallet ? 'Wallet Transactions' : 'Payment Logs');
            setuserstatus(isWallet);
            setCurrentPage(1);
          }}
        />
        <div className="mt-4 space-y-1">
          {userstatus ? (
            paginatedData?.length > 0 ? paginatedData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 border-b border-gray-50 py-3 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full ${Number(item.Amt) < 0 ? "bg-red-50 text-red-500" : "bg-orange-50 text-[#FF5C00]"}`}>
                    {Number(item.Amt) < 0 ? <FaArrowDown size={14} /> : <FaArrowUp size={14} />}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.Description}</p>
                    <p className="text-[11px] text-gray-500">
                      {item.TransactionDateTime ? format(new Date(item.TransactionDateTime), "MMM d, yyyy hh:mm a") : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${Number(item.Amt) < 0 ? "text-red-500" : "text-[#FF5C00]"}`}>
                    {Number(item.Amt) < 0 ? `- ₹${Math.abs(Number(item.Amt))}` : `+ ₹${item.Amt}`}
                  </p>
                  <StatusBadge status="Success" />
                </div>
              </div>
            )) : <p className="py-8 text-center text-sm text-gray-400">No transactions yet.</p>
          ) : (
            paginatedData?.length > 0 ? paginatedData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 border-b border-gray-50 py-3 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-[#FF5C00]"><FaWallet size={14} /></span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.payment_description}</p>
                    <p className="text-[11px] text-gray-500">
                      {item.CreatedDate ? format(new Date(item.CreatedDate), "MMM d, yyyy hh:mm a") : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${Number(item.payment_amount) < 0 ? "text-red-500" : "text-[#FF5C00]"}`}>
                    {Number(item.payment_amount) < 0 ? `- ₹${Math.abs(Number(item.payment_amount))}` : `+ ₹${item.payment_amount}`}
                  </p>
                  <StatusBadge status={item?.Status === "Completed" || item?.Status === "COMPLETED" ? "Success" : item?.Status} />
                </div>
              </div>
            )) : <p className="py-8 text-center text-sm text-gray-400">No payment logs yet.</p>
          )}
        </div>
      </PanelCard>

      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm disabled:opacity-50" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => setCurrentPage(page)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${currentPage === page ? "bg-[#FF5C00] text-white" : "bg-gray-100 text-gray-700"}`}>
              {page}
            </button>
          ))}
          <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm disabled:opacity-50" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </UserPanelPage>
  );
}

