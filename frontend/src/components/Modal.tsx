import { type ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen?: boolean;
  show?: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, show, onClose, title, children, maxWidth = 'max-w-lg' }: Props) {
  const visible = show ?? isOpen ?? false;
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  if (!visible) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className={`relative bg-slate-800 rounded-xl shadow-2xl w-full ${maxWidth} max-h-[85vh] sm:max-h-[90vh] flex flex-col border border-slate-700`}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700">
          <h2 className="text-base sm:text-lg font-semibold text-slate-100 truncate">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0 ml-2">
            <X size={20} />
          </button>
        </div>
        <div className="px-4 sm:px-6 py-3 sm:py-4 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
