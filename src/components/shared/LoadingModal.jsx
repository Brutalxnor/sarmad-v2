import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoadingModal.css';

const LoadingModal = ({ isOpen, message = 'جارٍ التحميل...' }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="loading-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="loading-content"
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <div className="spinner-container">
                            <div className="spinner"></div>
                            <div className="spinner-inner"></div>
                        </div>
                        <p className="loading-text">{message}</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingModal;
