import type { Metadata } from "next";

// The dashboard page and layout are client components, so the title lives in
// this route group instead. "(overview)" does not change the URL.
export const metadata: Metadata = {
    title: "Panel",
    description: "Dil öğrenme ve vize sürecine tek yerden göz at.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
