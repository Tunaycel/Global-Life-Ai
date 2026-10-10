"use client";

import { useEffect, useState } from "react";

const FLAGS = [
    "🇹🇷", "🇬🇧", "🇩🇪", "🇵🇱", "🇺🇸", "🇫🇷", "🇪🇸", "🇮🇹",
    "🇯🇵", "🇰🇷", "🇨🇦", "🇦🇺", "🇧🇷", "🇳🇱", "🇨🇭", "🇸🇪",
    "🇦🇪", "🇸🇬", "🇳🇴", "🇦🇹",
];

interface FlagItem {
    emoji: string;
    x: number;
    y: number;
    size: number;
    speed: number;
    drift: number;
    delay: number;
    opacity: number;
    rotation: number;
}

function makeFlags(): FlagItem[] {
    return FLAGS.map((emoji, i) => ({
        emoji,
        x: Math.random() * 100,
        y: 5 + (i / FLAGS.length) * 90,
        size: 20 + Math.random() * 24,
        speed: 15 + Math.random() * 25,
        drift: 20 + Math.random() * 40,
        delay: Math.random() * 10,
        opacity: 0.08 + Math.random() * 0.12,
        rotation: Math.random() * 30 - 15,
    }));
}

export default function FloatingFlags() {
    const [flags, setFlags] = useState<FlagItem[]>([]);

    // Random positions only on the client (the server render would not match),
    // set on the next frame instead of synchronously inside the effect.
    useEffect(() => {
        const frame = requestAnimationFrame(() => setFlags(makeFlags()));
        return () => cancelAnimationFrame(frame);
    }, []);

    if (flags.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
            {flags.map((f, i) => (
                <span
                    key={i}
                    className="absolute select-none"
                    style={{
                        left: `${f.x}%`,
                        top: `${f.y}%`,
                        fontSize: `${f.size}px`,
                        opacity: f.opacity,
                        transform: `rotate(${f.rotation}deg)`,
                        animation: `flagFloat${i % 3} ${f.speed}s ease-in-out ${f.delay}s infinite`,
                        filter: "blur(0.5px)",
                    }}
                >
                    {f.emoji}
                </span>
            ))}

            <style jsx>{`
        @keyframes flagFloat0 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-30px) translateX(15px) rotate(5deg); }
          50% { transform: translateY(-10px) translateX(-10px) rotate(-3deg); }
          75% { transform: translateY(-40px) translateX(20px) rotate(8deg); }
        }
        @keyframes flagFloat1 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          33% { transform: translateY(-45px) translateX(-20px) rotate(-6deg); }
          66% { transform: translateY(-15px) translateX(25px) rotate(4deg); }
        }
        @keyframes flagFloat2 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          20% { transform: translateY(-20px) translateX(30px) rotate(10deg); }
          40% { transform: translateY(-50px) translateX(-15px) rotate(-5deg); }
          60% { transform: translateY(-25px) translateX(10px) rotate(3deg); }
          80% { transform: translateY(-35px) translateX(-25px) rotate(-8deg); }
        }
      `}</style>
        </div>
    );
}
