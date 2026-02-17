import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', maxLength = 100, ...props }, ref) => (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
            <input
                ref={ref}
                maxLength={maxLength}
                className={`px-4 py-2 bg-white border ${error ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm ${className}`}
                {...props}
            />
            {error && <span className="text-[10px] font-medium text-red-500 mt-0.5">{error}</span>}
        </div>
    )
);
Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ label, error, className = '', maxLength = 500, ...props }, ref) => (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
            <textarea
                ref={ref}
                maxLength={maxLength}
                className={`px-4 py-2 bg-white border ${error ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm resize-none ${className}`}
                {...props}
            />
            {error && <span className="text-[10px] font-medium text-red-500 mt-0.5">{error}</span>}
        </div>
    )
);
TextArea.displayName = 'TextArea';

export const Button = ({ children, className = '', ...props }: any) => (
    <button
        className={`px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 ${className}`}
        {...props}
    >
        {children}
    </button>
);
export * from './Modal';
export * from './Accordion';
