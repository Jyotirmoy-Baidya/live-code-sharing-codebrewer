import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaCopy, FaRegCopy } from 'react-icons/fa';
import { IoIosShareAlt } from 'react-icons/io';

const CopyLinkToClipboard = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const copyText = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            toast.success('Link Copied', {
                style: {
                    border: '1px solid #1BF1A1',
                    padding: '16px',
                    color: '#1BF1A1',
                    backgroundColor: '#0D1418'
                },
                iconTheme: {
                    primary: '#1BF1A1',
                    secondary: '#0D1418',
                },
            });
            setCopied(true);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };

    return (
        <button
            onClick={copyText}
            className="px-1 py-1  text-white rounded-md focus:outline-none"
        >
            {copied ? <IoIosShareAlt className='text-primary' /> : <IoIosShareAlt />}
        </button>
    );
};

export default CopyLinkToClipboard;
