import React from 'react';
import { useInvoiceStore } from '../../store/invoiceStore';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TEMPLATE_STYLES } from './TemplateStyles';
import { motion, AnimatePresence } from 'framer-motion';

const InvoiceCanvas: React.FC = () => {
    const { sender, receiver, number, issueDate, dueDate, items, totals, settings, notes, paymentMethod } = useInvoiceStore();

    const style = TEMPLATE_STYLES[settings.template || 'modern'];

    return (
        <div className="relative group p-4">

            <AnimatePresence mode="wait">
                <motion.div
                    key={settings.template}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    id="invoice-capture"
                    className={`${style.container} mx-auto min-h-[1123px] max-w-[794px] w-full pt-8 p-10 pb-[20mm] flex flex-col transition-shadow overflow-visible`}
                    style={{ letterSpacing: '0.01em', overflow: 'visible' }}
                >
                    {/* Header: Sender (Left), Invoice Details (Right) */}
                    <div className={`${style.header} invoice-header relative flex justify-between items-start pb-8 overflow-visible`}>
                        {/* Sender info (Left) */}
                        <div className="space-y-4 flex flex-col items-start min-w-0">
                            {sender.logo ? (
                                <img src={sender.logo} alt="Logo" className="h-20 w-auto object-contain bg-white rounded-xl p-2 shadow-sm" />
                            ) : (
                                <div className={`h-16 w-16 ${settings.template === 'modern' ? 'bg-indigo-500' : 'bg-gray-200'} rounded-lg flex items-center justify-center text-white font-bold uppercase text-[10px] tracking-tighter`}>
                                    Logo
                                </div>
                            )}
                            <div className="space-y-2">
                                <h2
                                    className={`text-2xl font-black whitespace-normal break-words overflow-visible ${settings.template === 'corporate' ? 'text-gray-900' : style.headerText}`}
                                    style={{ letterSpacing: 'normal' }}
                                >
                                    {sender.name || 'Tu Nombre o Empresa'}
                                </h2>
                                <p className={`text-sm leading-relaxed whitespace-normal break-words max-w-[320px] ${settings.template === 'modern' || settings.template === 'creative' ? 'text-indigo-100' : 'text-gray-400'}`}>
                                    {sender.address}
                                </p>
                            </div>
                        </div>

                        {/* Invoice Details (Right) */}
                        <div className="text-right space-y-4 min-w-fit">
                            <h1
                                className={`text-7xl font-black mb-6 uppercase tracking-tight ${style.headerText}`}
                                style={{ letterSpacing: 'normal' }}
                            >
                                FACTURA
                            </h1>
                            <div className="space-y-1">
                                <p className={`text-sm font-bold tracking-widest uppercase opacity-60 ${settings.template === 'modern' || settings.template === 'creative' ? 'text-indigo-50' : 'text-gray-500'}`}>Número de Factura</p>
                                <p className={`text-lg font-black ${settings.template === 'modern' || settings.template === 'creative' ? 'text-white' : 'text-gray-900'}`}>{number}</p>
                            </div>
                            <div className="space-y-1">
                                <p className={`text-sm font-bold tracking-widest uppercase opacity-60 ${settings.template === 'modern' || settings.template === 'creative' ? 'text-indigo-50' : 'text-gray-500'}`}>Fecha de Emisión</p>
                                <p className={`text-base font-bold ${settings.template === 'modern' || settings.template === 'creative' ? 'text-indigo-100' : 'text-gray-700'}`}>{formatDate(issueDate)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-8 overflow-visible">
                        <div className="space-y-2">
                            <p className={`text-xs font-bold uppercase tracking-widest ${style.accent}`}>Facturar a:</p>
                            <div className="space-y-1">
                                <p className="font-bold text-gray-900 text-xl break-words">{receiver.name || 'Nombre del Cliente'}</p>
                                <p className="text-sm text-gray-500 break-words">{receiver.address}</p>
                                <p className="text-sm text-gray-500 break-words">{receiver.taxId}</p>
                            </div>
                        </div>
                        <div className="text-right space-y-2">
                            <p className={`text-xs font-bold uppercase tracking-widest ${style.accent}`}>Vencimiento:</p>
                            <p className="font-bold text-gray-900 text-lg">{formatDate(dueDate)}</p>
                        </div>
                    </div>

                    {/* Table - 60 / 10 / 15 / 15 ratios */}
                    <div className="overflow-visible mb-8">
                        <table className="w-full table-fixed border-separate border-spacing-0 overflow-visible">
                            <thead>
                                <tr className={`${style.tableHeader} text-left bg-gray-50/50`}>
                                    <th className="py-4 px-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-l-2xl text-gray-400 border-b border-gray-100 w-[60%]">Descripción del Servicio / Producto</th>
                                    <th className="py-4 px-2 text-[11px] font-black uppercase tracking-[0.2em] text-right w-[10%] text-gray-400 border-b border-gray-100">Cant.</th>
                                    <th className="py-4 px-2 text-[11px] font-black uppercase tracking-[0.2em] text-right w-[15%] text-gray-400 border-b border-gray-100">Precio Unit.</th>
                                    <th className="py-4 px-4 text-[11px] font-black uppercase tracking-[0.2em] text-right w-[15%] rounded-r-2xl text-gray-400 border-b border-gray-100">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {items.map((item) => (
                                    <tr key={item.id} className="group/row transition-colors hover:bg-gray-50/30 break-inside-avoid">
                                        <td className="py-4 px-4 text-sm text-gray-900 font-bold break-words leading-relaxed whitespace-pre-wrap w-[60%]">{item.desc || '—'}</td>
                                        <td className="py-4 px-2 text-sm text-gray-900 text-right font-medium leading-relaxed w-[10%]">{item.qty}</td>
                                        <td className="py-4 px-2 text-sm text-gray-900 text-right font-medium leading-relaxed border-l border-gray-50 w-[15%] whitespace-nowrap">{formatCurrency(item.price, settings.currency)}</td>
                                        <td className="py-4 px-4 text-sm text-gray-900 font-black text-right leading-relaxed border-l border-gray-50 w-[15%] whitespace-nowrap">{formatCurrency(item.qty * item.price, settings.currency)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom Block (Relative Flow) */}
                    <div className="mt-8 invoice-totals-footer space-y-12 h-auto overflow-visible pb-12">
                        {/* Totals Section */}
                        <div className="flex justify-end px-4 overflow-visible">
                            <div className="w-80 space-y-4">
                                <div className="flex justify-between text-sm py-1">
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Subtotal</span>
                                    <span className="font-bold text-gray-700 whitespace-nowrap">{formatCurrency(totals.subtotal, settings.currency)}</span>
                                </div>
                                <div className="flex justify-between text-sm py-1 pb-4">
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">IVA ({settings.taxRate}%)</span>
                                    <span className="font-bold text-gray-700 whitespace-nowrap">{formatCurrency(totals.taxAmount, settings.currency)}</span>
                                </div>

                                {/* TOTAL FACTURA: Blue, White, Extra Bold, 20pt (~27px) */}
                                <div className={`mt-4 px-4 pt-8 pb-10 rounded-[32px] flex flex-col items-center justify-center text-center shadow-2xl transition-all ${settings.template === 'corporate' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white shadow-blue-200'}`}>
                                    <span className="text-[11px] font-black uppercase tracking-[0.5em] mb-3 opacity-90">Total Factura</span>
                                    <span className="text-[27px] font-black leading-none drop-shadow-lg whitespace-nowrap">
                                        {formatCurrency(totals.total, settings.currency)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Details */}
                        <div className="pt-16 grid grid-cols-2 gap-12 border-t border-gray-100 overflow-visible h-auto leading-[1.4]">
                            <div className="mb-12">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 italic">Notas y Términos</p>
                                <p className="text-xs text-gray-500 italic whitespace-normal break-words font-normal leading-relaxed">{notes || 'Gracias por su confianza.'}</p>
                            </div>
                            <div className="text-right mb-12">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 italic">Método de Pago</p>
                                <p className="text-sm text-gray-900 whitespace-normal break-words tracking-tight font-bold leading-relaxed">{paymentMethod}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Floating Action Buttons Overlay */}
            <div className="absolute top-1/2 -right-16 transform -translate-y-1/2 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => window.print()}
                    className="p-4 bg-white rounded-2xl shadow-xl text-gray-600 hover:text-indigo-600 hover:scale-110 transition-all border border-gray-100"
                    title="Imprimir"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                </button>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('¡Enlace de factura copiado!');
                    }}
                    className="p-4 bg-white rounded-2xl shadow-xl text-gray-600 hover:text-emerald-600 hover:scale-110 transition-all border border-gray-100"
                    title="Copiar Enlace"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
            </div>
        </div>
    );
};

export default InvoiceCanvas;
