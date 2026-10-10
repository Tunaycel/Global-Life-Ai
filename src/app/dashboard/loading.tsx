import Skeleton from "@/components/ui/Skeleton";

export default function DashboardLoading() {
    return (
        <div className="space-y-6" role="status" aria-busy="true">
            <span className="sr-only">Yükleniyor…</span>
            <div className="space-y-2">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-80 max-w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-36" />
                <Skeleton className="h-36" />
                <Skeleton className="h-36" />
            </div>
            <Skeleton className="h-64" />
        </div>
    );
}
