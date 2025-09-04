"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Loader2,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useFloatingButtons } from "@/contexts/floating-buttons-context";

export function Chatbot() {
  const { isSignedIn, userId } = useAuth();
  const { setIsChatbotVisible } = useFloatingButtons();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState(null);
  const [maxQuestions, setMaxQuestions] = useState(null);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle scroll behavior for hiding/showing chat button
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const distanceFromBottom =
        documentHeight - (currentScrollY + windowHeight);

      let newVisibility;

      // Hide when near footer (within 200px) or when scrolling down fast
      if (distanceFromBottom < 200) {
        newVisibility = false;
      } else if (currentScrollY < lastScrollY || currentScrollY < 100) {
        // Show when scrolling up or near top
        newVisibility = true;
      } else if (currentScrollY > lastScrollY + 50) {
        // Hide when scrolling down significantly
        newVisibility = false;
      } else {
        newVisibility = isVisible; // Keep current state
      }

      if (newVisibility !== isVisible) {
        setIsVisible(newVisibility);
        setIsChatbotVisible(newVisibility); // Update context
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isVisible, setIsChatbotVisible]);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = isSignedIn
        ? "👋 Hi! I'm your FineFinance AI assistant. I can help you with financial insights, budgeting advice, and answer questions about your transactions. What would you like to know?"
        : "👋 Welcome to FineFinance! I can tell you about our platform features and help you get started. To access personalized financial insights, please sign in or create an account first.";

      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, isSignedIn]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Prepare conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRemainingQuestions(data.remainingQuestions);
        setMaxQuestions(data.maxQuestions);
        setRateLimitExceeded(false);

        const assistantMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else if (response.status === 429) {
        setRateLimitExceeded(true);
        setRemainingQuestions(0);
        setMaxQuestions(data.maxQuestions);

        const errorMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
          isError: true,
        };

        setMessages((prev) => [...prev, errorMessage]);
        toast.error("Rate limit exceeded");
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "Sorry, I'm experiencing technical difficulties. Please try again later.",
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearChat = () => {
    setMessages([]);
    setRateLimitExceeded(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className={cn(
          "fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg transition-all duration-300 z-50",
          "bg-gradient-to-br from-primary to-secondary",
          "hover:shadow-xl hover:scale-105",
          "border border-primary/20",
          // Removed md:hidden so it also shows on desktop
          // Add slightly larger offset on very large screens
          "lg:bottom-8 lg:right-8",
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        size="icon"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <MessageCircle className="h-5 w-5 text-white" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 sm:hidden transition-opacity duration-300"
            onClick={toggleChat}
          />

          <Card
            className={cn(
              "fixed shadow-xl transition-all duration-300 z-40",
              "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
              "sm:bottom-24 sm:right-6 sm:w-96 sm:h-[600px]",
              "max-sm:inset-4 max-sm:top-16 max-sm:w-auto max-sm:h-auto max-sm:bottom-4",
              "flex flex-col overflow-hidden rounded-lg"
            )}
          >
            {/* Header */}
            <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      FineFinance AI
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {!isSignedIn && (
                        <Badge variant="outline" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Guest Mode
                        </Badge>
                      )}
                      {remainingQuestions !== null && (
                        <Badge
                          variant={
                            remainingQuestions <= 2
                              ? "destructive"
                              : remainingQuestions <= 5
                                ? "outline"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {remainingQuestions}/{maxQuestions} left
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={toggleChat}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="p-0 flex-1 min-h-0 overflow-hidden">
              <div className="h-full overflow-y-auto overflow-x-hidden">
                <div className="p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3 transition-all duration-300",
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      )}
                    >
                      <div
                        className={cn(
                          "p-2 rounded-lg shrink-0",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : message.isError
                              ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                              : "bg-gray-100 dark:bg-gray-800"
                        )}
                      >
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : message.isError ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "flex-1 p-3 rounded-lg break-words overflow-hidden",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground max-w-[80%] ml-auto"
                            : message.isError
                              ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 max-w-[85%]"
                              : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-[85%]"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed word-wrap break-words">
                          {message.content}
                        </p>
                        <span className="text-xs opacity-70 mt-2 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-w-[85%]">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">
                            Thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </CardContent>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
              {rateLimitExceeded ? (
                <div className="text-center py-2">
                  <p className="text-sm text-destructive mb-2">
                    Rate limit exceeded ({maxQuestions} questions/hour)
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    You can ask more questions in about an hour
                  </p>
                  <Button
                    onClick={clearChat}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Clear Chat
                  </Button>
                </div>
              ) : (
                <>
                  {remainingQuestions !== null &&
                    remainingQuestions <= 3 &&
                    remainingQuestions > 0 && (
                      <div className="mb-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                        <p className="text-xs text-amber-800 dark:text-amber-200">
                          ⚠️ You have {remainingQuestions} question
                          {remainingQuestions !== 1 ? "s" : ""} remaining this
                          hour
                        </p>
                      </div>
                    )}
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        isSignedIn
                          ? "Ask about your finances..."
                          : "Ask about FineFinance..."
                      }
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      size="icon"
                      className="shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </>
      )}
    </>
  );
}
