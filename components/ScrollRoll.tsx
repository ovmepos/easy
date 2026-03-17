
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ScrollRoll: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="fixed right-6 bottom-24 z-[100] flex flex-col gap-2"
            >
                <button 
                    onClick={scrollToTop}
                    className="p-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 transition-all active:scale-90"
                    title="Scroll to Top"
                >
                    <ChevronUp size={24} />
                </button>
                <button 
                    onClick={scrollToBottom}
                    className="p-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 transition-all active:scale-90"
                    title="Scroll to Bottom"
                >
                    <ChevronDown size={24} />
                </button>
            </motion.div>
        </AnimatePresence>
    );
};
