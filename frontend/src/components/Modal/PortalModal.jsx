import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * PortalModal Component
 * 
 * Renders modals using React Portal to prevent parent stacking context issues.
 * This ensures modals always appear above navbar, sidebar, and other UI elements.
 * 
 * Key features:
 * - Renders outside React DOM hierarchy to avoid stacking context issues
 * - Prevents body scroll when modal is open
 * - Closes on Escape key press
 * - Closes on backdrop click
 * - Accessible (ARIA attributes)
 * - Global z-index: 9999 (always on top)
 * 
 * Usage example:
 * Component with isOpen, onClose, title, subtitle, children, and size props
 * size options: "max-w-lg", "max-w-2xl", "max-w-4xl"
 */
export const PortalModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'max-w-lg',
}) => {
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Handle Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Create modal content with proper stacking
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop - positioned absolutely within flex container */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container - positioned above backdrop via z-index */}
      <div
        className={`relative z-50 bg-white dark:bg-[#121212] ${size} max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/10 animate-scale-in`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header - sticky with no z-index conflicts */}
        <div className="p-8 flex justify-between items-center border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 sticky top-0">
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
            className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
            aria-label="Close modal"
            type="button"
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

  // Render using React Portal
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.warn('modal-root element not found in DOM');
    return null;
  }
  
  return createPortal(modalContent, modalRoot);
};

/**
 * PortalModalForm Component
 * Wrapper for form content with proper spacing and submit handling
 */
export const PortalModalForm = ({ onSubmit, children, isLoading = false }) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {children}

      {/* Submit Button - placed in footer */}
      <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-white/5 -mx-8 px-8">
        <button
          type="submit"
          className="btn-primary flex-1 py-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
};

export default PortalModal;
