"use client";

import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { X, Send, MessageSquareDot } from "lucide-react";

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function ChatAssistance() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Hi! How can I help you today?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Detect mobile + scroll visibility
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Prevent body scroll when chat open on mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
      inputRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: messages.length + 2,
        text: "Thanks for your message! I'm here to help.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Chat Window */}
      <div
        className={`
          ${
            isMobile
              ? "fixed inset-0 z-50"
              : "fixed right-8 bottom-8 z-50 w-96 h-[36rem] rounded-2xl shadow-2xl"
          }
          bg-white flex flex-col
          ${isOpen ? "block" : "hidden"}
        `}
      >
        {/* Header */}
        <div className="bg-primary text-white px-4 py-3 flex items-center justify-between md:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <MessageSquareDot size={24} />
            <div>
              <h4 className="!text-white">Shop Assistant</h4>
              <p className="text-xs !text-white/90">Online</p>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="p-1 hover:bg-black/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] p-3 text-sm rounded-xl ${
                  m.sender === "user"
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-primary/10 text-primary rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 h-12 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              className="bg-primary/20 text-primary h-12 w-12 rounded-xl center hover:bg-primary/30 tr"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="w-full text-xs text-center opacity-50 mt-3 px-4">These are AI generated messages</div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`
          fixed right-8 z-50 h-14 w-14 center bg-primary
          rounded-full shadow-xl hover:scale-110 active:scale-95
          transition-all duration-500 ease-in-out
          ${
            !isOpen
              ? "bottom-6 opacity-100"
              : !isOpen
              ? "-bottom-20 opacity-0"
              : "opacity-0 pointer-events-none"
          }
        `}
      >
        <MessageSquareDot size={24} className="text-white" />
      </button>
    </>
  );
}
