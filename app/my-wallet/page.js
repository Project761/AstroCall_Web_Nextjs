"use client";
import React, { useContext, useEffect, useState } from 'react'

import { format } from 'date-fns';

import { postWithToken } from '../utils/api';
import { useMenuContext } from '../hooks/useMenuContext';



export default function MyWallet() {


  const UserLoginId = localStorage.getItem("UserLoginId") ? localStorage.getItem("UserLoginId") : "";
  const { loginUserData } = useMenuContext();

  const [walletData, setWalletData] = useState([]);
  const [activeButton, setActiveButton] = useState('Wallet Transactions');
  const [userstatus, setuserstatus] = useState(true)
  const [paymentHistory, setPaymentHistory] = useState([]);


  useEffect(() => {
    if (UserLoginId) {
      Get_Data_UserWalletTransaction(UserLoginId)
      Get_Data_PaymentHistory(UserLoginId)
    }
  }, [UserLoginId])

  const Get_Data_UserWalletTransaction = async () => {
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
  };

  const Get_Data_PaymentHistory = async () => {
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
  };




  const itemsPerPage = 40;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((activeButton === 'Wallet Transactions' ? walletData.length : paymentHistory.length) / itemsPerPage);
  const paginatedData = (activeButton === 'Wallet Transactions' ? walletData : paymentHistory).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  return (
    <>
      <div className="min-h-screen p-4">
        <div className=" main-container mx-auto">
          <h1 className="text-2xl  text-orange-500 font-semibold mb-1">My Wallet</h1>
          <p className="text-gray-600 text-sm mb-6">
            View your wallet balance and transaction history. Add funds or make withdrawals.
          </p>
          <hr className="mb-6" />


          <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg shadow p-8 text-center mb-8">
            <div className="text-white text-sm mb-2">Available Balance</div>
            <div className="text-4xl font-bold text-white mb-6">₹{loginUserData?.WalletAmt ? loginUserData?.WalletAmt : 0}</div>
            <div className="flex justify-center gap-4">
              <button className="bg-white text-orange-600 font-semibold px-6 py-2 rounded shadow hover:bg-orange-50 transition">Add Money</button>
            </div>
          </div>

          <div>
            <div className="flex space-x-4 mb-4">
              <button
                className={`px-4 py-2 rounded ${activeButton === 'Wallet Transactions' ? 'bg-orange-500 text-white' : 'bg-gray-300 text-black'}`}
                onClick={() => {
                  setActiveButton('Wallet Transactions');
                  setuserstatus(true);
                }}
              >
                Wallet Transactions
              </button>
              <button
                className={`px-4 py-2 rounded ${activeButton === 'Payment Logs' ? 'bg-orange-500 text-white' : 'bg-gray-300 text-black'}`}
                onClick={() => {
                  setActiveButton('Payment Logs');
                  setuserstatus(false);
                }}
              >
                Payment Logs
              </button>
            </div>
            {
              userstatus ?
                <div>
                  {paginatedData && paginatedData?.length > 0 ? (
                    paginatedData?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b last:border-b-0">
                        <div>
                          <div className="font-semibold">{item.Description}</div>
                          <div className="text-gray-500 font-semibold">Order Id: {item.ID}</div>
                          <div className="text-xs text-gray-500">
                            {/* {item.TransactionDateTime ? format(new Date(item.TransactionDateTime), "MMM d, yyyy HH:MM") : ""} */}
                            {item.TransactionDateTime ? format(new Date(item.TransactionDateTime), "MMM d, yyyy hh:mm") : ""}

                          </div>
                        </div>

                        {/* <div className={`font-semibold ${Number(item.Amt) < 0 ? "text-red-500" : "text-green-500"}`}>
                          {Number(item.Amt) < 0 ? `- ₹${Math.abs(Number(item.Amt))}` : `+ ₹${item.Amt}`}
                          <h6 className='text-gray-500'>{ item?.GSTAmt?.length > 0 ? <span>GST</span> item?.GSTAmt : ''}</h6>
                        </div> */}


                        <div className={`font-semibold ${Number(item.Amt) < 0 ? "text-red-500" : "text-green-500"}`}>
                          {Number(item.Amt) < 0 ? `- ₹${Math.abs(Number(item.Amt))}` : `+ ₹${item.Amt}`}
                          {/* <h6 className='text-gray-500'>
                            {item?.GSTAmt ? (
                              <>
                              <span>(<span>GST</span> {item.GSTAmt})</span>
                              </>
                              ) : ''}
                              </h6> */}
                          <div>
                            {typeof item?.GSTAmt === "number" && item.GSTAmt >= 0 && item?.GSTAmt > 0 && (
                              <h6 className="text-gray-500 text-sm">
                                (GST ₹{item.GSTAmt})
                              </h6>
                            )}
                          </div>
                        </div>


                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">No Transaction...</div>
                  )}
                </div>

                :

                <div>
                  {paginatedData && paginatedData.length > 0 ? (
                    paginatedData.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-3 items-center py-3 border-b last:border-b-0">

                        {/* Left Section */}
                        <div>
                          <div className="font-semibold">{item.payment_description}</div>
                          <div className="text-gray-500 font-semibold">Order Id: {item.order_id}</div>
                          {/* <div className="text-xs text-gray-500">{item.CreatedDate}</div> */}
                          <div className="text-xs text-gray-500">{item.CreatedDate ? format(new Date(item.CreatedDate), "MMM d, yyyy, hh:mm") : ""}</div>
                          <p className="text-gray-500 font-semibold">Transaction Id: {item?.TransactionId}</p>
                        </div>



                        {/* Center Section - Status with Badge */}

                        <div className="text-center">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${item?.Status === "Completed" || item?.Status === "COMPLETED" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                          >
                            {item?.Status}
                          </span>
                        </div>



                        {/* Right Section */}
                        <div className={`text-right font-semibold ${Number(item.payment_amount) < 0 ? "text-red-500" : "text-green-500"}`}>
                          {Number(item.payment_amount) < 0 ? `- ₹${Math.abs(Number(item.payment_amount))}` : `+ ₹${item.payment_amount}`}

                          <div>
                            {typeof item?.GstAmt === "number" && item.GstAmt >= 0 && item?.GstAmt > 0 && (
                              <h6 className="text-gray-500 text-sm">
                                (GST ₹{item.GstAmt})
                              </h6>
                            )}
                          </div>

                        </div>

                        <div>
                          <button
                            className='bg-blue-500 rounded text-white mt-1 p-1'
                            onClick={(e) => {
                              setIsPopupOpen(true);
                              setInvoiceTransactionId(item?.TransactionId)

                            }}
                          >Invoice</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">No Transaction...</div>
                  )}
                </div>
            }

          </div>
        </div>
      </div>




      {totalPages > 1 && (
        <div className="flex justify-center overflow-x-auto mt-10 space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              return (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              );
            })
            .map((page, index, arr) => {
              const prev = arr[index - 1];
              const showEllipsis = prev && page - prev > 1;

              return (
                <React.Fragment key={page}>
                  {showEllipsis && (
                    <span className="px-2 py-2 text-gray-400 select-none">...</span>
                  )}
                  <button
                    className={`px-4 py-2 rounded-md ${currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}

          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

    </>
  );
}

