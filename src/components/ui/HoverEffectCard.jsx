import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const HoverEffectCard = ({ children, className }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={cn(
                "relative group block p-2 h-full w-full",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.span
                        className="absolute inset-0 h-full w-full bg-purple-100 dark:bg-purple-900/[0.3] block rounded-2xl"
                        layoutId="hoverBackground"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: { duration: 0.15 },
                        }}
                        exit={{
                            opacity: 0,
                            transition: { duration: 0.15, delay: 0.2 },
                        }}
                    />
                )}
            </AnimatePresence>
            <div className="rounded-xl h-full w-full p-6 overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group-hover:border-purple-500 dark:group-hover:border-purple-400 relative z-20 transition-all duration-300">
                <div className="relative z-50">
                    {children}
                </div>
            </div>
        </div>
    );
};


