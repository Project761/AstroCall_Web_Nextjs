"use client";

const Loader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="relative w-16 h-16 animate-spin-slower">
                {[...Array(8)].map((_, i) => {
                    const angle = (i * 360) / 11;
                    const radius = 48;
                    const x = radius * Math.cos((angle * Math.PI) / 180);
                    const y = radius * Math.sin((angle * Math.PI) / 180);
                    return (
                        <div
                            key={i}
                            className="absolute w-3 h-3 bg-orange-500 rounded-full"
                            style={{
                                top: `calc(50% + ${y}px)`,
                                left: `calc(50% + ${x}px)`,
                                transform: 'translate(-50%, -50%)',
                            }}
                        ></div>
                    );
                })}
            </div>

            <style>
                {`
          .animate-spin-slower {
            animation: spin 2s linear infinite; /* Slow speed */
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
};

export default Loader;
