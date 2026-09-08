import { AlertTriangle, Trash2 } from 'lucide-react';

interface Props {
  isOpen?: boolean;
  show?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export default function ConfirmDelete({ isOpen, show, onClose, onConfirm, title = 'Konfirmasi', message = 'Apakah Anda yakin?', loading }: Props) {
  const visible = show ?? isOpen ?? false;
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-900/40 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
            <p className="text-sm text-slate-400 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary">Batal</button>
          <button onClick={onConfirm} disabled={loading} className="btn-danger flex items-center gap-2">
            <Trash2 size={16} />
            {loading ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
