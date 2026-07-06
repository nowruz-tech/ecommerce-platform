'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Paperclip, Smile, Image as ImageIcon } from 'lucide-react';
import { formatRelativeTime, cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

interface ChatSession {
  id: string;
  status: 'waiting' | 'active' | 'closed';
  agent?: {
    id: string;
    name: string;
    avatar?: string;
  };
  messages: Message[];
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.messages]);

  const initChat = () => {
    // Simulate chat initialization
    const newSession: ChatSession = {
      id: `chat_${Date.now()}`,
      status: 'waiting',
      messages: [
        {
          id: '1',
          content: 'Hello! How can I help you today?',
          sender: 'system',
          timestamp: new Date(),
          status: 'read',
        },
      ],
    };
    setSession(newSession);

    // Simulate agent joining
    setTimeout(() => {
      setSession((prev) =>
        prev
          ? {
              ...prev,
              status: 'active',
              agent: {
                id: 'agent_1',
                name: 'Support Agent',
                avatar: '/images/agent-avatar.jpg',
              },
            }
          : null
      );
    }, 2000);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !session) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    };

    setSession((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, userMessage],
          }
        : null
    );

    setInputValue('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: `msg_${Date.now()}`,
        content: 'Thank you for your message. Let me help you with that.',
        sender: 'agent',
        timestamp: new Date(),
        status: 'sent',
      };

      setSession((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, agentMessage],
            }
          : null
      );
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!session) initChat();
        }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center z-50 hover:bg-primary/90 transition-colors"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {session?.agent ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="font-bold">
                          {session.agent.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{session.agent.name}</p>
                        <p className="text-xs text-white/80">Online</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">Connecting...</p>
                        <p className="text-xs text-white/80">
                          Finding an agent for you
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {session?.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex',
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2',
                      message.sender === 'user'
                        ? 'bg-primary text-white rounded-br-sm'
                        : message.sender === 'system'
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm'
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={cn(
                        'text-xs mt-1',
                        message.sender === 'user'
                          ? 'text-white/70'
                          : 'text-gray-500'
                      )}
                    >
                      {formatRelativeTime(message.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="text-sm">Agent is typing...</span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t dark:border-gray-800">
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <Smile className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-full border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim()}
                  className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
