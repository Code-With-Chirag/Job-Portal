import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export const BlurImage = ({ src, alt, className, ...props }) => {
    const [isLoading, setLoading] = useState(true);

    return (
        <img
            {...props}
            src={src}
            alt={alt}
            className={cn(
                'w-full h-full object-cover transition-all duration-700 ease-in-out',
                isLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0 scale-100',
                className
            )}
            onLoad={() => setLoading(false)}
        />
    );
};
