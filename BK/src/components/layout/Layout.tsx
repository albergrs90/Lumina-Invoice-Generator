import React from 'react';
import ActionBar from './ActionBar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <header className="sticky top-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <ActionBar />
            </header>
            <main className="flex-1 flex overflow-hidden">
                {children}
            </main>
        </div>
    );
};

export default Layout;
