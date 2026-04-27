"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaWallet, FaPlus, FaHistory, FaCreditCard, FaRupeeSign, FaArrowDown, FaArrowUp } from "react-icons/fa";
import SEO from "../components/SEO/page";
import { formatIndianNumber } from "../utils/utility";
export default function MyWallet() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [showAddMoney, setShowAddMoney] = useState(false);
    const [amount, setAmount] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    useEffect(() => {
        const loginData = localStorage.getItem("LoginTokenData");
        if (loginData) {
            try {
                const parsedData = JSON.parse(loginData);
                setUserData(parsedData);
                setWalletBalance(parsedData?.WalletAmt || 0);
                // Mock transaction data - replace with actual API call
                setTransactions([
                    {
                        id: 1,
                        type: "credit",
                        amount: 500,
                        description: "Wallet Recharge",
                        date: "2024-04-23 10:30 AM",
                        paymentMethod: "Credit Card"
                    },
                    {
                        id: 2,
                        type: "debit",
                        amount: 200,
                        description: "Chat with Astrologer",
                        date: "2024-04-23 09:15 AM",
                        paymentMethod: "Wallet"
                    },
                    {
                        id: 3,
                        type: "credit",
                        amount: 1000,
                        description: "Wallet Recharge",
                        date: "2024-04-22 06:45 PM",
                        paymentMethod: "Debit Card"
                    },
                    {
                        id: 4,
                        type: "debit",
                        amount: 150,
                        description: "Talk to Astrologer",
                        date: "2024-04-22 04:20 PM",
                        paymentMethod: "Wallet"
                    }
                ]);
            }
            catch (error) {
                console.error("Error parsing user data:", error);
                router.push("/");
            }
        }
        else {
            router.push("/");
        }
    }, [router]);
    const handleAddMoney = () => {
        if (amount && selectedPaymentMethod) {
            // Here you would make an API call to add money to wallet
            console.log("Adding money:", { amount, paymentMethod: selectedPaymentMethod });
            // Add new transaction
            const newTransaction = {
                id: transactions.length + 1,
                type: "credit",
                amount: parseFloat(amount),
                description: "Wallet Recharge",
                date: new Date().toLocaleString(),
                paymentMethod: selectedPaymentMethod
            };
            setTransactions([newTransaction, ...transactions]);
            setWalletBalance(prev => prev + parseFloat(amount));
            setAmount("");
            setSelectedPaymentMethod("");
            setShowAddMoney(false);
        }
    };
    if (!userData) {
        return (<div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>);
    }
    return (<>
      <SEO title="My Wallet - AstroCall" description="Manage your wallet balance and transactions"/>
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3">
              <FaWallet className="text-orange-500 text-2xl"/>
              <h1 className="text-2xl font-bold text-gray-800">My Wallet</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Wallet Balance Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Available Balance</h3>
                  <FaWallet className="text-2xl opacity-80"/>
                </div>
                <div className="text-3xl font-bold mb-2">
                  <FaRupeeSign className="inline mr-2 text-xl"/>
                  {formatIndianNumber(walletBalance)}
                </div>
                <p className="text-orange-100 text-sm">Last updated: {new Date().toLocaleString()}</p>
                
                <button onClick={() => setShowAddMoney(true)} className="w-full mt-6 bg-white text-orange-500 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
                  <FaPlus />
                  <span>Add Money</span>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Credits</span>
                    <span className="text-green-600 font-semibold">
                      +{formatIndianNumber(transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Debits</span>
                    <span className="text-red-600 font-semibold">
                      -{formatIndianNumber(transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0))}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-semibold">Net Balance</span>
                      <span className="text-orange-600 font-bold text-lg">
                        {formatIndianNumber(walletBalance)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
                  <FaHistory className="text-orange-500 text-xl"/>
                </div>

                {transactions.length === 0 ? (<div className="text-center py-8">
                    <FaWallet className="text-gray-300 text-4xl mx-auto mb-3"/>
                    <p className="text-gray-500">No transactions yet</p>
                    <button onClick={() => setShowAddMoney(true)} className="mt-4 text-orange-500 hover:text-orange-600 font-medium">
                      Add Money to Get Started
                    </button>
                  </div>) : (<div className="space-y-3">
                    {transactions.map((transaction) => (<div key={transaction.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                              {transaction.type === 'credit' ? (<FaArrowDown className="text-green-600"/>) : (<FaArrowUp className="text-red-600"/>)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{transaction.description}</p>
                              <p className="text-sm text-gray-500">{transaction.date}</p>
                              <p className="text-xs text-gray-400">via {transaction.paymentMethod}</p>
                            </div>
                          </div>
                          <div className={`text-lg font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'credit' ? '+' : '-'}
                            <FaRupeeSign className="inline mx-1 text-sm"/>
                            {formatIndianNumber(transaction.amount)}
                          </div>
                        </div>
                      </div>))}
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Add Money to Wallet</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {["Credit Card", "Debit Card", "UPI", "Net Banking"].map((method) => (<label key={method} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="paymentMethod" value={method} checked={selectedPaymentMethod === method} onChange={(e) => setSelectedPaymentMethod(e.target.value)} className="text-orange-500"/>
                      <FaCreditCard className="text-gray-400"/>
                      <span>{method}</span>
                    </label>))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddMoney(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleAddMoney} disabled={!amount || !selectedPaymentMethod} className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                Add Money
              </button>
            </div>
          </div>
        </div>)}
    </>);
}
