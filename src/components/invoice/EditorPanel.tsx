import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInvoiceStore } from '../../store/invoiceStore';
import { Input, TextArea, Accordion } from '../ui';
import { Trash2, Building, Plus, User, FileText, Settings, Briefcase, Hash, GripVertical, Search } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { InvoiceData, ReceiverInfo } from '../../types';

const EditorPanel: React.FC = () => {
    const store = useInvoiceStore();
    const [showClientSuggestions, setShowClientSuggestions] = useState(false);

    // Local state for numeric inputs to handle decimals ("0.") correctly while typing
    const [localInputs, setLocalInputs] = useState<Record<string, string>>({});

    const { register, watch, formState: { errors } } = useForm<InvoiceData>({
        defaultValues: store
    });

    const formData = watch();

    useEffect(() => {
        store.updateInvoiceNumber(formData.number);
        store.updateDates(formData.issueDate, formData.dueDate);
        store.updateNotes(formData.notes);
        store.updatePaymentMethod(formData.paymentMethod);
    }, [formData.number, formData.issueDate, formData.dueDate, formData.notes, formData.paymentMethod]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                alert('El logo es demasiado pesado. Por favor, usa una imagen menor a 1MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                store.updateSender({ logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;
        store.reorderItems(result.source.index, result.destination.index);
    };

    const selectClient = (client: ReceiverInfo) => {
        store.updateReceiver(client);
        setShowClientSuggestions(false);
    };

    const templates = [
        { id: 'modern', label: 'Moderno' },
        { id: 'corporate', label: 'Corporate' },
        { id: 'creative', label: 'Creativo' },
    ] as const;

    const currencies = [
        { id: 'EUR', symbol: '€' },
        { id: 'USD', symbol: '$' },
        { id: 'GBP', symbol: '£' },
        { id: 'MXN', symbol: 'MX$' },
    ] as const;

    // New numeric logic: Handle as string while typing
    const onNumericInputChange = (id: string, field: 'qty' | 'price' | 'taxRate', rawValue: string) => {
        // Basic cleaning, allow dot/comma
        const value = rawValue.replace(',', '.');

        // Validate: only numbers and one dot
        if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;

        // Update local string state
        const inputKey = id === 'settings' ? 'taxRate' : `${id}-${field}`;
        setLocalInputs(prev => ({ ...prev, [inputKey]: value }));

        // Update store if it's a valid number
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            if (field === 'taxRate') {
                store.updateSettings({ taxRate: numericValue });
            } else if (field === 'price') {
                // We update the store immediately for calculations, 
                // but rounding specifically happens on blur to avoid "jumping" while typing decimals
                store.updateItem(id, { price: Math.round(numericValue * 100) });
            } else {
                store.updateItem(id, { qty: numericValue });
            }
        } else if (value === '') {
            // Handle clear
            if (field === 'taxRate') store.updateSettings({ taxRate: 0 });
            else if (field === 'price') store.updateItem(id, { price: 0 });
            else store.updateItem(id, { qty: 0 });
        }
    };

    const onNumericInputBlur = (id: string, field: 'qty' | 'price' | 'taxRate') => {
        const inputKey = id === 'settings' ? 'taxRate' : `${id}-${field}`;
        const rawValue = localInputs[inputKey];
        if (rawValue === undefined || rawValue === '') return;

        const numericValue = parseFloat(rawValue);
        if (!isNaN(numericValue)) {
            if (field === 'price') {
                // Round to max 2 decimals when focus is lost
                const roundedPrice = Math.round(numericValue * 100) / 100;
                setLocalInputs(prev => ({ ...prev, [inputKey]: roundedPrice.toString() }));
                store.updateItem(id, { price: Math.round(roundedPrice * 100) });
            } else if (field === 'taxRate') {
                // Just normalize to a string
                setLocalInputs(prev => ({ ...prev, [inputKey]: numericValue.toString() }));
            }
        }
    };

    const getNumericValue = (id: string, field: 'qty' | 'price' | 'taxRate', storeValue: number) => {
        const inputKey = id === 'settings' ? 'taxRate' : `${id}-${field}`;
        if (localInputs[inputKey] !== undefined) return localInputs[inputKey];
        return field === 'price' ? (storeValue / 100).toString() : storeValue.toString();
    };

    return (
        <div className="p-4 space-y-4 pb-24 scale-[0.98] origin-top">
            {/* 1. Datos Factura */}
            <Accordion title="Datos de la Factura" icon={FileText} color="bg-indigo-50 text-indigo-700" defaultOpen={true}>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        {store.sender.logo ? (
                            <div className="relative group">
                                <img src={store.sender.logo} alt="Logo" className="h-12 w-12 object-contain bg-white rounded border border-gray-100 p-1" />
                                <button onClick={() => store.updateSender({ logo: '' })} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-2.5 h-2.5" /></button>
                            </div>
                        ) : (
                            <label className="h-12 w-12 bg-white border border-gray-200 rounded flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                <Building className="w-5 h-5 text-gray-400" />
                            </label>
                        )}
                        <p className="text-[9px] font-bold text-gray-400 uppercase italic">Cargar Logo (PNG/JPG &lt; 1MB)</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Nº Factura" maxLength={20} {...register('number')} error={errors.number?.message} />
                        <div className="grid grid-cols-2 gap-2 col-span-2">
                            <Input label="Emisión" type="date" {...register('issueDate')} />
                            <Input label="Vencimiento" type="date" {...register('dueDate')} />
                        </div>
                    </div>
                </div>
            </Accordion>

            {/* 2. Emisor */}
            <Accordion title="Tus Datos (Emisor)" icon={Briefcase} color="bg-blue-50 text-blue-700" defaultOpen={false}>
                <div className="space-y-3">
                    <Input label="Nombre o Empresa" maxLength={50} value={store.sender.name} onChange={(e) => store.updateSender({ name: e.target.value })} />
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="NIF / CIF" maxLength={15} value={store.sender.taxId} onChange={(e) => store.updateSender({ taxId: e.target.value })} />
                        <Input label="Teléfono" maxLength={20} value={store.sender.phone} onChange={(e) => store.updateSender({ phone: e.target.value })} />
                    </div>
                    <Input label="Dirección" maxLength={100} value={store.sender.address} onChange={(e) => store.updateSender({ address: e.target.value })} />
                    <Input label="Email" value={store.sender.email} onChange={(e) => store.updateSender({ email: e.target.value })} />
                </div>
            </Accordion>

            {/* 3. Cliente */}
            <Accordion title="Datos del Cliente" icon={User} color="bg-emerald-50 text-emerald-700" defaultOpen={false}>
                <div className="space-y-3 relative">
                    <div className="relative">
                        <Input
                            label="Nombre del Cliente"
                            maxLength={60}
                            value={store.receiver.name}
                            onChange={(e) => {
                                store.updateReceiver({ name: e.target.value });
                                setShowClientSuggestions(true);
                            }}
                            onFocus={() => setShowClientSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowClientSuggestions(false), 200)}
                        />
                        {showClientSuggestions && store.clientHistory.length > 0 && (
                            <div className="absolute z-30 w-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 max-h-40 overflow-y-auto">
                                {store.clientHistory.filter(c => c.name.toLowerCase().includes(store.receiver.name.toLowerCase())).map((client, i) => (
                                    <button
                                        key={i}
                                        onClick={() => selectClient(client)}
                                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
                                    >
                                        <span className="text-xs font-bold text-gray-700">{client.name}</span>
                                        <Search className="w-3 h-3 text-gray-300 group-hover:text-indigo-500" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="NIF / CIF del Cliente" maxLength={15} value={store.receiver.taxId} onChange={(e) => store.updateReceiver({ taxId: e.target.value })} />
                        <Input label="Dirección" maxLength={100} value={store.receiver.address} onChange={(e) => store.updateReceiver({ address: e.target.value })} />
                    </div>
                </div>
            </Accordion>

            {/* 4. Conceptos */}
            <Accordion title="Conceptos" icon={Hash} color="bg-amber-50 text-amber-700" defaultOpen={false}>
                <div className="space-y-4">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="items">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                    {store.items.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`p-3 bg-gray-50/50 rounded-xl border ${snapshot.isDragging ? 'border-indigo-500 shadow-xl z-50 bg-white' : 'border-gray-100'} space-y-3 group relative`}
                                                >
                                                    <div {...provided.dragHandleProps} className="absolute left-1/2 -top-2 -translate-x-1/2 bg-white rounded-full border border-gray-100 p-1 opacity-100 cursor-grab">
                                                        <GripVertical className="w-3 h-3 text-gray-400" />
                                                    </div>

                                                    <button onClick={() => store.removeItem(item.id)} className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 rounded-full p-1 z-10"><Trash2 className="w-3 h-3" /></button>

                                                    <Input label={`Concepto ${index + 1}`} maxLength={150} value={item.desc} onChange={(e) => store.updateItem(item.id, { desc: e.target.value })} placeholder="Ej: Diseño Web..." />

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Input label="Cantidad" type="text" maxLength={7} value={getNumericValue(item.id, 'qty', item.qty)} onChange={(e) => onNumericInputChange(item.id, 'qty', e.target.value)} onBlur={() => onNumericInputBlur(item.id, 'qty')} />
                                                        <Input label={`Precio (${currencies.find(c => c.id === store.settings.currency)?.symbol})`} type="text" maxLength={12} value={getNumericValue(item.id, 'price', item.price)} onChange={(e) => onNumericInputChange(item.id, 'price', e.target.value)} onBlur={() => onNumericInputBlur(item.id, 'price')} />
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    {(() => {
                        const lastItem = store.items[store.items.length - 1];
                        const isLastItemIncomplete = lastItem && (!lastItem.desc.trim() || lastItem.qty <= 0 || lastItem.price <= 0);

                        return (
                            <div className="space-y-2">
                                <button
                                    disabled={isLastItemIncomplete}
                                    onClick={() => store.addItem({ id: crypto.randomUUID(), desc: '', qty: 1, price: 0 })}
                                    className={`w-full py-3 border-2 border-dashed rounded-xl text-xs font-black uppercase shadow-sm transition-all flex items-center justify-center gap-2 
                                        ${isLastItemIncomplete
                                            ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50/50 opacity-50'
                                            : 'border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                >
                                    <Plus className="w-4 h-4" /> Añadir Concepto
                                </button>
                                {isLastItemIncomplete && (
                                    <p className="text-[10px] text-amber-600 font-medium text-center animate-pulse">
                                        Completa el concepto anterior para añadir uno nuevo
                                    </p>
                                )}
                            </div>
                        );
                    })()}
                </div>
            </Accordion>

            {/* 5. Configuración */}
            <Accordion title="Configuración" icon={Settings} color="bg-slate-50 text-slate-700" defaultOpen={false}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Estilo Visual</label>
                            <div className="flex flex-wrap gap-1">
                                {templates.map((t) => (
                                    <button key={t.id} onClick={() => store.updateSettings({ template: t.id })} className={`flex-1 min-w-[80px] px-2 py-2 rounded-lg border text-[9px] font-black uppercase transition-all ${store.settings.template === t.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-200 hover:border-indigo-300'}`}>{t.label}</button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Moneda</label>
                            <div className="grid grid-cols-4 gap-1">
                                {currencies.map((c) => (
                                    <button key={c.id} onClick={() => store.updateSettings({ currency: c.id })} className={`px-1 py-2 rounded-lg border text-[9px] font-black uppercase transition-all ${store.settings.currency === c.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-400 border-gray-200 hover:border-indigo-300'}`}>{c.symbol}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Input label="Impuesto (%)" type="text" maxLength={5} value={getNumericValue('settings', 'taxRate', store.settings.taxRate)} onChange={(e) => onNumericInputChange('settings', 'taxRate', e.target.value)} onBlur={() => onNumericInputBlur('settings', 'taxRate')} />
                </div>
            </Accordion>

            {/* 6. Notas y Términos */}
            <Accordion title="Notas y Pago" icon={Hash} color="bg-gray-50 text-gray-700" defaultOpen={false}>
                <TextArea label="Notas y Términos" maxLength={500} {...register('notes')} placeholder="Gracias por su confianza o condiciones específicas..." rows={4} />
                <div className="mt-4">
                    <Input label="Método de Pago" maxLength={100} {...register('paymentMethod')} placeholder="Transferencia Bancaria, IBAN..." />
                </div>
            </Accordion>

        </div>
    );
};

export default EditorPanel;
