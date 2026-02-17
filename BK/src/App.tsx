import { useState } from 'react';
import Layout from './components/layout/Layout';
import EditorPanel from './components/invoice/EditorPanel';
import InvoiceCanvas from './components/invoice/InvoiceCanvas';
import { useInvoiceStore } from './store/invoiceStore';
import { Edit3, Eye } from 'lucide-react';

function App() {
    const [view, setView] = useState<'edit' | 'preview'>('edit');

    return (
        <Layout>
            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden relative">
                {/* Mobile Navigation */}
                <div className="md:hidden flex bg-white border-b border-gray-200">
                    <button
                        onClick={() => setView('edit')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all ${view === 'edit' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-400'}`}
                    >
                        <Edit3 className="w-4 h-4" />
                        Editor
                    </button>
                    <button
                        onClick={() => setView('preview')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all ${view === 'preview' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-400'}`}
                    >
                        <Eye className="w-4 h-4" />
                        Vista Previa
                    </button>
                </div>

                {/* Editor Sidebar */}
                <aside className={`w-full md:w-[380px] lg:w-[420px] bg-gray-50 overflow-y-auto custom-scrollbar shadow-inner ${view === 'preview' ? 'hidden md:block' : 'block'}`}>
                    <EditorPanel />
                </aside>

                {/* Preview Area */}
                <section className={`flex-1 bg-slate-200/50 overflow-y-auto p-4 md:p-8 lg:p-12 flex flex-col items-center custom-scrollbar ${view === 'edit' ? 'hidden md:flex' : 'flex'}`}>
                    <div className="w-full h-full flex items-start justify-center py-8">
                        <div className="transform scale-[0.7] md:scale-[0.85] lg:scale-[0.95] xl:scale-100 origin-top shadow-2xl rounded-[2rem] transition-transform duration-500">
                            <InvoiceCanvas />
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}

export default App;
