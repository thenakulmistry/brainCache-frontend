import { useState } from "react";
import { ChevronIcon } from "../icons/CevronIcon";

interface SelectProps {
    options: { value: string; label: string }[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

export const Select = ({ options, value, onChange, placeholder, label }: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="w-full relative">
            {label && <label className="text-gray-400 text-sm mb-2 block">{label}</label>}
            
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-2 cursor-pointer flex justify-between items-center hover:bg-gray-800 transition-all outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
                <span className={selectedOption ? "text-white" : "text-gray-400"}>
                    {selectedOption ? selectedOption.label : placeholder || "Select an option"}
                </span>
                
                <ChevronIcon isOpen={isOpen} />
            </div>

            {isOpen && (
                <div className="absolute w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                    {options.map((option) => (
                        <div 
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`px-4 py-2 cursor-pointer transition-colors ${
                                value === option.value 
                                    ? "bg-indigo-900/50 text-white" 
                                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
            
            {isOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            )}
        </div>
    );
};