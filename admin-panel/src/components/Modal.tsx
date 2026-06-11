import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop - Plus sombre et avec flou */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div id="modal-content-container" className={`relative bg-white w-full ${sizeClasses[size]} max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300`}>
        {/* Header */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50 bg-white">
          <h3 className="text-2xl font-black text-slate-900 font-outfit tracking-tight">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body - Scroll NATIF SANS BARRE */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
          {children}
        </div>
      </div>

      {/* Style local pour masquer les scrollbars */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Modal;

