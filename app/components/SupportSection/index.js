"use client";

import React from 'react';
import Link from 'next/link';

const SupportSection = () => {
    return (
        <div className="bg-orange-50 rounded-lg py-6  text-center shadow-lg">
            <div className='main-container mx-auto bg-[#fff] p-6 rounded-lg shadow-lg'>
                <h2 className="text-orange-500 font-semibold text-lg">Still Have Questions?</h2>
                <p className="text-gray-600 mt-2 text-sm">
                    Our customer support team is here to help you with any questions or concerns
                </p>
                <Link
                    href="/support"
                    className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded transition"
                >
                    Contact Support
                </Link>
            </div>
        </div>
    );
};

export default SupportSection;
