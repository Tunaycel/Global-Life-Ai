import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findLesson, units } from "@/content";
import LessonPlayer from "@/components/lessons/LessonPlayer";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
    return units.flatMap((unit) => unit.lessons.map((lesson) => ({ id: lesson.id })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const found = findLesson((await params).id);
    if (!found) return {};
    return { title: found.lesson.title, description: found.lesson.goal };
}

export default async function LessonPage({ params }: Props) {
    const found = findLesson((await params).id);
    if (!found) notFound();

    return <LessonPlayer unit={found.unit} lesson={found.lesson} />;
}
