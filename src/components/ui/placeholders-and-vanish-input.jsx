"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function PlaceholdersAndVanishInput({
    placeholders,
    onChange,
    onSubmit,
}) {
    const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
    const intervalRef = useRef(null);
    const [value, setValue] = useState("");
    const [animating, setAnimating] = useState(false);
    const inputRef = useRef(null);
    const canvasRef = useRef(null);
    const newDataRef = useRef([]);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
        }, 3000); // Change placeholder every 3 seconds

        return () => clearInterval(intervalRef.current);
    }, [placeholders]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (value.trim() && !animating) {
            onSubmit && onSubmit(value);
            setValue("");
        }
    }, [value, animating, onSubmit]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
        }
    }, [handleSubmit]);

    const handleChange = useCallback((e) => {
        if (!animating) {
            setValue(e.target.value);
            onChange && onChange(e);
        }
    }, [animating, onChange]);

    // ... (rest of the component logic remains the same as in the Aceternity UI example)

    return (
        <form
            className={cn(
                "w-full relative max-w-xl mx-auto bg-purple-50 dark:bg-zinc-800 h-12 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200",
                value && "bg-gray-50"
            )}
            onSubmit={handleSubmit}
        >
            <canvas
                className={cn(
                    "absolute pointer-events-none text-base transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left filter invert dark:invert-0 pr-20",
                    !animating ? "opacity-0" : "opacity-100"
                )}
                ref={canvasRef}
            />
            <input
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                value={value}
                type="text"
                className={cn(
                    "w-full relative text-sm sm:text-base z-50 border-none dark:text-white bg-transparent text-[#122c6f] h-full rounded-full focus:outline-none focus:ring-0 pl-4 sm:pl-10 pr-20",
                    animating && "text-transparent dark:text-transparent"
                )}
            />
            <button
                disabled={!value}
                type="submit"
                className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full disabled:bg-gray-100 bg-[#6A38C2] dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200 flex items-center justify-center"
            >
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white h-4 w-4"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <motion.path
                        d="M5 12l14 0"
                        initial={{
                            strokeDasharray: "50%",
                            strokeDashoffset: "50%",
                        }}
                        animate={{
                            strokeDashoffset: value ? 0 : "50%",
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "linear",
                        }}
                    />
                    <path d="M13 18l6 -6" />
                    <path d="M13 6l6 6" />
                </motion.svg>
            </button>
            <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
                <AnimatePresence mode="wait">
                    {!value && (
                        <motion.p
                            initial={{
                                y: 5,
                                opacity: 0,
                            }}
                            key={`current-placeholder-${currentPlaceholder}`}
                            animate={{
                                y: 0,
                                opacity: 1,
                            }}
                            exit={{
                                y: -15,
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.3,
                                ease: "linear",
                            }}
                            className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-12 text-left w-[calc(100%-2rem)] truncate"
                        >
                            {placeholders[currentPlaceholder]}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </form>
    );
}
