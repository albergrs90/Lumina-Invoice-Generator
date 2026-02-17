import React, { useState } from 'react';
import { useInvoiceStore } from '../../store/invoiceStore';
import { exportToPdf } from '../../services/pdfService';
import { Download, RotateCcw, FileText } from 'lucide-react';
import { Modal } from '../ui';

const ActionBar: React.FC = () => {
    const store = useInvoiceStore();
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const handleDownload = async () => {
        await exportToPdf('invoice-capture', `factura-${store.number || 'sin-numero'}.pdf`);
    };

    const handleReset = () => {
        setIsResetModalOpen(true);
    };

    const confirmReset = () => {
        store.resetInvoice();
    };

    return (
        <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                    <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-black tracking-tighter text-gray-900 uppercase">Lumina</h1>
                    <p className="text-[10px] font-bold text-indigo-600 tracking-widest -mt-1 uppercase">Invoice Gen</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-black text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all uppercase tracking-widest border border-transparent hover:border-red-100"
                >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">Limpiar</span>
                </button>
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 uppercase tracking-widest"
                >
                    <Download className="w-4 h-4" />
                    <span>Descargar PDF</span>
                </button>
            </div>

            <Modal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                onConfirm={confirmReset}
                title="¿Limpiar Factura?"
                message="Esta acción borrará todos los datos actuales de la factura. Esta acción no se puede deshacer."
                confirmText="Sí, Limpiar"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
};

export default ActionBar;
