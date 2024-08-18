import React, { useState } from 'react';

const CustomDropdown = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleOptionClick = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="relative text-left">
            <button
                onClick={toggleDropdown}
                className="border border-gray-200 py-1 px-4 rounded-md bg-transparent text-white flex items-center justify-between gap-6 text-lg"
            >
                <div>{value}</div>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full py-1 bg-gray-300 opacity-95 rounded-md shadow-lg">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleOptionClick(option.value)}
                            className="block w-full text-left px-4 py-2 text-black hover:bg-gray-500"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
