'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business day delivery. International shipping may take 7-14 business days depending on your location.',
  },
  {
    id: 2,
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Products must be in their original condition with tags attached. Some items like swimwear and intimates are final sale. Returns are free for defective products.',
  },
  {
    id: 3,
    question: 'How can I track my order?',
    answer: 'Once your order ships, you will receive an email with a tracking number. You can use this number to track your package on our website or the carrier\'s website. You can also check your order status in your account.',
  },
  {
    id: 4,
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship to over 100 countries worldwide. International shipping rates and delivery times vary by location. Customs duties and taxes may apply and are the responsibility of the customer.',
  },
  {
    id: 5,
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All transactions are secure and encrypted.',
  },
  {
    id: 6,
    question: 'How do I create an account?',
    answer: 'Click on the "Login" button and then select "Create Account". You can register using your email address or sign up with Google, Facebook, or Apple for faster checkout.',
  },
];

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HelpCircle className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-1">Find answers to common questions</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="mb-4"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-left"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
