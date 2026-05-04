"use client";
import { useRef, useEffect, useState } from "react";
import { FiSend, FiPaperclip, FiSmile } from "react-icons/fi";

export default function ChatUI({ messages, onSend, messagesEndRef, disabled = false }) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Sync disabled state with placeholder
  const placeholder = disabled ? "Connecting..." : "Type your message...";

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const safeMessages = Array.isArray(messages) ? messages : [];

  useEffect(() => {
    scrollToBottom();
  }, [messages, messagesEndRef]);

  const handleSend = () => {
    const message = inputValue.trim();
    if (message) {
      onSend(message);
      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Function to parse messages and make suggestion links clickable
  const parseMessageWithLinks = (message) => {
    if (!message) return '';
    let parsedMessage = message.replace(/\n/g, "<br />");
    
    // Parse GEMSTONE links: #GEMSTONE:id:name:price:image
    parsedMessage = parsedMessage.replace(
      /#GEMSTONE:([^:]+):([^:]+):([^:]+):([^:]+)/g,
      (match, id, name, price, image) => {
        return `<span 
                style="color: #2563eb; text-decoration: underline; cursor: pointer; font-weight: 600;" 
                onclick="window.handleGemstoneClick('${id}', '${name}', '${price}', '${image}')">
                🔮 View Gemstone
               </span>`;
      }
    );
    
    // Parse PUJA links: #PUJA:id:name:price:image
    parsedMessage = parsedMessage.replace(
      /#PUJA:([^:]+):([^:]+):([^:]+):([^:]+)/g,
      (match, id, name, price, image) => {
        return `<span 
                style="color: #2563eb; text-decoration: underline; cursor: pointer; font-weight: 600;" 
                onclick="window.handlePujaClick('${id}', '${name}', '${price}', '${image}')">
                🙏 View Puja
               </span>`;
      }
    );
    
    return parsedMessage;
  };

  // Setup global click handlers for product links
  useEffect(() => {
    // Handle gemstone click
    window.handleGemstoneClick = async (id, name, price, image) => {
      try {
        console.log('Gemstone clicked:', { id, name, price, image });
        // Here you can open a modal or navigate to product page
        // For now, just log the click
      } catch (error) {
        console.error("Error handling gemstone click:", error);
      }
    };

    // Handle puja click
    window.handlePujaClick = async (id, name, price, image) => {
      try {
        console.log('Puja clicked:', { id, name, price, image });
        // Here you can open a modal or navigate to product page
        // For now, just log the click
      } catch (error) {
        console.error("Error handling puja click:", error);
      }
    };

    // Cleanup
    return () => {
      delete window.handleGemstoneClick;
      delete window.handlePujaClick;
    };
  }, []);

  return (
    <div className="flex flex-col h-full max-h-full bg-gradient-to-b from-orange-50/50 to-white overflow-hidden">
      {/* Messages Container - flex-1 to take available space */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {safeMessages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <FiSmile className="text-3xl text-orange-500" />
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">No messages yet</p>
            <p className="text-gray-400 text-sm">Start the conversation with a friendly greeting!</p>
          </div>
        ) : (
          safeMessages?.map((item, i) => {
            if (item?.type === "date") {
              return (
                <div key={`date-${item.date}-${i}`} className="text-center text-gray-500 text-sm py-2">
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium">
                    {item.date}
                  </span>
                </div>
              );
            }
            
            // Handle regular message
            const msg = item;
            const isMine = msg?.isMine || msg?.sender === "You";
            
            return (
              <div
                key={`msg-${i}-${msg?.message?.slice(0, 10)}`}
                className={`flex items-end gap-2 ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                {!isMine && (
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white text-xs font-bold">
                      {msg?.sender ? msg?.sender?.charAt(0)?.toUpperCase() : "U"}
                    </span>
                  </div>
                )}
                
                <div className="max-w-xs lg:max-w-md">
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      isMine
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-sm shadow-md"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
                    }`}
                  >
                    <p 
                      className="text-sm leading-relaxed break-words"
                      dangerouslySetInnerHTML={{ 
                        __html: parseMessageWithLinks(msg?.message || msg?.text) 
                      }}
                    />
                    {(msg?.timestamp || msg?.createdAt) && (
                      <p className={`text-xs mt-1 ${
                        isMine ? "text-purple-100" : "text-gray-400"
                      }`}>
                        {formatTime(msg?.timestamp || msg?.createdAt)}
                      </p>
                    )}
                  </div>
                  
                  {!isMine && msg?.sender && (
                    <p className="text-xs text-gray-500 mt-1 ml-1">{msg?.sender}</p>
                  )}
                </div>
                
                {isMine && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">Y</span>
                  </div>
                )}
              </div>
            );
          })
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">U</span>
            </div>
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Brand Orange Theme - Fixed at bottom */}
      <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          {/* Attachment Button */}
          <button className="p-3 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all duration-200">
            <FiPaperclip className="text-xl" />
          </button>
          
          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              rows={1}
              style={{
                minHeight: '48px',
                maxHeight: '80px',
                height: 'auto'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
              }}
            />
            
            {/* Emoji Button */}
            <button className="absolute right-3 bottom-3 p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all duration-200">
              <FiSmile className="text-lg" />
            </button>
          </div>
          
          {/* Send Button - Brand Orange */}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${
              inputValue.trim()
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg transform hover:scale-105 shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiSend className="text-xl" />
          </button>
        </div>
        
        {/* Quick Actions - Brand Orange - Wrap on mobile */}
        <div className="flex gap-2 mt-3 justify-center flex-wrap">
          {['Hello!', 'How are you?', 'Thank you', 'Good bye'].map((quickMsg, index) => (
            <button
              key={index}
              onClick={() => {
                onSend(quickMsg);
                setInputValue("");
              }}
              className="px-3 py-1.5 text-xs bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition-colors duration-200 font-medium border border-orange-100"
            >
              {quickMsg}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}