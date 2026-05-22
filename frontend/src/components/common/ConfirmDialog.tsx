import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = true,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onCancel}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      />
      
      {/* Dialog Box */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8 max-w-md w-full relative z-10 animate-scale-up">
        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition duration-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          {/* Warning Icon Container */}
          <div className={`p-4 rounded-2xl ${
            isDanger ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'
          } mb-5 shadow-inner`}>
            <AlertTriangle className="w-8 h-8" />
          </div>

          {/* Texts */}
          <h3 className="text-xl font-extrabold text-gray-900 mb-2 leading-tight">
            {title}
          </h3>
          <p className="text-sm text-gray-500 font-semibold leading-relaxed mb-8">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition duration-300"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 px-4.5 rounded-xl text-sm font-bold text-white shadow-md transition duration-300 ${
                isDanger 
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/10' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
