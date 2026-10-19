import { redirect } from "next/navigation";
import { units } from "@/content";

/** There is no lesson list yet, so this address opens the first lesson. */
export default function LessonIndexPage() {
    redirect(`/dashboard/language/lesson/${units[0].lessons[0].id}`);
}
