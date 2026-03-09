import React from 'react';
import { X } from 'lucide-react';

/**
 * ModalBase Component
 * 
 * A reusable, accessible modal wrapper that handles:
 * - Proper z-index stacking (z-[1000])
 * - Backdrop styling (z-[-1])
 * - Focus management
 * - Escape key closing
 * - Scroll lock
 * 
 * Usage:
 * <ModalBase
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Edit Item"
 *   subtitle="All fields are required"
 *   size="max-w-2xl"
 * >
 *   <ModalForm onSubmit={handleSubmit}>
 *     {/* Form content */}
 *   </ModalForm>
 * </ModalBase>
 */
export const ModalBase = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'max-w-lg',
  onSubmit,
}) => {
  React.useEffect(() => {
    // Lock scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  React.useEffect(() => {
    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop - positioned absolutely, uses negative z-index */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[-1]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div 
        className={`bg-white dark:bg-[#121212] ${size} max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-white/10 animate-scale-in`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header - sticky with higher z-index */}
        <div className="p-8 flex justify-between items-center border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 sticky top-0 z-[1010]">
          <div className="flex flex-col">
            <h2 
              id="modal-title"
              className="text-xl font-display font-black dark:text-white uppercase tracking-tighter"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content - scrollable */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * ModalForm Component
 * Wrapper for form content with proper spacing and submit handling
 */
export const ModalForm = ({ onSubmit, children, isLoading = false }) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {children}

      {/* Submit Button */}
      <div className="flex gap-4 justify-end mt-4 pt-6 border-t border-gray-100 dark:border-white/5">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

/**
 * ModalField Component
 * Consistent form field styling for modals
 */
export const ModalField = ({ label, error, children }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 px-1">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest px-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default ModalBase;
