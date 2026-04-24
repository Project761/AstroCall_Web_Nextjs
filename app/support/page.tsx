"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaHandsHelping, FaPhone, FaEnvelope, FaClock, FaHeadset, FaQuestionCircle, FaBook, FaFileAlt, FaComments, FaTicketAlt } from "react-icons/fa";
import Header from "../components/Header/page";
import SEO from "../components/SEO/page";

export default function Support() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const loginData = localStorage.getItem("LoginTokenData");
    if (loginData) {
      try {
        const parsedData = JSON.parse(loginData);
        setUserData(parsedData);
        
        // Mock support tickets - replace with actual API call
        setTickets([
          {
            id: 1,
            subject: "Payment issue with wallet recharge",
            category: "payment",
            status: "resolved",
            priority: "high",
            createdAt: "2024-04-23 10:30 AM",
            lastReply: "2024-04-23 11:15 AM"
          },
          {
            id: 2,
            subject: "Unable to connect with astrologer",
            category: "technical",
            status: "open",
            priority: "medium",
            createdAt: "2024-04-22 06:45 PM",
            lastReply: "2024-04-22 07:20 PM"
          },
          {
            id: 3,
            subject: "Question about refund policy",
            category: "general",
            status: "closed",
            priority: "low",
            createdAt: "2024-04-21 04:20 PM",
            lastReply: "2024-04-21 05:00 PM"
          }
        ]);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const handleSubmitTicket = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newTicket = {
        id: tickets.length + 1,
        subject,
        category: selectedCategory,
        status: "open",
        priority: "medium",
        createdAt: new Date().toLocaleString(),
        lastReply: new Date().toLocaleString()
      };

      setTickets([newTicket, ...tickets]);
      setSubject("");
      setMessage("");
      setSelectedCategory("general");
      setIsSubmitting(false);
      
      // Show success message
      alert("Support ticket created successfully!");
    }, 1500);
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Support - AstroCall"
        description="Get help and support for your AstroCall account"
      />
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3">
              <FaHandsHelping className="text-purple-500 text-2xl" />
              <h1 className="text-2xl font-bold text-gray-800">Support Center</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Support Options */}
            <div className="lg:col-span-1">
              {/* Quick Help */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Help</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <FaBook className="text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-800">Help Center</p>
                      <p className="text-sm text-gray-600">Browse FAQs</p>
                    </div>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <FaFileAlt className="text-green-500" />
                    <div>
                      <p className="font-medium text-gray-800">Documentation</p>
                      <p className="text-sm text-gray-600">User guides</p>
                    </div>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <FaComments className="text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-800">Live Chat</p>
                      <p className="text-sm text-gray-600">Chat with support</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-800">Phone Support</p>
                      <p className="text-sm text-gray-600">+91 98765 43210</p>
                      <p className="text-xs text-gray-500">Mon-Fri, 9AM-6PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-800">Email Support</p>
                      <p className="text-sm text-gray-600">support@astrocall.live</p>
                      <p className="text-xs text-gray-500">24/7 response</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaHeadset className="text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-800">WhatsApp Support</p>
                      <p className="text-sm text-gray-600">+91 98765 43210</p>
                      <p className="text-xs text-gray-500">Quick responses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Support Content */}
            <div className="lg:col-span-2">
              {/* Create Ticket */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Support Ticket</h3>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Issue</option>
                      <option value="payment">Payment Issue</option>
                      <option value="account">Account Problem</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief description of your issue"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please describe your issue in detail"
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating Ticket..." : "Create Ticket"}
                  </button>
                </form>
              </div>

              {/* My Tickets */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">My Support Tickets</h3>
                  <FaTicketAlt className="text-purple-500 text-xl" />
                </div>

                {tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <FaQuestionCircle className="text-gray-300 text-4xl mx-auto mb-3" />
                    <p className="text-gray-600">No support tickets yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-800">{ticket.subject}</h4>
                            <p className="text-sm text-gray-600">
                              Category: <span className="capitalize">{ticket.category}</span>
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.status === "open" ? "bg-yellow-100 text-yellow-600" :
                            ticket.status === "resolved" ? "bg-green-100 text-green-600" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            <span>Created: {ticket.createdAt}</span>
                            <span>Last Reply: {ticket.lastReply}</span>
                          </div>
                          <span className={`px-2 py-1 rounded ${
                            ticket.priority === "high" ? "bg-red-100 text-red-600" :
                            ticket.priority === "medium" ? "bg-orange-100 text-orange-600" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {ticket.priority} priority
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
