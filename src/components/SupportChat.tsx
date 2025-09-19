import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { generateSupportResponse } from '../lib/supportChatbot';

const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! I\'m EcoBot, your Green Spark AI assistant! 🌱 I can help you with eco missions, earning points, environmental questions, and platform support. How can I assist you today?', sender: 'bot', time: new Date() }
  ]);
  const [inputText, setInputText] = useState('');

  const quickReplies = [
    'How do I earn more points?',
    'Mission not working',
    'Account issues',
    'Technical support'
  ];

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      time: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');

    // Generate AI response
    try {
      const aiResponse = await generateSupportResponse(inputText, newMessages);
      const botResponse = {
        id: newMessages.length + 1,
        text: aiResponse,
        sender: 'bot',
        time: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse = {
        id: newMessages.length + 1,
        text: 'Sorry, I\'m having trouble right now. Please try again or contact our support team!',
        sender: 'bot',
        time: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputText(reply);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-full shadow-2xl shadow-emerald-500/25 z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 h-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white">Support Chat</div>
                  <div className="text-xs text-green-400">● Online</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-2xl text-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full hover:bg-slate-700 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportChat;