"use client";

import dynamic from "next/dynamic";

// Dynamically import Globe3D to avoid SSR issues
const Globe3D = dynamic(() => import("@/components/3d/Globe3D"), {
    ssr: false,
    loading: () => <div className="w-full h-full animate-pulse bg-white/5" />,
});

export default function SceneAuthentication() {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#030308] z-0">
            {/* Background radial glow - Softer, more spread out */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00DC82]/5 via-[#030308]/60 to-[#030308] pointer-events-none z-0" />

            {/* Layer 2: Vignette Overlay - Deep Gradient for focus */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030308] via-transparent to-[#030308]/80 pointer-events-none z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030308] via-transparent to-[#030308]/80 pointer-events-none z-10" />

            {/* Layer 3: Large 3D Globe - Floating freely */}
            {/* Positioned absolutely to ensure it's in the background, not blocking layout */}
            {/* Adjusted scale and position to ensure it's not too stuck to the left */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none transform translate-y-24 scale-150 opacity-70 mix-blend-screen blur-[0.5px]">
                <Globe3D size={800} />
            </div>
        </div>
    );
}
