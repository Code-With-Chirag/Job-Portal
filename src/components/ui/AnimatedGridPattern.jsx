import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const AnimatedGridPattern = ({
    className,
    width = 40,
    height = 40,
    numSquares = 200,
    maxOpacity = 0.3,
}) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const columns = Math.ceil(dimensions.width / width);
    const rows = Math.ceil(dimensions.height / height);
    const totalSquares = columns * rows;

    const squares = Array.from({ length: totalSquares }, (_, i) => i);

    return (
        <div className={`fixed inset-0 ${className}`}>
            <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width={width} height={height} patternUnits="userSpaceOnUse">
                        <path
                            d={`M${width},0H0V${height}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {squares.map((i) => (
                    <motion.rect
                        key={i}
                        width={width}
                        height={height}
                        x={(i % columns) * width}
                        y={Math.floor(i / columns) * height}
                        fill="currentColor"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: Math.random() * maxOpacity }}
                        transition={{
                            duration: Math.random() * 2 + 1,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </svg>
        </div>
    );
};
