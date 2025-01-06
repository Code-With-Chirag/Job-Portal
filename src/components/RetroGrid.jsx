import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const RetroGrid = ({ className, angle = 65 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const drawGrid = (time) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const gridSize = 50;
            const lineWidth = 1;
            const scrollSpeed = 0.05;

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = lineWidth;

            const angleRad = (angle * Math.PI) / 180;
            const cos = Math.cos(angleRad);
            const sin = Math.sin(angleRad);

            const offset = (time * scrollSpeed) % gridSize;

            for (let i = -canvas.height; i < canvas.width + canvas.height; i += gridSize) {
                const startX = i - offset;
                const startY = 0;
                const endX = startX + canvas.height * sin;
                const endY = canvas.height;

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }

            for (let i = -canvas.width; i < canvas.height + canvas.width; i += gridSize) {
                const startX = 0;
                const startY = i - offset;
                const endX = canvas.width;
                const endY = startY + canvas.width * cos;

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }

            animationFrameId = requestAnimationFrame(drawGrid);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        drawGrid(0);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [angle]);

    return <canvas ref={canvasRef} className={cn('bg-[#B4A5FF]', className)} />;
};

export default RetroGrid;
