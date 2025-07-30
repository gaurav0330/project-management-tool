import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent body scroll
      window.addEventListener('keydown', onKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
  {isOpen && (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="max-w-3xl w-full bg-bg-primary-light dark:bg-bg-primary-dark rounded-3xl shadow-2xl p-8 relative font-body text-txt-primary-light dark:text-txt-primary-dark max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2
              id="modal-title"
              className="text-2xl font-heading font-semibold text-heading-primary-light dark:text-heading-primary-dark"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-3 rounded-lg hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
              <X className="w-6 h-6 text-txt-muted-light dark:text-txt-muted-dark" />
            </button>
          </div>

          {/* Body */}
          <div className="text-txt-secondary-light dark:text-txt-secondary-dark">
            {children}
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

  );
};

export default Modal;
